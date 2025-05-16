import {inject, Injectable} from '@angular/core';
import Sale, {SaleCreateRequest, SaleEditRequest, SaleWithVatReturnDeclaration} from '../model/sale.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {combineLatest, first, map, Observable, switchMap, tap} from 'rxjs';
import {CustomerService} from './customer.service';
import {SalesmanService} from './salesman.service';
import {EnumUtil} from '../util/enum.util';
import {UnitOfMeasureType} from '../model/unit-of-measure-type.model';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';
import {VatReturnService} from './vat-return.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly customerService = inject(CustomerService);
  private readonly httpClient = inject(HttpClient);
  private readonly salesmanService = inject(SalesmanService);
  private readonly vatReturnService = inject(VatReturnService);
  private readonly cacheService = new CacheService<number, Sale>(sale => sale.id);
  private readonly instancesFetched = new Set<number>();

  private adjustRequestDateToISO<T extends SaleCreateRequest | SaleEditRequest>(request: T): T {
    return {
      ...request,
      sale: {
        ...request.sale,
        date: request.sale.date?.toISOString() as any
      }
    };
  }

  create(request: SaleCreateRequest): Observable<Sale> {
    return this.httpClient
      .post<Sale>(this.apiRouter.sale.create(request.instanceId), this.adjustRequestDateToISO(request))
      .pipe(
        map(sale => this.updateProperties(sale)),
        tap(sale => this.cacheService.set(sale)),
        switchMap(sale => this.cacheService.get(sale.id!))
      );
  }

  delete(instanceId: number, id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.sale.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: SaleEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(this.apiRouter.sale.edit(request.instanceId, request.sale.id!), this.adjustRequestDateToISO(request))
      .pipe(
        tap(() => {
            this.cacheService.invalidate(request.sale.id!);

            this
              .getById(request.instanceId, request.sale.id!)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number): Observable<Sale> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<Sale>(this.apiRouter.sale.getById(instanceId, id))
      .pipe(
        map(sale => this.updateProperties(sale)),
        tap(sale => this.cacheService.set(sale)),
        switchMap(sale => this.cacheService.get(sale.id!))
      );
  }

  getWithVatDeclarationById(instanceId: number, saleId: number): Observable<SaleWithVatReturnDeclaration> {
    return this
      .getById(instanceId, saleId)
      .pipe(
        switchMap(sale => this.vatReturnService
          .getBySaleId(instanceId, sale.id!)
          .pipe(
            map(declaration => ({
              ...sale,
              vatReturnDeclaration: declaration
            }))
          )
        )
      );
  }

  getAllByInstanceId(instanceId: number): Observable<Sale[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(sale => sale.instanceId === instanceId);
    }

    return this.httpClient
      .get<Sale[]>(this.apiRouter.sale.getByInstanceId(instanceId))
      .pipe(
        map(sales => sales.map(sale => this.updateProperties(sale))),
        tap(sales => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            sales,
            sale => sale.instanceId === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(sale => sale.instanceId === instanceId))
      );
  }

  getAllWithVatDeclarationByInstanceId(instanceId: number): Observable<SaleWithVatReturnDeclaration[]> {
    return this
      .getAllByInstanceId(instanceId!)
      .pipe(
        switchMap(sales => combineLatest(
            sales.map(sale => this.vatReturnService
              .getBySaleId(instanceId, sale.id)
              .pipe(
                map(declaration => ({
                  ...sale,
                  vatReturnDeclaration: declaration
                }))
              )
            )
          )
        ));
  }

  updateProperties(sale: Sale): Sale {
    return {
      ...sale,
      date: DateUtil.adjustToLocalDate(sale.date),
      customer: this.customerService.updateProperties(sale.customer),
      salesman: this.salesmanService.updateProperties(sale.salesman),
      soldGoods: sale.soldGoods.map(soldGood => ({
        ...soldGood,
        unitOfMeasureType: EnumUtil.toEnumOrThrow(soldGood.unitOfMeasureType, UnitOfMeasureType)
      }))
    }
  }
}
