import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import ImportConfiguration, {
  ImportConfigurationCreateRequest,
  ImportConfigurationEditRequest,
  ImportConfigurationJoined
} from '../model/import-configuration.model';
import {combineLatest, first, map, Observable, switchMap, tap} from 'rxjs';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import {DataTypeService} from './data-type.service';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ImportConfigurationService {
  private apiRouter = inject(ApiRouter);
  private dataTypeService = inject(DataTypeService);
  private httpClient = inject(HttpClient);

  private readonly cacheService = new CacheService<number, ImportConfigurationJoined>(it => it.id!);

  private readonly instancesFetched = new Set<number>();

  private adjustDateToISO<T extends ImportConfigurationCreateRequest | ImportConfigurationEditRequest>(request: T, fieldTypes: Map<number, FieldType>): T {
    return {
      ...request,
      importConfiguration: {
        ...request.importConfiguration,
        fields: request.importConfiguration.fields.map(it => ({
          ...it,
          defaultValue: fieldTypes.get(it.dataTypeFieldId) === FieldType.Date
            ? new Date(it.defaultValue)
            : it.defaultValue
        }))
      }
    };
  }

  create(request: ImportConfigurationCreateRequest): Observable<ImportConfigurationJoined> {
    return this.dataTypeService
      .getById(request.importConfiguration.dataTypeId)
      .pipe(
        switchMap(it =>
          this.httpClient.post<ImportConfiguration>(
            this.apiRouter.importConfigurationCreate(),
            this.adjustDateToISO(
              request,
              new Map<number, FieldType>(it.fields.map(f => [f.id, f.type]))
            )
          )),
        switchMap(it => this
          .updateProperties(it)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(configuration.dataTypeId)
              .pipe(
                map(it => ({
                  ...configuration,
                  dataType: it
                }) as ImportConfigurationJoined)
              )
            )
          )
        ),
        tap(it => this.cacheService.set(it)),
        switchMap(it => this.cacheService.get(it.id!))
      );
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.importConfigurationDelete(id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: ImportConfigurationEditRequest): Observable<void> {
    return this.dataTypeService
      .getById(request.importConfiguration.dataTypeId)
      .pipe(
        switchMap(it =>
          this.httpClient.put<void>(
            this.apiRouter.importConfigurationCreate(),
            this.adjustDateToISO(
              request,
              new Map<number, FieldType>(it.fields.map(f => [f.id, f.type]))
            )
          )),
        tap(() =>  {
            this.cacheService.invalidate(request.importConfiguration.id!);

            this
              .getById(request.importConfiguration.id!)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(id: number): Observable<ImportConfigurationJoined> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<ImportConfiguration>(this.apiRouter.importConfigurationGetById(id))
      .pipe(
        switchMap(it => this
          .updateProperties(it)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(configuration.dataTypeId)
              .pipe(
                map(it => ({
                  ...configuration,
                  dataType: it
                }) as ImportConfigurationJoined)
              )
            )
          )
        ),
        tap(it => this.cacheService.set(it)),
        switchMap(it => this.cacheService.get(it.id!))
      );
  }

  getAllByInstanceId(instanceId: number): Observable<ImportConfigurationJoined[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(it => this.dataTypeService.resolveInstanceId(it.dataTypeId) === instanceId);
    }

    return this.httpClient
      .get<ImportConfiguration[]>(this.apiRouter.importConfigurationGetByInstanceId(instanceId))
      .pipe(
        switchMap(it => combineLatest(it.map(it => this
          .updateProperties(it)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(configuration.dataTypeId)
              .pipe(
                map(it => ({
                  ...configuration,
                  dataType: it
                }) as ImportConfigurationJoined)
              )
            )
          )
        ))),
        tap(it => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            it,
            it => this.dataTypeService.resolveInstanceId(it.dataTypeId) === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(it =>
          this.dataTypeService.resolveInstanceId(it.dataTypeId) === instanceId
        ))
      );
  }

  updateProperties(configuration: ImportConfiguration): Observable<ImportConfiguration> {
    return this.dataTypeService
      .getById(configuration.dataTypeId)
      .pipe(
        map(dataType => {
          const fieldTypes = new Map(dataType.fields.map(it => [it.id, it.type]));

          return {
            ...configuration,
            fields: configuration.fields.map(it => ({
              ...it,
              defaultValue: FieldTypeUtil.updateValue(it.defaultValue, fieldTypes.get(it.dataTypeFieldId)!)
            }))
          };
        })
      );
  }
}
