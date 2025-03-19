import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import VatReturnDeclaration, {SubmitDeclarationState, VatReturnDeclarationSubmitRequest} from '../model/vat-return.model';
import {catchError, first, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import ErrorResponse from '../model/error-response.model';
import {InternalFailure} from '../model/internal-failure-code.model';

@Injectable({
  providedIn: 'root'
})
export class VatReturnService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<VatReturnDeclaration[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  private readonly updateSingleInStore = (instanceId: number, declaration: VatReturnDeclaration) => {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(declarations => {
        const index = declarations.findIndex(c => c.id === declaration.id);

        if (index !== -1) {
          declarations[index] = declaration;
        } else {
          declarations.push(declaration);
        }

        return [...declarations];
      });
    } else {
      this.store.set(instanceId, signal([declaration]));
    }
  }

  readonly getBySaleId = (saleId: number) => {
    return this.httpClient.get<VatReturnDeclaration>(this.apiRouter.vatReturnGet(saleId)).pipe(
      tap(declaration => {
        if (declaration != null) {
          this.updateSingleInStore(declaration.instanceId!, this.updateProperties(declaration));
        }
      })
    );
  }

  /**
   * Get declaration by sale id as signal
   *
   * @param instanceId Instance id to easier resolve where sale belongs
   * @param saleId Sale id to get declaration for
   *
   * @returns Declaration as signal. It may be undefined if declaration is not found.
   */
  readonly getBySaleIdAsSignal = (instanceId: number, saleId: number) => {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));
    }

    const existing = this.store.get(instanceId)!().find(it => it.saleId === saleId);

    if (existing == null) {
      new Promise((resolve) => this.getBySaleId(saleId).pipe(first()).subscribe(resolve));
    }

    return computed(() => this.store.get(instanceId)!().find(it => it.saleId === saleId));
  }

  readonly submit = (request: VatReturnDeclarationSubmitRequest) => {
    return this.httpClient.post<VatReturnDeclaration>(this.apiRouter.vatReturnSubmit(), request).pipe(
      tap(declaration => this.updateSingleInStore(request.instanceId, this.updateProperties(declaration))),
      catchError(response => {
        const errorResponse = response as ErrorResponse | undefined;

        if (errorResponse?.error?.internalFailure != null) {
          const failure = EnumUtil.toEnum(errorResponse.error.internalFailure, InternalFailure);

          if (failure == InternalFailure.VatReturnDeclarationSubmitRejectedButUpdated) {
            this.getBySaleId(request.sale.id).pipe(first()).subscribe();
          }
        }

        throw response;
      })
    );
  }

  readonly updateProperties = (declaration: VatReturnDeclaration): VatReturnDeclaration => {
    return {
      ...declaration,
      state: EnumUtil.toEnumOrThrow(declaration.state, SubmitDeclarationState),
    }
  }
}
