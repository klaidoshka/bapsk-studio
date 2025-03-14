import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, Observable, tap} from 'rxjs';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../model/data-type.model';
import {DataEntryService} from './data-entry.service';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<DataType[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private dataEntryService: DataEntryService,
    private httpClient: HttpClient
  ) {
  }

  private readonly resolveInstanceId = (dataTypeId: number) => {
    let instanceId: number | null = null;

    for (const [key, value] of this.store) {
      if (value().some(dataType => dataType.id === dataTypeId)) {
        instanceId = key;
        break;
      }
    }

    return instanceId;
  }

  readonly create = (request: DataTypeCreateRequest): Observable<DataType> => {
    return this.httpClient.post<DataType>(this.apiRouter.dataTypeCreate(), request).pipe(
      tap(dataType => {
        const existingSignal = this.store.get(request.instanceId);

        if (existingSignal != null) {
          existingSignal.update(old => [...old, dataType]);
        } else {
          this.store.set(request.instanceId, signal([dataType]));
        }
      })
    );
  }

  readonly delete = (id: number): Observable<void> => {
    return this.httpClient.delete<void>(this.apiRouter.dataTypeDelete(id)).pipe(
      tap(() => {
        const instanceId = this.resolveInstanceId(id);

        if (instanceId != null) {
          this.store.get(instanceId)!!.update(old => old.filter(dataType => dataType.id !== id));
        }
      })
    );
  }

  readonly edit = (request: DataTypeEditRequest): Observable<void> => {
    return this.httpClient.put<void>(this.apiRouter.dataTypeEdit(request.dataTypeId), request).pipe(
      tap(() => {
        this.getById(request.dataTypeId).pipe(first()).subscribe(() => {
          // Refresh data entries, since the data type has changed, some fields may have been removed or added
          this.dataEntryService.getAll(request.dataTypeId).pipe(first()).subscribe();
        });
      })
    );
  }

  readonly getById = (id: number): Observable<DataType> => {
    return this.httpClient.get<DataType>(this.apiRouter.dataTypeGetById(id)).pipe(
      tap(dataType => {
        const existingSignal = this.store.get(dataType.instanceId);

        if (existingSignal != null) {
          existingSignal.update(old => {
            const index = old.findIndex(it => it.id === id);

            return index === -1
              ? [...old, dataType]
              : [...old.slice(0, index), dataType, ...old.slice(index + 1)];
          });
        } else {
          this.store.set(dataType.instanceId, signal([dataType]));
        }
      })
    );
  }

  readonly getAllByInstanceId = (instanceId: number): Observable<DataType[]> => {
    return this.httpClient.get<DataType[]>(this.apiRouter.dataTypeGetByInstanceId(instanceId)).pipe(
      tap(dataTypes => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => dataTypes);
        } else {
          this.store.set(instanceId, signal(dataTypes));
        }
      })
    );
  }

  readonly getAsSignal = (instanceId: number): Signal<DataType[]> => {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal == null) {
      this.store.set(instanceId, signal<DataType[]>([]));

      new Promise(resolve => this.getAllByInstanceId(instanceId).pipe(first()).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
  }
}
