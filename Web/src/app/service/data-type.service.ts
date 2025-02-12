import {inject, Injectable} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../model/data-type.model';

@Injectable({
  providedIn: 'root'
})
export class DataTypeService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);

  create(request: DataTypeCreateRequest): Observable<DataType> {
    return this.httpClient.post<DataType>(this.apiRouter.dataTypeCreate(), request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.dataTypeDelete(id));
  }

  edit(request: DataTypeEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.dataTypeEdit(request.id), request);
  }

  get(id: number): Observable<DataType> {
    return this.httpClient.get<DataType>(this.apiRouter.dataTypeGet(id));
  }

  getByInstanceId(instanceId: number): Observable<DataType[]> {
    return this.httpClient.get<DataType[]>(this.apiRouter.dataTypeGetByInstanceId(instanceId));
  }
}
