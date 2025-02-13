import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Instance, {CreateRequest, EditRequest} from '../model/instance.model';
import {ApiRouter} from './api-router.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private apiRouter = inject(ApiRouter);
  private httpClient = inject(HttpClient);

  create(request: CreateRequest): Observable<Instance> {
    return this.httpClient.post<Instance>(this.apiRouter.instanceCreate(), request);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.instanceDelete(id));
  }

  edit(request: EditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.instanceEdit(request.instanceId), request);
  }

  get(id: number): Observable<Instance> {
    return this.httpClient.get<Instance>(this.apiRouter.instanceGet(id));
  }

  getByUser(): Observable<Instance[]> {
    return this.httpClient.get<Instance[]>(this.apiRouter.instanceGetByUser());
  }
}
