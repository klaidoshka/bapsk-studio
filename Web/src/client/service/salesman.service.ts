import {inject, Injectable} from '@angular/core';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../model/salesman.model';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, map, switchMap, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {IsoCountryCode} from '../model/iso-country.model';
import {InstanceService} from './instance.service';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class SalesmanService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);
  private readonly instanceService = inject(InstanceService);
  private readonly cacheService = new CacheService<number, Salesman>(salesman => salesman.id!);
  private readonly instancesFetched = new Set<number>();

  create(request: SalesmanCreateRequest) {
    return this.httpClient
      .post<Salesman>(this.apiRouter.salesman.create(request.instanceId), request)
      .pipe(
        map(salesman => this.updateProperties(salesman)),
        tap(salesman => this.cacheService.set(salesman)),
        switchMap(salesman => this.cacheService.get(salesman.id!))
      );
  }

  delete(instanceId: number, id: number) {
    return this.httpClient
      .delete<void>(this.apiRouter.salesman.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: SalesmanEditRequest) {
    return this.httpClient
      .put<void>(this.apiRouter.salesman.edit(request.instanceId, request.salesman.id!), request)
      .pipe(
        tap(() => {
            this.cacheService.invalidate(request.salesman.id!);

            this
              .getById(request.instanceId, request.salesman.id!)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number) {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<Salesman>(this.apiRouter.salesman.getById(instanceId, id))
      .pipe(
        map(salesman => this.updateProperties(salesman)),
        tap(salesman => this.cacheService.set(salesman)),
        switchMap(salesman => this.cacheService.get(salesman.id!))
      );
  }

  getAllByInstanceId(instanceId: number) {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(salesman => salesman.instanceId === instanceId);
    }

    return this.httpClient
      .get<Salesman[]>(this.apiRouter.salesman.getByInstanceId(instanceId))
      .pipe(
        map(salesmen => salesmen.map(salesman => this.updateProperties(salesman))),
        tap(salesmen => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            salesmen,
            salesman => salesman.instanceId === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(salesman => salesman.instanceId === instanceId))
      );
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
