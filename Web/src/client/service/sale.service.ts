import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import Sale, {SaleCreateRequest, SaleEditRequest} from '../model/sale.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, tap} from 'rxjs';
import {CustomerService} from './customer.service';
import {SalesmanService} from './salesman.service';
import {EnumUtil} from '../util/enum.util';
import {UnitOfMeasureType} from '../model/unit-of-measure-type.model';
import {DateUtil} from '../util/date.util';
import {InstanceService} from './instance.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly customerService = inject(CustomerService);
  private readonly httpClient = inject(HttpClient);
  private readonly instanceService = inject(InstanceService);
  private readonly salesmanService = inject(SalesmanService);

  private readonly instanceId = this.instanceService.getActiveInstanceId();

  // Key: InstanceId
  private readonly store = new Map<number, WritableSignal<Sale[]>>();

  private updateSingleInStore(instanceId: number, sale: Sale) {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(sales => {
        const index = sales.findIndex(c => c.id === sale.id);

        return index !== -1
          ? [...sales.slice(0, index), sale, ...sales.slice(index + 1)]
          : [...sales, sale];
      });
    } else {
      this.store.set(instanceId, signal([sale]));
    }
  }

  create(request: SaleCreateRequest) {
    return this.httpClient.post<Sale>(this.apiRouter.sale.create(this.instanceId()!), {
      ...request,
      sale: {
        ...request.sale,
        date: request.sale.date.toISOString() as any
      }
    } as SaleCreateRequest).pipe(
      tap(sale => this.updateSingleInStore(request.instanceId, this.updateProperties(sale)))
    );
  }

  delete(instanceId: number, id: number) {
    return this.httpClient.delete<void>(this.apiRouter.sale.delete(this.instanceId()!, id)).pipe(
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

  edit(request: SaleEditRequest) {
    return this.httpClient.put<void>(this.apiRouter.sale.edit(this.instanceId()!, request.sale.id!), {
      ...request,
      sale: {
        ...request.sale,
        date: request.sale.date.toISOString() as any
      }
    } as SaleEditRequest).pipe(
      tap(() => this.getById(request.instanceId, request.sale.id!).pipe(first()).subscribe())
    );
  }

  get(instanceId: number) {
    return this.httpClient.get<Sale[]>(this.apiRouter.sale.getByInstanceId(instanceId)).pipe(
      tap(sales => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => sales.map(sale => this.updateProperties(sale)));
        } else {
          this.store.set(instanceId, signal(sales.map(sale => this.updateProperties(sale))));
        }
      })
    );
  }

  getById(instanceId: number, id: number) {
    return this.httpClient.get<Sale>(this.apiRouter.sale.getById(this.instanceId()!, id)).pipe(
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
  getAsSignal(instanceId: number) {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));

      new Promise((resolve) => this.get(instanceId).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
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
