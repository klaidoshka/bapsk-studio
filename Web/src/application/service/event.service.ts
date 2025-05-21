import {Injectable} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import Event from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private subjects = new Map<string, Subject<any>>();

  call<E extends Event<D>, D>(event: E) {
    const subject = this.subjects.get(event.id);

    if (subject) {
      subject.next(event.data);
    }
  }

  subscribe<E extends Event<D>, D>(
    event: E,
    handler: (data: D) => void
  ): Subscription {
    if (!this.subjects.has(event.id)) {
      this.subjects.set(event.id, new Subject<D>());
    }

    return this.subjects
      .get(event.id)!
      .subscribe(handler);
  }
}
