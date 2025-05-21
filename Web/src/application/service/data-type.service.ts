import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, map, Observable, switchMap, tap} from 'rxjs';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../model/data-type.model';
import {EnumUtil} from '../util/enum.util';
import DataTypeField, {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import {CacheService} from './cache.service';
import {EventService} from './event.service';
import {events} from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly eventService = inject(EventService);
  private readonly httpClient = inject(HttpClient);
  private readonly cacheService = new CacheService<number, DataType>(it => it.id!);
  private readonly instancesFetched = new Set<number>();

  constructor() {
    this.eventService.subscribe(events.loggedOut, () => {
      this.instancesFetched.clear();
      this.cacheService.deleteAll();
    });
  }

  private adjustRequestDateToISO<T extends DataTypeCreateRequest | DataTypeEditRequest>(request: T): T {
    return {
      ...request,
      fields: request.fields.map(request => ({
        ...request,
        defaultValue: request.type === FieldType.Date
          ? request.defaultValue?.toISOString()
          : request.defaultValue
      }))
    };
  }

  create(request: DataTypeCreateRequest): Observable<DataType> {
    return this.httpClient
      .post<DataType>(this.apiRouter.dataType.create(request.instanceId), this.adjustRequestDateToISO(request))
      .pipe(
        map(dataType => this.updateProperties(dataType)),
        tap(dataType => this.cacheService.set(dataType)),
        switchMap(dataType => this.cacheService.get(dataType.id))
      );
  }

  delete(instanceId: number, id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.dataType.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: DataTypeEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(this.apiRouter.dataType.edit(request.instanceId, request.dataTypeId), this.adjustRequestDateToISO(request))
      .pipe(
        tap(() => {
            this.cacheService.invalidate(request.dataTypeId);

            this
              .getById(request.instanceId, request.dataTypeId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number): Observable<DataType> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<DataType>(this.apiRouter.dataType.getById(instanceId, id))
      .pipe(
        map(dataType => this.updateProperties(dataType)),
        tap(dataType => this.cacheService.set(dataType)),
        switchMap(dataType => this.cacheService.get(dataType.id))
      );
  }

  getAllByInstanceId(instanceId: number): Observable<DataType[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(dataType => dataType.instanceId === instanceId);
    }

    return this.httpClient
      .get<DataType[]>(this.apiRouter.dataType.getByInstanceId(instanceId))
      .pipe(
        map(dataTypes => dataTypes.map(dataType => this.updateProperties(dataType))),
        tap(dataTypes => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            dataTypes,
            dataType => dataType.instanceId === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(dataType => dataType.instanceId === instanceId))
      );
  }

  resolveInstanceId(id: number): number | null {
    const instanceId = this.cacheService.execute(dataTypes => Array
      .from(dataTypes.values())
      .find(dataType => dataType.id === id)?.instanceId
    );

    return instanceId !== undefined ? instanceId : null;
  }

  updateFieldProperties(field: DataTypeField): DataTypeField {
    const type = EnumUtil.toEnumOrThrow(field.type, FieldType);

    return {
      ...field,
      type: type,
      defaultValue: FieldTypeUtil.updateValue(field.defaultValue, type)
    }
  }

  updateProperties(dataType: DataType): DataType {
    return {
      ...dataType,
      fields: dataType.fields.map(field => this.updateFieldProperties(field))
    }
  }
}
