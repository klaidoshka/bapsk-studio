import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import DataEntry, {CreateRequest, EditRequest} from '../model/data-entry.model';

@Injectable({
  providedIn: 'root'
})
export class DataEntryService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);

  create(request: CreateRequest): Observable<DataEntry> {
    return this.httpClient.post<DataEntry>(this.apiRouter.dataEntryCreate(), request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.dataEntryDelete(id));
  }

  edit(request: EditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.dataEntryEdit(request.id), request);
  }

  get(id: number): Observable<DataEntry> {
    return this.httpClient.get<DataEntry>(this.apiRouter.dataEntryGet(id));
  }

  getByDataTypeId(dataTypeId: number): Observable<DataEntry[]> {
    return this.httpClient.get<DataEntry[]>(this.apiRouter.dataEntryGetByDataTypeId(dataTypeId));
  }
}
