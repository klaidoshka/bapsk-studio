import {effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, Observable, of, tap} from 'rxjs';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../model/data-type.model';
import {InstanceService} from './instance.service';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {
  private dataTypes = signal<DataType[]>([]);
  private instanceId = signal<number | null>(null);
  private store = new Map<number, WritableSignal<DataType[]>>();

  // TODO: Drop instance signal usage, consumer should ask for what it wants
  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient,
    private instanceService: InstanceService
  ) {
    const instance = this.instanceService.getActiveInstance();

    effect(() => {
      const id = instance()?.id;
      this.instanceId.set(id || null);

      if (!id) {
        this.dataTypes.set([]);
        return;
      }

      if (!this.store.has(id)) {
        // Will put the data types in the store and apply current data types to the signal
        this.getAllByInstanceId(id).subscribe();
      } else {
        this.dataTypes.set(this.store.get(id)!!());
      }
    });
  }

  create(request: DataTypeCreateRequest): Observable<DataType> {
    return this.httpClient.post<DataType>(this.apiRouter.dataTypeCreate(), request).pipe(
      tap(dataType => {
        this.dataTypes.update(old => [...old, dataType]);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.dataTypeDelete(id)).pipe(
      tap(() => {
        this.dataTypes.update(old => old.filter(dataType => dataType.id !== id));
      })
    );
  }

  edit(request: DataTypeEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.dataTypeEdit(request.dataTypeId), request).pipe(
      tap(() => {
        this.getFromBackend(request.dataTypeId).pipe(first()).subscribe(updatedDataType => {
          this.dataTypes.update(old => old.map(dataType => {
            if (dataType.id === updatedDataType.id) {
              return updatedDataType;
            }
            return dataType;
          }));
        });
      })
    );
  }

  private getFromBackend(id: number): Observable<DataType> {
    return this.httpClient.get<DataType>(this.apiRouter.dataTypeGet(id));
  }

  get(id: number): Observable<DataType> {
    const candidate = this.dataTypes().find(dataType => dataType.id === id);

    if (candidate) {
      return of(candidate);
    }

    return this.getFromBackend(id).pipe(
      tap(dataType => {
        this.dataTypes.update(old => [...old, dataType]);
      })
    );
  }

  private getAllByInstanceId(instanceId: number): Observable<DataType[]> {
    return this.httpClient.get<DataType[]>(this.apiRouter.dataTypeGetByInstanceId(instanceId)).pipe(
      tap(dataTypes => {
        if (!this.store.has(instanceId)) {
          this.store.set(instanceId, signal<DataType[]>(dataTypes));
        } else {
          this.store.get(instanceId)!!.set(dataTypes);
        }
        this.dataTypes.set(dataTypes);
      })
    );
  }

  getAll(): Observable<DataType[]> {
    const instanceId = this.instanceService.getActiveInstance()()?.id;

    if (!instanceId) {
      return of([]);
    }

    if (!this.store.has(instanceId)) {
      return this.getAllByInstanceId(instanceId);
    } else {
      return of(this.store.get(instanceId)!!())
    }
  }

  getAllAsSignal(): Signal<DataType[]> {
    return this.dataTypes;
  }

  refresh() {
    if (this.instanceId()) {
      this.getAllByInstanceId(this.instanceId()!!).subscribe();
    }
  }
}
