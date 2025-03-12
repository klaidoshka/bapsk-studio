import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouter} from './api-router.service';
import Customer, {CustomerCreateRequest, CustomerEditRequest} from '../model/customer.model';
import {first, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Key: InstanceId
  private customers = new Map<number, WritableSignal<Customer[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  private readonly updateSingleInStore = (instanceId: number, customer: Customer) => {
    const existingSignal = this.customers.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(customers => {
        const index = customers.findIndex(c => c.id === customer.id);

        if (index !== -1) {
          customers[index] = customer;
        } else {
          customers.push(customer);
        }

        return customers;
      });
    } else {
      this.customers.set(instanceId, signal([customer]));
    }
  }

  readonly create = (request: CustomerCreateRequest) => {
    return this.httpClient.post<Customer>(this.apiRouter.customerCreate(), request).pipe(
      tap(customer => this.updateSingleInStore(request.instanceId, customer))
    );
  }

  readonly edit = (request: CustomerEditRequest) => {
    return this.httpClient.put<void>(this.apiRouter.customerEdit(request.customer.id!), request).pipe(
      tap(() => this.getById(request.instanceId, request.customer.id!).pipe(first()).subscribe())
    );
  }

  readonly delete = (instanceId: number, id: number) => {
    return this.httpClient.delete<void>(this.apiRouter.customerDelete(id)).pipe(
      tap(() => {
        const existingSignal = this.customers.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(customers => customers.filter(c => c.id !== id));
        } else {
          this.customers.set(instanceId, signal([]));
        }
      })
    );
  }

  readonly get = (instanceId: number) => {
    return this.httpClient.get<Customer[]>(this.apiRouter.customerGetByInstanceId(instanceId)).pipe(
      tap(customers => {
        const existingSignal = this.customers.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => customers);
        } else {
          this.customers.set(instanceId, signal(customers));
        }
      })
    );
  }

  readonly getById = (instanceId: number, id: number) => {
    return this.httpClient.get<Customer>(this.apiRouter.customerGetById(id)).pipe(
      tap(customer => this.updateSingleInStore(instanceId, customer))
    );
  }

  /**
   * Get the customers as a readonly signal. Customers are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @param instanceId
   *
   * @returns Readonly signal of customers
   */
  readonly getAsSignal = (instanceId: number) => {
    if (!this.customers.has(instanceId)) {
      this.customers.set(instanceId, signal([]));

      new Promise((resolve) => this.get(instanceId).subscribe(resolve));
    }

    return this.customers.get(instanceId)!.asReadonly();
  }
}
