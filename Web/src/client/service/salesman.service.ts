import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../model/salesman.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {IsoCountryCode} from '../model/iso-country.model';
import {InstanceService} from './instance.service';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly instanceService = inject(InstanceService);

  private readonly instanceId = this.instanceService.getActiveInstanceId();

  // Key: InstanceId
  private readonly store = new Map<number, WritableSignal<Salesman[]>>();

  private updateSingleInStore(instanceId: number, salesman: Salesman) {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(salesmen => {
        const index = salesmen.findIndex(c => c.id === salesman.id);

        return index !== -1
          ? [...salesmen.slice(0, index), salesman, ...salesmen.slice(index + 1)]
          : [...salesmen, salesman];
      });
    } else {
      this.store.set(instanceId, signal([salesman]));
    }
  }

  create(request: SalesmanCreateRequest) {
    return this.httpClient.post<Salesman>(this.apiRouter.salesman.create(this.instanceId()!), request).pipe(
      tap(salesman => this.updateSingleInStore(request.instanceId, this.updateProperties(salesman)))
    );
  }

  delete(instanceId: number, id: number) {
    return this.httpClient.delete<void>(this.apiRouter.salesman.delete(this.instanceId()!, id)).pipe(
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

  edit(request: SalesmanEditRequest) {
    return this.httpClient.put<void>(this.apiRouter.salesman.edit(this.instanceId()!, request.salesman.id!), request)
      .pipe(
        tap(() => this.getById(request.instanceId, request.salesman.id!).pipe(first()).subscribe())
      );
  }

  getByInstanceId(instanceId: number) {
    return this.httpClient.get<Salesman[]>(this.apiRouter.salesman.getByInstanceId(instanceId)).pipe(
      tap(salesmen => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => salesmen.map(salesman => this.updateProperties(salesman)));
        } else {
          this.store.set(instanceId, signal(salesmen.map(salesman => this.updateProperties(salesman))));
        }
      })
    );
  }

  getById(instanceId: number, id: number) {
    return this.httpClient.get<Salesman>(this.apiRouter.salesman.getById(this.instanceId()!, id)).pipe(
      tap(salesman => this.updateSingleInStore(instanceId, this.updateProperties(salesman)))
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
  getAsSignal(instanceId: number) {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));

      new Promise((resolve) => this.getByInstanceId(instanceId).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
  }

  updateProperties(salesman: Salesman): Salesman {
    return {
      ...salesman,
      vatPayerCode: {
        ...salesman.vatPayerCode,
        issuedBy: EnumUtil.toEnumOrThrow(salesman.vatPayerCode.issuedBy, IsoCountryCode)
      }
    };
  }
}
