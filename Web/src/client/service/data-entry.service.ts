import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {combineLatest, first, map, Observable, switchMap, tap} from 'rxjs';
import DataEntry, {
  DataEntryCreateRequest,
  DataEntryEditRequest,
  DataEntryImportRequest,
  DataEntryJoined
} from '../model/data-entry.model';
import {DateUtil} from '../util/date.util';
import {UserService} from './user.service';
import {DataTypeService} from './data-type.service';
import DataEntryField from '../model/data-entry-field.model';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import {CacheService} from './cache.service';
import DataType from '../model/data-type.model';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly httpClient = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly cacheService = new CacheService<number, DataEntryJoined>(dataEntry => dataEntry.id);
  private readonly dataTypesFetched = new Set<number>();

  private adjustRequestDateToISO<T extends DataEntryCreateRequest | DataEntryEditRequest>(request: T, dataType: DataType): T {
    return {
      ...request,
      fields: request.fields.map(request => {
        const dataTypeField = dataType.fields.find(field => field.id === request.dataTypeFieldId)!;

        if (dataTypeField.type === FieldType.Date) {
          return {
            ...request,
            value: request.value?.toISOString()
          }
        }

        return request;
      })
    };
  }

  private joinOntoDataEntry(instanceId: number, dataEntry: DataEntry): Observable<DataEntryJoined> {
    return combineLatest([
      this.userService.getIdentityById(dataEntry.createdById),
      this.userService.getIdentityById(dataEntry.modifiedById),
      this.dataTypeService.getById(instanceId, dataEntry.dataTypeId)
    ])
      .pipe(
        map(([createdBy, modifiedBy, dataType]) => ({
          ...dataEntry,
          createdBy: createdBy,
          modifiedBy: modifiedBy,
          fields: dataEntry.fields.filter(field =>
            dataType.fields.some(dataTypeField => dataTypeField.id === field.dataTypeFieldId)
          ),
          display: () => {
            if (!dataType.displayFieldId) {
              return dataEntry.id.toString();
            }

            const displayField = dataEntry.fields.find(field =>
              field.dataTypeFieldId === dataType.displayFieldId
            );

            return displayField ? displayField.value : '';
          }
        }))
      );
  }

  create(request: DataEntryCreateRequest): Observable<DataEntryJoined> {
    return this.dataTypeService
      .getById(request.instanceId, request.dataTypeId)
      .pipe(
        switchMap(dataType =>
          this.httpClient.post<DataEntry>(
            this.apiRouter.dataEntry.create(request.instanceId),
            this.adjustRequestDateToISO(request, dataType)
          )
        ),
        switchMap(dataEntry => this.updateProperties(request.instanceId, dataEntry)),
        switchMap(dataEntry => this.joinOntoDataEntry(request.instanceId, dataEntry)),
        tap(dataEntry => this.cacheService.set(dataEntry)),
        switchMap(dataEntry => this.cacheService.get(dataEntry.id))
      );
  }

  delete(instanceId: number, id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.dataEntry.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: DataEntryEditRequest): Observable<void> {
    return this.dataTypeService
      .getById(request.instanceId, request.dataTypeId)
      .pipe(
        switchMap(dataType =>
          this.httpClient.put<void>(
            this.apiRouter.dataEntry.edit(request.instanceId, request.dataEntryId),
            this.adjustRequestDateToISO(request, dataType)
          )
        ),
        tap(() => {
            this.cacheService.invalidate(request.dataEntryId);

            this
              .getById(request.instanceId, request.dataEntryId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number): Observable<DataEntryJoined> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<DataEntry>(this.apiRouter.dataEntry.getById(instanceId, id))
      .pipe(
        switchMap(dataEntry => this.updateProperties(instanceId, dataEntry)),
        switchMap(dataEntry => this.joinOntoDataEntry(instanceId, dataEntry)),
        tap(dataEntry => this.cacheService.set(dataEntry)),
        switchMap(dataEntry => this.cacheService.get(dataEntry.id))
      );
  }

  getAllByDataTypeId(instanceId: number, dataTypeId: number): Observable<DataEntryJoined[]> {
    if (this.dataTypesFetched.has(dataTypeId)) {
      return this.cacheService.getAllWhere(dataEntry => dataEntry.dataTypeId === dataTypeId);
    }

    return this.httpClient
      .get<DataEntry[]>(this.apiRouter.dataEntry.getByDataTypeId(instanceId, dataTypeId))
      .pipe(
        switchMap(dataEntries => combineLatest(dataEntries.map(dataEntry => this.updateProperties(instanceId, dataEntry)))),
        switchMap(dataEntries => combineLatest(dataEntries.map(dataEntry => this.joinOntoDataEntry(instanceId, dataEntry)))),
        tap(dataEntries => {
          this.dataTypesFetched.add(dataTypeId);

          this.cacheService.update(
            dataEntries,
            dataEntry => dataEntry.dataTypeId === dataTypeId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(dataEntry => dataEntry.dataTypeId === dataTypeId))
      );
  }

  getAllByDataTypeIds(instanceId: number, dataTypeIds: number[]): Observable<Map<number, DataEntryJoined[]>> {
    return combineLatest(dataTypeIds.map(id =>
      this
        .getAllByDataTypeId(instanceId, id)
        .pipe(
          map(dataEntries => ({
            dataTypeId: id,
            values: dataEntries
          }))
        )
    ))
      .pipe(map(groupedEntries => {
        const map = new Map<number, DataEntryJoined[]>();

        groupedEntries.forEach(dataEntries => {
          map.set(
            dataEntries.dataTypeId,
            dataEntries.values
          );
        });

        return map;
      }));
  }

  import(request: DataEntryImportRequest): Observable<DataEntryJoined[]> {
    const data = new FormData();

    data.append('file', request.file);
    data.append('importConfigurationId', request.importConfigurationId + '');
    data.append('skipHeader', request.skipHeader + '');

    return this.httpClient
      .post<DataEntry[]>(
        this.apiRouter.dataEntry.import(request.instanceId),
        data
      )
      .pipe(
        switchMap(dataEntries => combineLatest(dataEntries.map(dataEntry => this.updateProperties(request.instanceId, dataEntry)))),
        switchMap(dataEntries => combineLatest(dataEntries.map(dataEntry => this.joinOntoDataEntry(request.instanceId, dataEntry)))),
        tap(dataEntries => dataEntries.map(dataEntry => this.cacheService.set(dataEntry))),
        switchMap(dataEntries => this.cacheService.getAllWhere(dataEntry =>
          dataEntries.findIndex(dataEntryNew => dataEntryNew.id === dataEntry.id) !== -1
        ))
      );
  }

  updateProperties(instanceId: number, dataEntry: DataEntry): Observable<DataEntry> {
    return combineLatest(
      dataEntry.fields.map(field => this.updateFieldProperty(field, instanceId, dataEntry.dataTypeId))
    )
      .pipe(
        map(fields => ({
          ...dataEntry,
          createdAt: DateUtil.adjustToLocalDate(dataEntry.createdAt),
          modifiedAt: DateUtil.adjustToLocalDate(dataEntry.modifiedAt),
          fields: fields
        }))
      );
  }

  updateFieldProperty(field: DataEntryField, instanceId: number, dataTypeId: number): Observable<DataEntryField> {
    return this.dataTypeService
      .getById(instanceId, dataTypeId)
      .pipe(
        map(dataType => dataType.fields.find(dataTypeField => dataTypeField.id === field.dataTypeFieldId)),
        map(dataTypeField => ({
          ...field,
          value: FieldTypeUtil.updateValue(field.value, dataTypeField?.type || FieldType.Text)
        }))
      );
  }
}
