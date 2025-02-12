import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import DataTypeField, {
  DataTypeFieldCreateRequest,
  DataTypeFieldEditRequest
} from '../model/data-type-field.model';

@Injectable({
  providedIn: 'root'
})
export class DataTypeFieldService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);

  create(request: DataTypeFieldCreateRequest): Observable<DataTypeField> {
    return this.httpClient.post<DataTypeField>(this.apiRouter.dataTypeFieldCreate(), request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.dataTypeFieldDelete(id));
  }

  edit(request: DataTypeFieldEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.dataTypeFieldEdit(request.id), request);
  }

  get(id: number): Observable<DataTypeField> {
    return this.httpClient.get<DataTypeField>(this.apiRouter.dataTypeFieldGet(id));
  }

  getByDataTypeId(dataTypeId: number): Observable<DataTypeField[]> {
    return this.httpClient.get<DataTypeField[]>(this.apiRouter.dataTypeFieldGetByDataTypeId(dataTypeId));
  }
}
