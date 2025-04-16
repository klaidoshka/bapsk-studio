import {computed, effect, inject, Injectable, signal, Signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Instance, {InstanceCreateRequest, InstanceEditRequest} from '../model/instance.model';
import {ApiRouter} from './api-router.service';
import {first, Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';
import {DateUtil} from '../util/date.util';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);

  private readonly activeInstance = signal<Instance | undefined>(undefined);
  private readonly store = signal<Instance[]>([]);

  constructor() {
    if (this.authService.isAuthenticated()()) {
      this.getAll().pipe(first()).subscribe(instances => this.refreshActiveInstance(instances));
    }

    effect(() => {
      const user = this.authService.getUser()();

      if (user == null) {
        this.activeInstance.set(undefined);
        this.store.set([]);
        return;
      }

      this.getAll().pipe(first()).subscribe(instances => this.refreshActiveInstance(instances));
    });
  }

  private refreshActiveInstance(instances: Instance[]) {
    if (instances.length > 0) {
      this.activeInstance.set(instances[0]);
    } else if (this.activeInstance() != null) {
      this.activeInstance.set(undefined);
    }
  }

  create(request: InstanceCreateRequest): Observable<Instance> {
    return this.httpClient.post<Instance>(this.apiRouter.instanceCreate(), request).pipe(
      tap((instance: Instance) => this.store.update(old => [...old, this.updateProperties(instance)]))
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.apiRouter.instanceDelete(id)).pipe(
      tap(() => this.store.update(old => old.filter(instance => instance.id !== id)))
    );
  }

  edit(request: InstanceEditRequest): Observable<void> {
    return this.httpClient.put<void>(this.apiRouter.instanceEdit(request.instanceId), request).pipe(
      tap(() => this.get(request.instanceId).pipe(first()).subscribe())
    );
  }

  get(id: number): Observable<Instance> {
    return this.httpClient.get<Instance>(this.apiRouter.instanceGetById(id)).pipe(
      tap((instance: Instance) => this.store.update(old => {
        const index = old.findIndex(i => i.id === instance.id);

        if (index !== -1) {
          if (this.activeInstance() !== null && this.activeInstance()?.id === instance.id) {
            this.activeInstance.set(this.updateProperties(instance));
          }

          return [...old.slice(0, index), this.updateProperties(instance), ...old.slice(index + 1)];
        }

        return [...old, this.updateProperties(instance)];
      }))
    );
  }

  getAll(): Observable<Instance[]> {
    return this.httpClient.get<Instance[]>(this.apiRouter.instanceGetByUser()).pipe(
      tap((instances: Instance[]) => this.store.set(instances.map(instance => this.updateProperties(instance))))
    );
  }

  getActiveInstance(): WritableSignal<Instance | undefined> {
    return this.activeInstance;
  }

  getActiveInstanceId(): Signal<number | undefined> {
    return computed(() => this.activeInstance()?.id);
  }

  /**
   * Get the instances as a readonly signal. Instances are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @returns Readonly signal of instances
   */
  getAsSignal(): Signal<Instance[]> {
    return this.store.asReadonly();
  }

  setActiveInstance(instance: Instance) {
    this.activeInstance.set(instance);
  }

  updateProperties(instance: Instance): Instance {
    return {
      ...instance,
      createdAt: DateUtil.adjustToLocalDate(instance.createdAt)
    }
  }
}
