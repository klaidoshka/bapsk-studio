import {computed, inject, Injectable, signal, Signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Instance, {InstanceCreateRequest, InstanceEditRequest, InstanceWithUsers} from '../model/instance.model';
import {ApiRouter} from './api-router.service';
import {combineLatest, first, map, Observable, of, switchMap, tap} from 'rxjs';
import {AuthService} from './auth.service';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class InstanceService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  private readonly userService = inject(UserService);
  private readonly cacheService = new CacheService<number, Instance>(instance => instance.id!);
  private readonly instancesFetched = signal<boolean>(false);
  private readonly isLoading = signal<boolean>(true);
  private readonly activeInstance = signal<Instance | undefined>(undefined);

  constructor() {
    this.authService
      .getUser()
      .pipe(
        switchMap(user => {
          if (user == null) {
            this.activeInstance.set(undefined);
            this.cacheService.update([], () => true);
            return of([]);
          }

          return this
            .getAll()
            .pipe(first());
        })
      )
      .subscribe(instances => {
        if (instances.length == 1) {
          const activeInstanceId = this.activeInstance()?.id;

          if (
            activeInstanceId === undefined ||
            !instances.find(instance => instance.id === activeInstanceId)
          ) {
            this.activeInstance.set(instances[0]);
          }
        } else if (instances.length == 0 && this.activeInstance() !== undefined) {
          this.activeInstance.set(undefined);
        }

        if (this.isLoading()) {
          this.isLoading.set(false);
        }
      });
  }

  create(request: InstanceCreateRequest): Observable<Instance> {
    return this.httpClient
      .post<Instance>(this.apiRouter.instance.create(), request)
      .pipe(
        map(instance => this.updateProperties(instance)),
        tap(instance => this.cacheService.set(instance)),
        switchMap(instance => this.cacheService.get(instance.id!))
      );
  }

  delete(id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.instance.delete(id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: InstanceEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(this.apiRouter.instance.edit(request.instanceId), request)
      .pipe(
        tap(() => {
            this.cacheService.invalidate(request.instanceId);

            this
              .getById(request.instanceId)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(id: number): Observable<Instance> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<Instance>(this.apiRouter.instance.getById(id))
      .pipe(
        map(instance => this.updateProperties(instance)),
        tap(instance => this.cacheService.set(instance)),
        switchMap(instance => this.cacheService.get(instance.id!))
      );
  }

  getAll(): Observable<Instance[]> {
    if (this.instancesFetched()) {
      return this.cacheService.getAll();
    }

    return this.httpClient
      .get<Instance[]>(this.apiRouter.instance.getByUser())
      .pipe(
        map(instances => instances.map(instance => this.updateProperties(instance))),
        tap(instances => {
          this.instancesFetched.set(true);
          this.cacheService.update(instances, () => true);
        }),
        switchMap(_ => this.cacheService.getAll())
      );
  }

  getAllWithUsers(): Observable<InstanceWithUsers[]> {
    return this
      .getAll()
      .pipe(
        switchMap(instances =>
          combineLatest(
            instances.map(instance =>
              combineLatest(instance.users
                .map(instanceUser => this.userService
                  .getById(instanceUser.userId)
                  .pipe(
                    map(user => ({
                      ...instanceUser,
                      user
                    }))
                  )
                ))
                .pipe(
                  map(users => ({
                    ...instance,
                    users
                  }))
                )
            )
          )
        )
      );
  }

  getWithUsersById(id: number): Observable<InstanceWithUsers> {
    return this.httpClient
      .get<InstanceWithUsers>(this.apiRouter.instance.getById(id))
      .pipe(
        switchMap(instance =>
          combineLatest(instance.users
            .map(instanceUser => this.userService
              .getById(instanceUser.userId)
              .pipe(
                map(user => ({
                  ...instanceUser,
                  user
                }))
              )
            ))
            .pipe(
              map(users => ({
                ...instance,
                users
              }))
            )
        )
      );
  }

  getActiveInstance(): Signal<Instance | undefined> {
    return this.activeInstance.asReadonly();
  }

  getActiveInstanceId(): Signal<number | undefined> {
    return computed(() => this.activeInstance()?.id);
  }

  getLoadingState(): Signal<boolean> {
    return this.isLoading.asReadonly();
  }

  setActiveInstance(instance?: Instance) {
    this.activeInstance.set(instance);
  }

  updateProperties(instance: Instance): Instance {
    return {
      ...instance,
      createdAt: DateUtil.adjustToLocalDate(instance.createdAt)
    }
  }
}
