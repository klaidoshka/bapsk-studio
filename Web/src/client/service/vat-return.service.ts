import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import VatReturnDeclaration, {
  SubmitDeclarationState,
  VatReturnDeclarationExportVerificationResult,
  VatReturnDeclarationSubmitRequest,
  VatReturnDeclarationWithDeclarer,
  VatReturnDeclarationWithSale
} from '../model/vat-return.model';
import {catchError, first, map, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {containsFailureCode} from '../model/error-response.model';
import {FailureCode} from '../model/failure-code.model';
import {UserService} from './user.service';
import {SaleService} from './sale.service';
import {UnitOfMeasureType} from '../model/unit-of-measure-type.model';

@Injectable({
  providedIn: 'root'
})
export class VatReturnService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly saleService = inject(SaleService);
  private readonly userService = inject(UserService);

  // Key: InstanceId
  private readonly store = new Map<number, WritableSignal<VatReturnDeclaration[]>>();

  private updateSingleInStore(instanceId: number, declaration: VatReturnDeclaration) {
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

  cancel(saleId: number) {
    return this.httpClient.post<void>(this.apiRouter.vatReturnCancel(saleId), {}).pipe(
      tap(() => this.getBySaleId(saleId).subscribe())
    );
  }

  getWithSaleByPreviewCode(id: string) {
    return this.httpClient.get<VatReturnDeclarationWithSale | null>(this.apiRouter.vatReturnGetByPreviewCode(id))
      .pipe(
        map(declaration => {
          if (declaration) {
            return this.updateProperties({
                ...declaration,
                sale: this.saleService.updateProperties(declaration.sale)
              } as VatReturnDeclarationWithSale
            ) as VatReturnDeclarationWithSale;
          } else {
            return declaration;
          }
        }),
        tap(declaration => {
          if (declaration != null) {
            this.updateSingleInStore(
              declaration.instanceId!,
              declaration
            );
          }
        })
      );
  }

  getBySaleId(saleId: number) {
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
  getBySaleIdAsSignal(instanceId: number, saleId: number) {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));
    }

    const existing = this.store.get(instanceId)!().find(it => it.saleId === saleId);

    if (existing == null) {
      new Promise((resolve) => this.getBySaleId(saleId).pipe(first()).subscribe(resolve));
    }

    return computed(() => this.store.get(instanceId)!().find(it => it.saleId === saleId));
  }

  getWithDeclarerBySaleIdAsSignal(instanceId: number, saleId: number) {
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

  submit(request: VatReturnDeclarationSubmitRequest) {
    return this.httpClient.post<VatReturnDeclaration>(this.apiRouter.vatReturnSubmit(), request)
      .pipe(
        tap(declaration => this.updateSingleInStore(request.instanceId, this.updateProperties(declaration))),
        catchError(response => {
          if (containsFailureCode(response, FailureCode.VatReturnDeclarationSubmitRejectedButUpdated)) {
            this.getBySaleId(request.sale.id).pipe(first()).subscribe();
          }

          throw response;
        })
      );
  }

  update(saleId: number) {
    return this.httpClient.post<void>(this.apiRouter.vatReturnUpdate(saleId), {}).pipe(
      tap(() => this.getBySaleId(saleId).subscribe())
    );
  }

  updateByPreviewCode(code: string) {
    return this.httpClient.post<void>(this.apiRouter.vatReturnUpdateByPreviewCode(code), {}).pipe(
      tap(() => this.getWithSaleByPreviewCode(code).subscribe())
    );
  }

  updateProperties(declaration: VatReturnDeclaration): VatReturnDeclaration {
    return {
      ...declaration,
      state: EnumUtil.toEnumOrThrow(declaration.state, SubmitDeclarationState),
      export: declaration.export && {
        ...declaration.export,
        verificationResult: EnumUtil.toEnumOrThrow(declaration.export.verificationResult, VatReturnDeclarationExportVerificationResult),
        verifiedSoldGoods: declaration.export.verifiedSoldGoods.map(it => ({
          ...it,
          unitOfMeasureType: EnumUtil.toEnumOrThrow(it.unitOfMeasureType, UnitOfMeasureType)
        }))
      } || undefined
    };
  }
}
