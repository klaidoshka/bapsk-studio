import {effect, Injectable, signal, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Instance, {InstanceCreateRequest, InstanceEditRequest} from '../model/instance.model';
import {ApiRouter} from './api-router.service';
import {Observable, of, tap} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private instance = signal<Instance | null>(null);
  private instances = signal<Instance[]>([]);

  constructor(
    private apiRouter: ApiRouter,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    if (this.authService.isAuthenticated()()) {
      this.refresh().subscribe();
    }

    effect(() => {
      const user = this.authService.getUser()();

      if (user === null) {
        this.instance.set(null);
        this.instances.set([]);
        return;
      }

      this.refresh().subscribe();
    });
  }

  create(request: InstanceCreateRequest): Observable<Instance> {
    return this.httpClient.post<Instance>(this.apiRouter.instanceCreate(), request).pipe(
      tap((instance: Instance) => {
        this.instances.update(old => [...old, instance]);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.instanceDelete(id)).pipe(
      tap(() => {
        this.instances.update(old => old.filter(instance => instance.id !== id));
      })
    );
  }

  edit(request: InstanceEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.instanceEdit(request.instanceId), request).pipe(
      tap(() => {
        this.instances.update(old =>
          old.map(instance =>
            instance.id === request.instanceId
              ? {...instance, ...request}
              : instance
          )
        );
      })
    );
  }

  get(id: number): Observable<Instance> {
    const candidate = this.instances().find(instance => instance.id === id);

    if (candidate) {
      return of(candidate);
    }

    return this.httpClient.get<Instance>(this.apiRouter.instanceGet(id)).pipe(
      tap((instance: Instance) => {
        this.instances.update(old => [...old, instance]);
      })
    );
  }

  getAll(): Observable<Instance[]> {
    if (this.instances().length > 0) {
      return of(this.instances());
    }

    return this.httpClient.get<Instance[]>(this.apiRouter.instanceGetByUser()).pipe(
      tap((instances: Instance[]) => {
        this.instances.set(instances);
      })
    );
  }

  getAllAsSignal(): Signal<Instance[]> {
    return this.instances;
  }

  refresh() {
    return this.httpClient.get<Instance[]>(this.apiRouter.instanceGetByUser()).pipe(
      tap((instances: Instance[]) => {
        this.instances.set(instances);
      })
    );
  }

  getActiveInstance(): Signal<Instance | null> {
    return this.instance;
  }

  setActiveInstance(instance: Instance) {
    this.instance.set(instance);
  }
}
