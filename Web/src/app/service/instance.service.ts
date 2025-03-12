import {computed, effect, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Instance, {InstanceCreateRequest, InstanceEditRequest} from '../model/instance.model';
import {ApiRouter} from './api-router.service';
import {first, Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private activeInstance = signal<Instance | null>(null);
  private store = signal<Instance[]>([]);

  constructor(
    private apiRouter: ApiRouter,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    if (this.authService.isAuthenticated()()) {
      this.getAll().subscribe(this.refreshActiveInstance);
    }

    effect(() => {
      const user = this.authService.getUser()();

      if (user === null) {
        this.activeInstance.set(null);
        this.store.set([]);
        return;
      }

      this.getAll().subscribe(this.refreshActiveInstance);
    });
  }

  private readonly refreshActiveInstance = (instances: Instance[]) => {
    if (instances.length > 0) {
      this.activeInstance.set(instances[0]);
    } else if (this.activeInstance() !== null) {
      this.activeInstance.set(null);
    }
  }

  readonly create = (request: InstanceCreateRequest): Observable<Instance> => {
    return this.httpClient.post<Instance>(this.apiRouter.instanceCreate(), request).pipe(
      tap((instance: Instance) => this.store.update(old => [...old, instance]))
    );
  }

  readonly delete = (id: number): Observable<void> => {
    return this.httpClient.delete<void>(this.apiRouter.instanceDelete(id)).pipe(
      tap(() => this.store.update(old => old.filter(instance => instance.id !== id)))
    );
  }

  readonly edit = (request: InstanceEditRequest): Observable<void> => {
    return this.httpClient.put<void>(this.apiRouter.instanceEdit(request.instanceId), request).pipe(
      tap(() => this.get(request.instanceId).pipe(first()).subscribe())
    );
  }

  readonly get = (id: number): Observable<Instance> => {
    return this.httpClient.get<Instance>(this.apiRouter.instanceGetById(id)).pipe(
      tap((instance: Instance) => this.store.update(old => {
        const index = old.findIndex(i => i.id === instance.id);

        if (index !== -1) {
          old[index] = instance;

          if (this.activeInstance() !== null && this.activeInstance()?.id === instance.id) {
            this.activeInstance.set(instance);
          }
        } else {
          old.push(instance);
        }

        return old;
      }))
    );
  }

  readonly getAll = (): Observable<Instance[]> => {
    return this.httpClient.get<Instance[]>(this.apiRouter.instanceGetByUser()).pipe(
      tap((instances: Instance[]) => this.store.set(instances))
    );
  }

  readonly getActiveInstance = (): WritableSignal<Instance | null> => {
    return this.activeInstance;
  }

  readonly getActiveInstanceId = (): Signal<number | null> => {
    return computed(() => this.activeInstance()?.id || null);
  }

  /**
   * Get the instances as a readonly signal. Instances are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @returns Readonly signal of instances
   */
  readonly getAsSignal = (): Signal<Instance[]> => {
    return this.store.asReadonly();
  }

  readonly setActiveInstance = (instance: Instance) => {
    this.activeInstance.set(instance);
  }
}
