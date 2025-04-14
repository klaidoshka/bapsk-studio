import {BehaviorSubject, distinctUntilChanged, map, Observable} from 'rxjs';

type CachedValue<V> = V & {
  __isInvalidated__: boolean;
};

export class CacheService<K, V> {
  private readonly store = new BehaviorSubject<Map<K, CachedValue<V>>>(new Map());

  constructor(
    private readonly idMapper: (value: V) => K,
    private readonly setMapper?: (value: V) => V
  ) {
  }

  delete(key: K) {
    const updated = new Map(this.store.value);
    updated.delete(key);
    this.store.next(updated);
  }

  execute<R>(callback: (values: Map<K, V>) => R): R {
    return callback(new Map(this.store.value));
  }

  get(key: K): Observable<V> {
    return this.store.pipe(
      map(map => map.get(key)),
      distinctUntilChanged(),
      map(value => {
        if (value === undefined) {
          throw new Error(`Cache miss for key ${String(key)}`);
        }
        return value;
      })
    );
  }

  getAll(): Observable<V[]> {
    return this.getAllWhere(() => true);
  }

  getAllWhere(predicate: (value: V) => boolean): Observable<V[]> {
    return this.store.pipe(
      map(map => Array.from(map.values()).filter(predicate)),
      distinctUntilChanged()
    );
  }

  has(key: K): boolean {
    const candidate = this.store.value.get(key);

    return candidate && !candidate.__isInvalidated__ || false;
  }

  invalidate(key: K) {
    const updated = new Map(this.store.value);
    const value = updated.get(key);

    if (value) {
      updated.set(key, {...value, __isInvalidated__: true});
      this.store.next(updated);
    }
  }

  set(value: V) {
    const updated = new Map(this.store.value);

    updated.set(
      this.idMapper(value),
      {
        ...(this.setMapper ? this.setMapper(value) : value),
        __isInvalidated__: false
      }
    );

    this.store.next(updated);
  }

  update(setValues: V[], remove?: (value: V) => boolean) {
    const updated = new Map(this.store.value);

    if (remove) {
      for (const [key, value] of updated.entries()) {
        if (remove(value)) {
          updated.delete(key);
        }
      }
    }

    for (const value of setValues) {
      updated.set(
        this.idMapper(value),
        {
          ...(this.setMapper ? this.setMapper(value) : value),
          __isInvalidated__: false
        }
      );
    }

    this.store.next(updated);
  }
}
