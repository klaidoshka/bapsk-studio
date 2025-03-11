import {Injectable, signal, WritableSignal} from '@angular/core';
import Sale, {SaleCreateRequest, SaleEditRequest} from '../model/sale.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<Sale[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
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
      tap(sale => this.updateSingleInStore(request.instanceId, sale))
    );
  }

  readonly edit = (request: SaleEditRequest) => {
    return this.httpClient.put<void>(this.apiRouter.saleEdit(request.sale.id!), request).pipe(
      tap(() => this.getById(request.instanceId, request.sale.id!).pipe(first()).subscribe())
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

  readonly get = (instanceId: number) => {
    return this.httpClient.get<Sale[]>(this.apiRouter.saleGet()).pipe(
      tap(sales => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => sales);
        } else {
          this.store.set(instanceId, signal(sales));
        }
      })
    );
  }

  readonly getById = (instanceId: number, id: number) => {
    return this.httpClient.get<Sale>(this.apiRouter.saleGetById(id)).pipe(
      tap(sale => this.updateSingleInStore(instanceId, sale))
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
}
