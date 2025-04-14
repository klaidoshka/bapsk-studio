import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {combineLatest, first, map, Observable, switchMap, tap} from 'rxjs';
import DataEntry, {
  DataEntryCreateRequest,
  DataEntryEditRequest,
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
  private apiRouter = inject(ApiRouter);
  private dataTypeService = inject(DataTypeService);
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  private readonly cacheService = new CacheService<number, DataEntryJoined>(it => it.id);

  private readonly dataTypesFetched = new Set<number>();

  constructor() {
    this.updateProperties = this.updateProperties.bind(this);
    this.joinOntoDataEntry = this.joinOntoDataEntry.bind(this);
  }

  private adjustDateToISO<T extends DataEntryCreateRequest | DataEntryEditRequest>(request: T, dataType: DataType): T {
    return {
      ...request,
      fields: request.fields.map(it => {
        const dataTypeField = dataType.fields.find(field => field.id === it.dataTypeFieldId)!;

        if (dataTypeField.type === FieldType.Date) {
          return {
            ...it,
            value: it.value.toISOString()
          }
        }

        return it;
      })
    };
  }

  private joinOntoDataEntry(dataEntry: DataEntry): Observable<DataEntryJoined> {
    return combineLatest([
      this.userService.getIdentityById(dataEntry.createdById),
      this.userService.getIdentityById(dataEntry.modifiedById),
      this.dataTypeService.getById(dataEntry.dataTypeId)
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
      .getById(request.dataTypeId)
      .pipe(
        switchMap(it =>
          this.httpClient.post<DataEntry>(
            this.apiRouter.dataEntryCreate(),
            this.adjustDateToISO(request, it)
          )
        ),
        switchMap(this.updateProperties),
        switchMap(this.joinOntoDataEntry),
        tap(it => this.cacheService.set(it)),
        switchMap(it => this.cacheService.get(it.id))
      );
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.dataEntryDelete(id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: DataEntryEditRequest): Observable<void> {
    return this.dataTypeService
      .getById(request.dataTypeId)
      .pipe(
        switchMap(it =>
          this.httpClient.put<void>(
            this.apiRouter.dataEntryEdit(request.dataEntryId),
            this.adjustDateToISO(request, it)
          )
        ),
        tap(() => {
          this.cacheService.invalidate(request.dataEntryId);

          this
              .getById(request.dataEntryId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(id: number): Observable<DataEntryJoined> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<DataEntry>(this.apiRouter.dataEntryGetById(id))
      .pipe(
        switchMap(this.updateProperties),
        switchMap(this.joinOntoDataEntry),
        tap(it => this.cacheService.set(it)),
        switchMap(it => this.cacheService.get(it.id))
      );
  }

  getAllByDataTypeId(dataTypeId: number): Observable<DataEntryJoined[]> {
    if (this.dataTypesFetched.has(dataTypeId)) {
      return this.cacheService.getAllWhere(it => it.dataTypeId === dataTypeId);
    }

    return this.httpClient
      .get<DataEntry[]>(this.apiRouter.dataEntryGetByDataTypeId(dataTypeId))
      .pipe(
        switchMap(it => combineLatest(it.map(this.updateProperties))),
        switchMap(it => combineLatest(it.map(this.joinOntoDataEntry))),
        tap(it => {
          this.dataTypesFetched.add(dataTypeId);

          this.cacheService.update(
            it,
            it => it.dataTypeId === dataTypeId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(it => it.dataTypeId === dataTypeId))
      );
  }

  updateProperties(dataEntry: DataEntry): Observable<DataEntry> {
    return combineLatest(
      dataEntry.fields.map(it => this.updateFieldProperty(it, dataEntry.dataTypeId))
    )
      .pipe(
        map(it => ({
          ...dataEntry,
          createdAt: DateUtil.adjustToLocalDate(dataEntry.createdAt),
          modifiedAt: DateUtil.adjustToLocalDate(dataEntry.modifiedAt),
          fields: it
        }))
      );
  }

  updateFieldProperty(field: DataEntryField, dataTypeId: number): Observable<DataEntryField> {
    return this.dataTypeService
      .getById(dataTypeId)
      .pipe(
        map(it => it.fields.find(it => it.id === field.dataTypeFieldId)),
        map(it => ({
          ...field,
          value: FieldTypeUtil.updateValue(field.value, it?.type || FieldType.Text)
        }))
      );
  }
}
