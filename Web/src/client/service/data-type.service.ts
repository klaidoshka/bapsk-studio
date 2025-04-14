import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, Observable, switchMap, tap} from 'rxjs';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../model/data-type.model';
import {EnumUtil} from '../util/enum.util';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);

  private readonly cacheService = new CacheService<number, DataType>(it => it.id, this.updateProperties);

  private readonly instancesFetched = new Set<number>();

  private adjustDateToISO<T extends DataTypeCreateRequest | DataTypeEditRequest>(request: T): T {
    return {
      ...request,
      fields: request.fields.map(it => ({
        ...it,
        defaultValue: it.type === FieldType.Date
          ? it.defaultValue.toISOString()
          : it.defaultValue
      }))
    };
  }

  create(request: DataTypeCreateRequest): Observable<DataType> {
    return this.httpClient
      .post<DataType>(this.apiRouter.dataTypeCreate(), this.adjustDateToISO(request))
      .pipe(
        tap(this.cacheService.set),
        switchMap(it => this.cacheService.get(it.id))
      );
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.dataTypeDelete(id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: DataTypeEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(this.apiRouter.dataTypeEdit(request.dataTypeId), this.adjustDateToISO(request))
      .pipe(
        tap(() =>  {
            this.cacheService.invalidate(request.dataTypeId);

            this
              .getById(request.dataTypeId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(id: number): Observable<DataType> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<DataType>(this.apiRouter.dataTypeGetById(id))
      .pipe(
        tap(it => this.cacheService.set(it)),
        switchMap(it => this.cacheService.get(it.id))
      );
  }

  getAllByInstanceId(instanceId: number): Observable<DataType[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(it => it.instanceId === instanceId);
    }

    return this.httpClient
      .get<DataType[]>(this.apiRouter.dataTypeGetByInstanceId(instanceId))
      .pipe(
        tap(it => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            it,
            it => it.instanceId === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(it => it.instanceId === instanceId))
      );
  }

  resolveInstanceId(id: number): number | null {
    const instanceId = this.cacheService.execute(it => Array
      .from(it.values())
      .find(it => it.id === id)?.instanceId
    );

    return instanceId !== undefined ? instanceId : null;
  }

  updateProperties(dataType: DataType): DataType {
    return {
      ...dataType,
      fields: dataType.fields.map(it => {
        const type = EnumUtil.toEnumOrThrow(it.type, FieldType);
        return {
          ...it,
          type: type,
          defaultValue: FieldTypeUtil.updateValue(it.defaultValue, type)
        };
      })
    }
  }
}
