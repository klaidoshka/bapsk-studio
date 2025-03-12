import {Injectable, signal, WritableSignal} from '@angular/core';
import Sale, {SaleCreateRequest, SaleEditRequest} from '../model/sale.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, tap} from 'rxjs';
import {CustomerService} from './customer.service';
import {SalesmanService} from './salesman.service';
import {toEnumOrThrow} from '../util/enum.util';
import {UnitOfMeasureType} from '../model/unit-of-measure-type.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<Sale[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private customerService: CustomerService,
    private httpClient: HttpClient,
    private salesmanService: SalesmanService
  ) {
  }

  private readonly updateSingleInStore = (instanceId: number, sale: Sale) => {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(sales => {
        const index = sales.findIndex(c => c.id === sale.id);

        if (index !== -1) {
          sales[index] = sale;
        } else {
          sales.push(sale);
        }

        return sales;
      });
    } else {
      this.store.set(instanceId, signal([sale]));
    }
  }

  readonly create = (request: SaleCreateRequest) => {
    return this.httpClient.post<Sale>(this.apiRouter.saleCreate(), request).pipe(
      tap(sale => this.updateSingleInStore(request.instanceId, this.updateProperties(sale)))
    );
  }

  readonly delete = (instanceId: number, id: number) => {
    return this.httpClient.delete<void>(this.apiRouter.saleDelete(id)).pipe(
      tap(() => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(sales => sales.filter(c => c.id !== id));
        } else {
          this.store.set(instanceId, signal([]));
        }
      })
    );
  }

  readonly edit = (request: SaleEditRequest) => {
    return this.httpClient.put<void>(this.apiRouter.saleEdit(request.sale.id!), request).pipe(
      tap(() => this.getById(request.instanceId, request.sale.id!).pipe(first()).subscribe())
    );
  }

  readonly get = (instanceId: number) => {
    return this.httpClient.get<Sale[]>(this.apiRouter.saleGet(instanceId)).pipe(
      tap(sales => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => sales.map(this.updateProperties));
        } else {
          this.store.set(instanceId, signal(sales.map(this.updateProperties)));
        }
      })
    );
  }

  readonly getById = (instanceId: number, id: number) => {
    return this.httpClient.get<Sale>(this.apiRouter.saleGetById(id)).pipe(
      tap(sale => this.updateSingleInStore(instanceId, this.updateProperties(sale)))
    );
  }

  /**
   * Get the sales as a readonly signal. Sales are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @param instanceId
   *
   * @returns Readonly signal of sales
   */
  readonly getAsSignal = (instanceId: number) => {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));

      new Promise((resolve) => this.get(instanceId).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
  }

  readonly updateProperties = (sale: Sale): Sale => {
    return {
      ...sale,
      date: new Date(sale.date),
      customer: this.customerService.updateProperties(sale.customer),
      salesman: this.salesmanService.updateProperties(sale.salesman),
      soldGoods: sale.soldGoods.map(soldGood => ({
        ...soldGood,
        unitOfMeasureType: toEnumOrThrow(soldGood.unitOfMeasureType, UnitOfMeasureType)
      }))
    }
  }
}
