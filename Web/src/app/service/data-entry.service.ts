import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, Observable, of, tap} from 'rxjs';
import DataEntry, {DataEntryCreateRequest, DataEntryEditRequest} from '../model/data-entry.model';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  private store = new Map<number, WritableSignal<DataEntry[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  /**
   * Find the data type id that has specified data entry id. It may be null if no fetched data type
   * has the data entry.
   *
   * @param id The data entry id
   */
  private findDataTypeId(id: number): number | null {
    let dataTypeId: number | null = null;

    for (const [key, values] of this.store.entries()) {
      if (values().find(dataEntry => dataEntry.id === id)) {
        dataTypeId = key;
        break
      }
    }

    return dataTypeId;
  }

  create(request: DataEntryCreateRequest): Observable<DataEntry> {
    return this.httpClient.post<DataEntry>(this.apiRouter.dataEntryCreate(), request).pipe(
      tap(dataEntry => {
        if (this.store.has(dataEntry.dataTypeId)) {
          this.store.get(request.dataTypeId)!!.update(old => [...old, dataEntry]);
        } else {
          this.store.set(request.dataTypeId, signal([dataEntry]));
        }
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.dataEntryDelete(id)).pipe(
      tap(() => {
        const dataTypeId = this.findDataTypeId(id);

        if (dataTypeId) {
          this.store.get(dataTypeId)!!.update(old => old.filter(dataEntry => dataEntry.id !== id));
        }
      })
    );
  }

  edit(request: DataEntryEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.dataEntryEdit(request.dataEntryId), request).pipe(
      tap(() => {
        const dataTypeId = this.findDataTypeId(request.dataEntryId);

        if (dataTypeId) {
          this.getFromBackend(request.dataEntryId).pipe(first()).subscribe(updatedDataEntry => {
            this.store.get(dataTypeId)?.update(old => old.map(dataEntry => {
              if (dataEntry.id === updatedDataEntry.id) {
                return updatedDataEntry;
              } else {
                return dataEntry;
              }
            }));
          })
        }
      })
    );
  }

  private getFromBackend(id: number): Observable<DataEntry> {
    return this.httpClient.get<DataEntry>(this.apiRouter.dataEntryGet(id));
  }

  get(id: number): Observable<DataEntry> {
    const candidate = Array.from(this.store.values())
    .flatMap(dataEntries => dataEntries())
    .find(dataEntry => dataEntry.id === id);

    if (candidate) {
      return of(candidate);
    }

    return this.getFromBackend(id).pipe(tap(dataEntry => {
        if (this.store.has(dataEntry.dataTypeId)) {
          this.store.get(dataEntry.dataTypeId)!!.update(old => [...old, dataEntry]);
        } else {
          this.store.set(dataEntry.dataTypeId, signal([dataEntry]));
        }
      })
    );
  }

  getAll(dataTypeId: number): Observable<DataEntry[]> {
    if (this.store.has(dataTypeId)) {
      return of(this.store.get(dataTypeId)!!());
    }

    return this.httpClient.get<DataEntry[]>(this.apiRouter.dataEntryGetByDataTypeId(dataTypeId)).pipe(
      tap(dataEntries => this.store.set(dataTypeId, signal(dataEntries)))
    );
  }

  getAllAsSignal(dataTypeId: number): Signal<DataEntry[]> {
    if (!this.store.has(dataTypeId)) {
      this.store.set(dataTypeId, signal([]));
      this.refresh(dataTypeId);
    }

    return this.store.get(dataTypeId)!!;
  }

  refresh(dataTypeId: number) {
    this.httpClient.get<DataEntry[]>(this.apiRouter.dataEntryGetByDataTypeId(dataTypeId)).pipe(
      tap(dataEntries => this.store.get(dataTypeId)!!.set(dataEntries))
    ).subscribe();
  }
}
