import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import VatReturnDeclaration, {SubmitDeclarationState, VatReturnDeclarationSubmitRequest} from '../model/vat-return.model';
import {tap} from 'rxjs';
import {toEnumOrThrow} from '../util/enum.util';

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

        return declarations;
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

      new Promise((resolve) => this.getBySaleId(saleId).subscribe(resolve));
    }

    return computed(() => this.store.get(instanceId)!().find(it => it.sale.id === saleId));
  }

  readonly submit = (request: VatReturnDeclarationSubmitRequest) => {
    return this.httpClient.post<VatReturnDeclaration>(this.apiRouter.vatReturnSubmit(), request).pipe(
      tap(declaration => this.updateSingleInStore(request.instanceId, this.updateProperties(declaration)))
    );
  }

  readonly updateProperties = (declaration: VatReturnDeclaration): VatReturnDeclaration => {
    return {
      ...declaration,
      state: toEnumOrThrow(declaration.state, SubmitDeclarationState),
    }
  }
}
