import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import VatReturnDeclaration, {
  SubmitDeclarationState,
  VatReturnDeclarationExportVerificationResult,
  VatReturnDeclarationSubmitRequest,
  VatReturnDeclarationWithDeclarer,
  VatReturnDeclarationWithSale
} from '../model/vat-return.model';
import {catchError, first, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import ErrorResponse from '../model/error-response.model';
import {InternalFailure} from '../model/internal-failure-code.model';
import {UserService} from './user.service';
import {SaleService} from './sale.service';
import {UnitOfMeasureType} from '../model/unit-of-measure-type.model';

@Injectable({
  providedIn: 'root'
})
export class VatReturnService {
  // Key: InstanceId
  private readonly store = new Map<number, WritableSignal<VatReturnDeclaration[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient,
    private saleService: SaleService,
    private userService: UserService,
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

  readonly cancel = (saleId: number) => {
    return this.httpClient.post<void>(this.apiRouter.vatReturnCancel(saleId), {}).pipe(
      tap(() => this.getBySaleId(saleId).subscribe())
    );
  }

  readonly getWithSaleByPreviewCode = (id: string) => {
    return this.httpClient.get<VatReturnDeclarationWithSale>(this.apiRouter.vatReturnGetByPreviewCode(id)).pipe(
      tap(declaration => {
        if (declaration != null) {
          this.updateSingleInStore(
            declaration.instanceId!,
            this.updateProperties({
                ...declaration,
                sale: this.saleService.updateProperties(declaration.sale)
              } as VatReturnDeclarationWithSale
            )
          );
        }
      })
    );
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

  readonly getWithDeclarerBySaleIdAsSignal = (instanceId: number, saleId: number) => {
    return computed(() => {
      const declaration = this.getBySaleIdAsSignal(instanceId, saleId)();

      if (declaration == null) {
        return undefined;
      }

      return {
        ...declaration,
        declaredBy: declaration?.declaredById == null ? undefined : this.userService.getByIdAsSignal(declaration.declaredById)()
      } as VatReturnDeclarationWithDeclarer;
    });
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

  readonly update = (saleId: number) => {
      return this.httpClient.post<void>(this.apiRouter.vatReturnUpdate(saleId), {}).pipe(
        tap(() => this.getBySaleId(saleId).subscribe())
      );
  }

  readonly updateByPreviewCode = (code: string) => {
    return this.httpClient.post<void>(this.apiRouter.vatReturnUpdateByPreviewCode(code), {}).pipe(
      tap(() => this.getWithSaleByPreviewCode(code).subscribe())
    );
  }

  readonly updateProperties = (declaration: VatReturnDeclaration): VatReturnDeclaration => {
    return {
      ...declaration,
      state: EnumUtil.toEnumOrThrow(declaration.state, SubmitDeclarationState),
      export: declaration.export && {
        ...declaration.export,
        verificationResult: EnumUtil.toEnumOrThrow(declaration.export.verificationResult, VatReturnDeclarationExportVerificationResult),
        verifiedSoldGoods: declaration.export.verifiedSoldGoods.map(it => ({
          ...it,
          unitOfMeasureType: EnumUtil.toEnumOrThrow(it.unitOfMeasureType, UnitOfMeasureType),
        }))
      } || undefined
    };
  }
}
