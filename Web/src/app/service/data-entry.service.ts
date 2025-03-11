import {Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {first, Observable, tap} from 'rxjs';
import DataEntry, {DataEntryCreateRequest, DataEntryEditRequest} from '../model/data-entry.model';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  // Key: DataTypeId
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
  private readonly toDataTypeId = (id: number): number | null => {
    let dataTypeId: number | null = null;

    for (const [key, values] of this.store.entries()) {
      if (values().find(dataEntry => dataEntry.id === id)) {
        dataTypeId = key;
        break
      }
    }

    return dataTypeId;
  }

  readonly create = (request: DataEntryCreateRequest): Observable<DataEntry> => {
    return this.httpClient.post<DataEntry>(this.apiRouter.dataEntryCreate(), request).pipe(
      tap(dataEntry => {
        const existingSignal = this.store.get(request.dataTypeId);

        if (existingSignal != null) {
          existingSignal.update(old => [...old, dataEntry]);
        } else {
          this.store.set(request.dataTypeId, signal([dataEntry]));
        }
      })
    );
  }

  readonly delete = (id: number): Observable<void> => {
    return this.httpClient.delete<void>(this.apiRouter.dataEntryDelete(id)).pipe(
      tap(() => {
        const dataTypeId = this.toDataTypeId(id);

        if (dataTypeId != null) {
          this.store.get(dataTypeId)?.update(old => old.filter(dataEntry => dataEntry.id !== id));
        }
      })
    );
  }

  readonly edit = (request: DataEntryEditRequest): Observable<void> => {
    return this.httpClient.put<void>(this.apiRouter.dataEntryEdit(request.dataEntryId), request).pipe(
      tap(() => this.get(request.dataEntryId).pipe(first()).subscribe())
    );
  }

  readonly get = (id: number): Observable<DataEntry> => {
    return this.httpClient.get<DataEntry>(this.apiRouter.dataEntryGetById(id)).pipe(
      tap(dataEntry => {
        const existingSignal = this.store.get(dataEntry.dataTypeId);

        if (existingSignal != null) {
          existingSignal.update(old => {
            const index = old.findIndex(de => de.id === id);

            if (index !== -1) {
              old[index] = dataEntry;
            } else {
              old.push(dataEntry);
            }

            return old;
          });
        } else {
          this.store.set(dataEntry.dataTypeId, signal([dataEntry]));
        }
      })
    );
  }

  readonly getAll = (dataTypeId: number): Observable<DataEntry[]> => {
    return this.httpClient.get<DataEntry[]>(this.apiRouter.dataEntryGetByDataTypeId(dataTypeId)).pipe(
      tap(dataEntries => {
        const existingSignal = this.store.get(dataTypeId);

        if (existingSignal != null) {
          existingSignal.set(dataEntries);
        } else {
          this.store.set(dataTypeId, signal(dataEntries))
        }
      })
    );
  }


  /**
   * Get the data entries as a readonly signal. Data entries are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @returns Readonly signal of data entries
   */
  getAsSignal(dataTypeId: number): Signal<DataEntry[]> {
    if (!this.store.has(dataTypeId)) {
      this.store.set(dataTypeId, signal([]));
      this.getAll(dataTypeId).subscribe();
    }

    return this.store.get(dataTypeId)!!;
  }
}
