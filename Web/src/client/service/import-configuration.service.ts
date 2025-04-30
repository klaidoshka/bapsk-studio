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
  private readonly apiRouter = inject(ApiRouter);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly httpClient = inject(HttpClient);
  private readonly cacheService = new CacheService<number, ImportConfigurationJoined>(configuration => configuration.id!);
  private readonly dataTypesFetched = new Set<number>();
  private readonly instancesFetched = new Set<number>();

  private adjustRequestDateToISO<T extends ImportConfigurationCreateRequest | ImportConfigurationEditRequest>(
    request: T, fieldTypes: Map<number, FieldType>
  ): T {
    return {
      ...request,
      importConfiguration: {
        ...request.importConfiguration,
        fields: request.importConfiguration.fields.map(field => ({
          ...field,
          defaultValue: fieldTypes.get(field.dataTypeFieldId) === FieldType.Date
            ? new Date(field.defaultValue)
            : field.defaultValue
        }))
      }
    };
  }

  create(request: ImportConfigurationCreateRequest): Observable<ImportConfigurationJoined> {
    return this.dataTypeService
      .getById(request.instanceId, request.importConfiguration.dataTypeId)
      .pipe(
        switchMap(dataType =>
          this.httpClient.post<ImportConfiguration>(
            this.apiRouter.importConfiguration.create(request.instanceId),
            this.adjustRequestDateToISO(
              request,
              new Map<number, FieldType>(dataType.fields.map(f => [f.id, f.type]))
            )
          )),
        switchMap(configuration => this
          .updateProperties(configuration, request.instanceId)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(request.instanceId, configuration.dataTypeId)
              .pipe(
                map(dataType => ({
                  ...configuration,
                  dataType: dataType
                }) as ImportConfigurationJoined)
              )
            )
          )
        ),
        tap(configuration => this.cacheService.set(configuration)),
        switchMap(configuration => this.cacheService.get(configuration.id!))
      );
  }

  delete(instanceId: number, id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.importConfiguration.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: ImportConfigurationEditRequest): Observable<void> {
    return this.dataTypeService
      .getById(request.instanceId, request.importConfiguration.dataTypeId)
      .pipe(
        switchMap(dataType =>
          this.httpClient.put<void>(
            this.apiRouter.importConfiguration.edit(request.instanceId, request.importConfiguration.id!),
            this.adjustRequestDateToISO(
              request,
              new Map<number, FieldType>(dataType.fields.map(f => [f.id, f.type]))
            )
          )),
        tap(() => {
            this.cacheService.invalidate(request.importConfiguration.id!);

            this
              .getById(request.instanceId, request.importConfiguration.id!)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number): Observable<ImportConfigurationJoined> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<ImportConfiguration>(this.apiRouter.importConfiguration.getById(instanceId, id))
      .pipe(
        switchMap(configuration => this
          .updateProperties(configuration, instanceId)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(instanceId, configuration.dataTypeId)
              .pipe(
                map(dataType => ({
                  ...configuration,
                  dataType: dataType
                }) as ImportConfigurationJoined)
              )
            )
          )
        ),
        tap(configuration => this.cacheService.set(configuration)),
        switchMap(configuration => this.cacheService.get(configuration.id!))
      );
  }

  getAllByDataTypeId(instanceId: number, dataTypeId: number): Observable<ImportConfigurationJoined[]> {
    if (this.dataTypesFetched.has(dataTypeId)) {
      return this.cacheService.getAllWhere(configuration =>
        configuration.dataTypeId === dataTypeId
      );
    }

    return this.httpClient
      .get<ImportConfiguration[]>(this.apiRouter.importConfiguration.getByDataTypeId(instanceId, dataTypeId))
      .pipe(
        switchMap(configurations => combineLatest(configurations.map(configuration => this
          .updateProperties(configuration, instanceId)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(instanceId, configuration.dataTypeId)
              .pipe(
                map(dataType => ({
                  ...configuration,
                  dataType: dataType
                }) as ImportConfigurationJoined)
              )
            )
          )
        ))),
        tap(configurations => {
          this.dataTypesFetched.add(dataTypeId);

          this.cacheService.update(
            configurations,
            configuration => configuration.dataTypeId === dataTypeId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(configuration =>
          configuration.dataTypeId === dataTypeId
        ))
      );
  }

  getAllByInstanceId(instanceId: number): Observable<ImportConfigurationJoined[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(configuration =>
        this.dataTypeService.resolveInstanceId(configuration.dataTypeId) === instanceId
      );
    }

    return this.httpClient
      .get<ImportConfiguration[]>(this.apiRouter.importConfiguration.getByInstanceId(instanceId))
      .pipe(
        switchMap(configurations => combineLatest(configurations.map(configuration => this
          .updateProperties(configuration, instanceId)
          .pipe(
            switchMap(configuration => this.dataTypeService
              .getById(instanceId, configuration.dataTypeId)
              .pipe(
                map(dataType => ({
                  ...configuration,
                  dataType: dataType
                }) as ImportConfigurationJoined)
              )
            )
          )
        ))),
        tap(configurations => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            configurations,
            configuration => this.dataTypeService.resolveInstanceId(configuration.dataTypeId) === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(configuration =>
          this.dataTypeService.resolveInstanceId(configuration.dataTypeId) === instanceId
        ))
      );
  }

  updateProperties(configuration: ImportConfiguration, instanceId: number): Observable<ImportConfiguration> {
    return this.dataTypeService
      .getById(instanceId, configuration.dataTypeId)
      .pipe(
        map(dataType => {
          const fieldTypes = new Map(dataType.fields.map(field => [field.id, field.type]));

          return {
            ...configuration,
            fields: configuration.fields.map(field => ({
              ...field,
              defaultValue: FieldTypeUtil.updateValue(field.defaultValue, fieldTypes.get(field.dataTypeFieldId)!)
            }))
          };
        })
      );
  }
}
