import {inject, Injectable, Injector} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import VatReturnDeclaration, {
  PaymentType,
  SubmitDeclarationState,
  VatReturnDeclarationExportVerificationResult,
  VatReturnDeclarationPaymentInfo,
  VatReturnDeclarationSubmitRequest,
  VatReturnDeclarationWithDeclarer,
  VatReturnDeclarationWithSale
} from '../model/vat-return.model';
import {catchError, first, map, Observable, of, switchMap, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {containsFailureCode} from '../model/error-response.model';
import {FailureCode} from '../model/failure-code.model';
import {UserService} from './user.service';
import {SaleService} from './sale.service';
import {UnitOfMeasureType} from '../model/unit-of-measure-type.model';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class VatReturnService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly injector = inject(Injector);
  private readonly userService = inject(UserService);
  private readonly cacheBySaleIdService = new CacheService<number, VatReturnDeclaration | null>();
  private readonly cacheByCodeService = new CacheService<string, VatReturnDeclarationWithSale | null>();
  private _saleService?: SaleService;

  private get saleService(): SaleService {
    if (!this._saleService) {
      this._saleService = this.injector.get(SaleService);
    }
    return this._saleService;
  }

  cancel(instanceId: number, saleId: number): Observable<void> {
    return this.httpClient
      .post<void>(this.apiRouter.vatReturn.cancel(instanceId, saleId), {})
      .pipe(
        tap(() => {
          this.cacheBySaleIdService.invalidate(saleId);

          this
            .getBySaleId(instanceId, saleId)
            .pipe((first()))
            .subscribe();
        })
      );
  }

  getBySaleId(instanceId: number, saleId: number): Observable<VatReturnDeclaration | undefined> {
    if (this.cacheBySaleIdService.has(saleId)) {
      return this.cacheBySaleIdService
        .get(saleId)
        .pipe(
          map(declaration => declaration ? declaration : undefined)
        );
    }

    return this.httpClient
      .get<VatReturnDeclaration | null>(this.apiRouter.vatReturn.getBySaleId(instanceId, saleId))
      .pipe(
        map(declaration => declaration ? this.updateProperties(declaration) : undefined),
        tap(declaration => this.cacheBySaleIdService.setToKey(saleId, declaration ?? null)),
        switchMap(_ => this.cacheBySaleIdService
          .get(saleId)
          .pipe(
            map(declaration => declaration ? declaration : undefined)
          )
        )
      );
  }

  getWithDeclarerBySaleId(instanceId: number, saleId: number): Observable<VatReturnDeclarationWithDeclarer | undefined> {
    return this
      .getBySaleId(instanceId, saleId)
      .pipe(
        switchMap(declaration => declaration && declaration.declaredById
          ? this.userService
            .getIdentityById(declaration.declaredById)
            .pipe(
              map(user => ({
                ...declaration,
                declaredBy: user
              }))
            )
          : of(declaration)
        )
      );
  }

  getWithSaleByPreviewCode(code: string): Observable<VatReturnDeclarationWithSale | undefined> {
    if (this.cacheByCodeService.has(code)) {
      return this.cacheByCodeService
        .get(code)
        .pipe(
          map(declaration => declaration ? declaration : undefined)
        );
    }

    return this.httpClient
      .get<VatReturnDeclarationWithSale | null>(this.apiRouter.vatReturn.getByCode(code))
      .pipe(
        map(declaration => declaration
          ? ({
            ...this.updateProperties(declaration),
            sale: this.saleService.updateProperties(declaration.sale)
          })
          : null
        ),
        tap(declaration => this.cacheByCodeService.setToKey(code, declaration)),
        switchMap(_ => this.cacheByCodeService
          .get(code)
          .pipe(
            map(declaration => declaration ? declaration : undefined)
          )
        )
      );
  }

  mockExport(instanceId: number, saleId: number) {
    return this.httpClient
      .post<void>(this.apiRouter.vatReturn.mockExport(instanceId, saleId), {})
      .pipe(
        tap(() => {
          this.cacheBySaleIdService.invalidate(saleId);

          this
            .getBySaleId(instanceId, saleId)
            .pipe(first())
            .subscribe();
        })
      );
  }

  submit(request: VatReturnDeclarationSubmitRequest): Observable<VatReturnDeclaration> {
    return this.httpClient
      .post<VatReturnDeclaration>(this.apiRouter.vatReturn.submit(request.instanceId), request)
      .pipe(
        map(declaration => this.updateProperties(declaration)),
        tap(declaration => this.cacheBySaleIdService.setToKey(declaration.saleId, declaration)),
        catchError(response => {
          if (containsFailureCode(response, FailureCode.VatReturnDeclarationSubmitRejectedButUpdated)) {
            this.cacheBySaleIdService.invalidate(request.sale.id);

            this
              .getBySaleId(request.instanceId, request.sale.id)
              .pipe(first())
              .subscribe();
          }

          throw response;
        })
      );
  }

  submitPayments(instanceId: number, saleId: number, payments: VatReturnDeclarationPaymentInfo[]): Observable<void> {
    return this.httpClient
      .post<void>(this.apiRouter.vatReturn.payment(instanceId, saleId), payments)
      .pipe(
        tap(() => {
          this.cacheBySaleIdService.invalidate(saleId);

          this
            .getBySaleId(instanceId, saleId)
            .pipe(first())
            .subscribe();
        })
      );
  }

  update(instanceId: number, saleId: number): Observable<void> {
    return this.httpClient
      .post<void>(this.apiRouter.vatReturn.update(instanceId, saleId), {})
      .pipe(
        tap(() => {
            this.cacheBySaleIdService.invalidate(saleId);

            this
              .getBySaleId(instanceId, saleId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  updateByPreviewCode(code: string): Observable<void> {
    return this.httpClient
      .post<void>(this.apiRouter.vatReturn.updateByCode(code), {})
      .pipe(
        tap(() => {
            this.cacheByCodeService.invalidate(code);

            this
              .getWithSaleByPreviewCode(code)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  updateProperties(declaration: VatReturnDeclaration): VatReturnDeclaration {
    return {
      ...declaration,
      state: EnumUtil.toEnumOrThrow(declaration.state, SubmitDeclarationState),
      export: declaration.export && {
        ...declaration.export,
        assessmentDate: DateUtil.adjustToLocalDate(declaration.export.assessmentDate),
        correctionDate: declaration.export.correctionDate
          ? DateUtil.adjustToLocalDate(declaration.export.correctionDate)
          : undefined,
        verificationDate: DateUtil.adjustToLocalDate(declaration.export.verificationDate),
        verificationResult: EnumUtil.toEnumOrThrow(declaration.export.verificationResult, VatReturnDeclarationExportVerificationResult),
        verifiedSoldGoods: declaration.export.verifiedSoldGoods.map(good => ({
          ...good,
          unitOfMeasureType: EnumUtil.toEnumOrThrow(good.unitOfMeasureType, UnitOfMeasureType)
        }))
      } || undefined,
      payments: declaration.payments.map(payment => ({
        ...payment,
        date: DateUtil.adjustToLocalDate(payment.date),
        type: EnumUtil.toEnumOrThrow(payment.type, PaymentType)
      })),
      submitDate: DateUtil.adjustToLocalDate(declaration.submitDate)
    };
  }
}
