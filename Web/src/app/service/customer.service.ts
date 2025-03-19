import {Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouter} from './api-router.service';
import Customer, {CustomerCreateRequest, CustomerEditRequest} from '../model/customer.model';
import {first, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {IsoCountryCode} from '../model/iso-country.model';
import {IdentityDocumentType} from '../model/identity-document-type.model';
import {DateUtil} from '../util/date.util';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<Customer[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  private readonly updateSingleInStore = (instanceId: number, customer: Customer) => {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(customers => {
        const index = customers.findIndex(c => c.id === customer.id);

        return index !== -1
          ? [...customers.slice(0, index), customer, ...customers.slice(index + 1)]
          : [...customers, customer];
      });
    } else {
      this.store.set(instanceId, signal([customer]));
    }
  }

  readonly create = (request: CustomerCreateRequest) => {
    return this.httpClient.post<Customer>(this.apiRouter.customerCreate(), {
      ...request,
      customer: {
        ...request.customer,
        birthdate: request.customer.birthdate.toISOString() as any
      }
    } as CustomerCreateRequest).pipe(
      tap(customer => this.updateSingleInStore(request.instanceId, this.updateProperties(customer)))
    );
  }

  readonly delete = (instanceId: number, id: number) => {
    return this.httpClient.delete<void>(this.apiRouter.customerDelete(id)).pipe(
      tap(() => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(customers => customers.filter(c => c.id !== id));
        } else {
          this.store.set(instanceId, signal([]));
        }
      })
    );
  }

  readonly edit = (request: CustomerEditRequest) => {
    return this.httpClient.put<void>(this.apiRouter.customerEdit(request.customer.id!), {
      ...request,
      customer: {
        ...request.customer,
        birthdate: request.customer.birthdate.toISOString() as any
      }
    } as CustomerEditRequest).pipe(
      tap(() => this.getById(request.instanceId, request.customer.id!).pipe(first()).subscribe())
    );
  }

  readonly get = (instanceId: number) => {
    return this.httpClient.get<Customer[]>(this.apiRouter.customerGet(instanceId)).pipe(
      tap(customers => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => customers.map(this.updateProperties));
        } else {
          this.store.set(instanceId, signal(customers.map(this.updateProperties)));
        }
      })
    );
  }

  readonly getById = (instanceId: number, id: number) => {
    return this.httpClient.get<Customer>(this.apiRouter.customerGetById(id)).pipe(
      tap(customer => this.updateSingleInStore(instanceId, this.updateProperties(customer)))
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
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));

      new Promise((resolve) => this.get(instanceId).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
  }

  readonly updateProperties = (customer: Customer): Customer => {
    return {
      ...customer,
      birthdate: DateUtil.adjustToLocalDate(customer.birthdate),
      identityDocument: {
        ...customer.identityDocument,
        issuedBy: EnumUtil.toEnumOrThrow(customer.identityDocument.issuedBy, IsoCountryCode),
        type: EnumUtil.toEnumOrThrow(customer.identityDocument.type, IdentityDocumentType)
      },
      otherDocuments: customer.otherDocuments.map(it => ({
        ...it,
        issuedBy: EnumUtil.toEnumOrThrow(it.issuedBy, IsoCountryCode),
      })),
      residenceCountry: EnumUtil.toEnumOrThrow(customer.residenceCountry, IsoCountryCode)
    };
  }
}
