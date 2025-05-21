import {BehaviorSubject, distinctUntilChanged, map, Observable} from 'rxjs';

type CachedValue<V> = {
  isInvalid: boolean;
  value: V;
};

export class CacheService<K, V> {
  private readonly store = new BehaviorSubject<Map<K, CachedValue<V>>>(new Map());

  constructor(private idMapper?: (value: V) => K) {
  }

  delete(key: K) {
    const updated = new Map(this.store.value);
    updated.delete(key);
    this.store.next(updated);
  }

  deleteAll() {
    this.store.next(new Map());
  }

  execute<R>(callback: (values: Map<K, V>) => R): R {
    return callback(
      new Map(
        Array
          .from(this.store.value.entries())
          .map(([key, value]) => [key, value.value])
      )
    );
  }

  get(key: K): Observable<V> {
    return this.store.pipe(
      map(map => map.get(key)),
      map(value => value?.value),
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
      map(map => Array
        .from(map.values())
        .map(value => value.value)
        .filter(predicate)
      ),
      distinctUntilChanged()
    );
  }

  has(key: K, acceptInvalid: boolean = false): boolean {
    const candidate = this.store.value.get(key);
    return candidate !== undefined && (!candidate.isInvalid || acceptInvalid);
  }

  invalidate(key: K) {
    const updated = new Map(this.store.value);
    const value = updated.get(key);

    if (value) {
      updated.set(key, { value: value.value, isInvalid: true });
      this.store.next(updated);
    }
  }

  set(value: V) {
    if (!this.idMapper) {
      throw new Error('idMapper is not set');
    }

    this.setToKey(this.idMapper(value), value);
  }

  setToKey(key: K, value: V) {
    const updated = new Map(this.store.value);

    updated.set(
      key,
      {
        value: value,
        isInvalid: false
      }
    );

    this.store.next(updated);
  }

  update(setValues: V[], remove?: (value: V) => boolean) {
    const updated = new Map(this.store.value);

    if (remove) {
      for (const [key, value] of updated.entries()) {
        if (remove(value.value)) {
          updated.delete(key);
        }
      }
    }

    if (setValues.length > 0) {
      if (!this.idMapper) {
        throw new Error('idMapper is not set');
      }
    }

    for (const value of setValues) {
      updated.set(
        this.idMapper!(value),
        {
          value: value,
          isInvalid: false
        }
      );
    }

    this.store.next(updated);
  }
}
