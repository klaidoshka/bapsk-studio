import {computed, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import ImportConfiguration, {
  ImportConfigurationCreateRequest,
  ImportConfigurationEditRequest
} from '../model/import-configuration.model';
import {first, Observable, tap} from 'rxjs';
import {FieldType} from '../model/data-type-field.model';
import {FieldTypeUtil} from '../util/field-type.util';
import {DataTypeService} from './data-type.service';

@Injectable({
  providedIn: 'root'
})
export class ImportConfigurationService {
  private readonly instancesFetched = new Set<number>();
  // Key: DataType ID
  private readonly store = new Map<number, WritableSignal<ImportConfiguration[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private dataTypeService: DataTypeService,
    private httpClient: HttpClient
  ) {
  }

  private readonly getFieldTypes = (dataTypeId: number) => {
    return this.dataTypeService
    .getByIdAsSignal(dataTypeId)()!.fields
    .reduce(
      (acc, field) => acc.set(field.id, field.type),
      new Map<number, FieldType>()
    );
  }

  private readonly resolveDataTypeId = (importConfigurationId: number) => {
    let dataTypeId: number | null = null;

    for (const [key, value] of this.store) {
      if (value().some(it => it.id === importConfigurationId)) {
        dataTypeId = key;
        break;
      }
    }

    return dataTypeId;
  }

  readonly create = (request: ImportConfigurationCreateRequest): Observable<ImportConfiguration> => {
    const fieldTypesByDataTypeFieldId = this.getFieldTypes(request.importConfiguration.dataTypeId);

    return this.httpClient.post<ImportConfiguration>(this.apiRouter.importConfigurationCreate(), {
      ...request,
      fields: request.importConfiguration.fields.map(it => ({
        ...it,
        defaultValue: fieldTypesByDataTypeFieldId.get(it.dataTypeFieldId) === FieldType.Date
          ? it.defaultValue.toISOString()
          : it.defaultValue
      }))
    } as ImportConfigurationCreateRequest).pipe(
      tap(importConfiguration => {
        const existingSignal = this.store.get(request.importConfiguration.dataTypeId);

        if (existingSignal != null) {
          existingSignal.update(old => [...old, this.updateProperties(importConfiguration)]);
        } else {
          this.store.set(request.importConfiguration.dataTypeId, signal([this.updateProperties(importConfiguration)]));
        }
      })
    );
  }

  readonly delete = (id: number): Observable<void> => {
    return this.httpClient.delete<void>(this.apiRouter.importConfigurationDelete(id)).pipe(
      tap(() => {
        const dataTypeId = this.resolveDataTypeId(id);

        if (dataTypeId != null) {
          this.store.get(dataTypeId)!!.update(old => old.filter(importConfiguration => importConfiguration.id !== id));
        }
      })
    );
  }

  readonly edit = (request: ImportConfigurationEditRequest): Observable<void> => {
    const fieldTypesByDataTypeFieldId = this.getFieldTypes(request.importConfiguration.dataTypeId);

    return this.httpClient.put<void>(this.apiRouter.importConfigurationEdit(request.importConfiguration.id), {
      ...request,
      fields: request.importConfiguration.fields.map(it => ({
        ...it,
        defaultValue: fieldTypesByDataTypeFieldId.get(it.dataTypeFieldId) === FieldType.Date
          ? it.defaultValue.toISOString()
          : it.defaultValue
      }))
    } as ImportConfigurationEditRequest).pipe(
      tap(() => {
        this.getById(request.importConfiguration.id).pipe(first()).subscribe();
      })
    );
  }

  readonly getById = (id: number): Observable<ImportConfiguration> => {
    return this.httpClient.get<ImportConfiguration>(this.apiRouter.importConfigurationGetById(id)).pipe(
      tap(importConfiguration => {
        const existingSignal = this.store.get(importConfiguration.dataTypeId);

        if (existingSignal != null) {
          existingSignal.update(old => {
            const index = old.findIndex(it => it.id === id);

            return index === -1
              ? [...old, this.updateProperties(importConfiguration)]
              : [...old.slice(0, index), this.updateProperties(importConfiguration), ...old.slice(index + 1)];
          });
        } else {
          this.store.set(importConfiguration.dataTypeId, signal([this.updateProperties(importConfiguration)]));
        }
      })
    );
  }

  readonly getAllByInstanceId = (instanceId: number): Observable<ImportConfiguration[]> => {
    return this.httpClient.get<ImportConfiguration[]>(this.apiRouter.importConfigurationGetByInstanceId(instanceId)).pipe(
      tap(importConfigurations => {
        this.instancesFetched.add(instanceId);

        const groupedConfigurations = importConfigurations.reduce((acc, it) => {
          if (!acc.has(it.dataTypeId)) {
            acc.set(it.dataTypeId, []);
          }
          acc.get(it.dataTypeId)!.push(it);
          return acc;
        }, new Map<number, ImportConfiguration[]>());

        for (const [key, value] of groupedConfigurations) {
          const existingSignal = this.store.get(key);

          if (existingSignal != null) {
            existingSignal.update(() => value.map(this.updateProperties));
          } else {
            this.store.set(key, signal(value.map(this.updateProperties)));
          }
        }
      })
    );
  }

  readonly getByIdAsSignal = (id: number): Signal<ImportConfiguration | undefined> => {
    const dataTypeId = this.resolveDataTypeId(id);

    if (dataTypeId == null) {
      const importConfiguration = signal<ImportConfiguration | undefined>(undefined);

      this.getById(id).pipe(first()).subscribe((value) => {
        importConfiguration.set(this.getByIdAsSignal(value.id)());
      });

      return importConfiguration;
    }

    return computed(() => this.store.get(dataTypeId)!().find(importConfiguration => importConfiguration.id === id));
  }

  readonly getAsSignal = (instanceId: number): Signal<ImportConfiguration[]> => {
    if (!this.instancesFetched.has(instanceId)) {
      new Promise(resolve => this.getAllByInstanceId(instanceId).pipe(first()).subscribe(resolve));
    }

    return computed(() =>
      Array.from(this.store.values())
      .flatMap(it => it())
      .filter(it => this.dataTypeService.resolveInstanceId(it.dataTypeId) === instanceId)
    );
  }

  readonly updateProperties = (importConfiguration: ImportConfiguration): ImportConfiguration => {
    const fieldTypesByDataTypeFieldId = this.getFieldTypes(importConfiguration.dataTypeId);

    return {
      ...importConfiguration,
      fields: importConfiguration.fields.map(it => ({
        ...it,
        defaultValue: FieldTypeUtil.updateValue(it.defaultValue, fieldTypesByDataTypeFieldId.get(it.dataTypeFieldId)!)
      }))
    }
  }
}
