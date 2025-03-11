import {Injectable, signal, WritableSignal} from '@angular/core';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../model/salesman.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<Salesman[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  private readonly updateSingleInStore = (instanceId: number, salesman: Salesman) => {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(salesmen => {
        const index = salesmen.findIndex(c => c.id === salesman.id);

        if (index !== -1) {
          salesmen[index] = salesman;
        } else {
          salesmen.push(salesman);
        }

        return salesmen;
      });
    } else {
      this.store.set(instanceId, signal([salesman]));
    }
  }

  readonly create = (request: SalesmanCreateRequest) => {
    return this.httpClient.post<Salesman>(this.apiRouter.salesmanCreate(), request).pipe(
      tap(salesman => this.updateSingleInStore(request.instanceId, salesman))
    );
  }

  readonly edit = (request: SalesmanEditRequest) => {
    return this.httpClient.put<void>(this.apiRouter.salesmanEdit(request.salesman.id!), request).pipe(
      tap(() => this.getById(request.instanceId, request.salesman.id!).pipe(first()).subscribe())
    );
  }

  readonly delete = (instanceId: number, id: number) => {
    return this.httpClient.delete<void>(this.apiRouter.salesmanDelete(id)).pipe(
      tap(() => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(salesmen => salesmen.filter(c => c.id !== id));
        } else {
          this.store.set(instanceId, signal([]));
        }
      })
    );
  }

  readonly get = (instanceId: number) => {
    return this.httpClient.get<Salesman[]>(this.apiRouter.salesmanGet()).pipe(
      tap(salesmen => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => salesmen);
        } else {
          this.store.set(instanceId, signal(salesmen));
        }
      })
    );
  }

  readonly getById = (instanceId: number, id: number) => {
    return this.httpClient.get<Salesman>(this.apiRouter.salesmanGetById(id)).pipe(
      tap(salesman => this.updateSingleInStore(instanceId, salesman))
    );
  }

  /**
   * Get the salesmen as a readonly signal. Salesmen are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @param instanceId
   *
   * @returns Readonly signal of salesmen
   */
  readonly getAsSignal = (instanceId: number) => {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));

      new Promise((resolve) => this.get(instanceId).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
  }
}
