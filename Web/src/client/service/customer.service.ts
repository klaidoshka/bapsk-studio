import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiRouter} from './api-router.service';
import Customer, {CustomerCreateRequest, CustomerEditRequest} from '../model/customer.model';
import {first, map, Observable, switchMap, tap} from 'rxjs';
import {EnumUtil} from '../util/enum.util';
import {IsoCountryCode} from '../model/iso-country.model';
import {IdentityDocumentType} from '../model/identity-document-type.model';
import {DateUtil} from '../util/date.util';
import {CacheService} from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly apiRouter = inject(ApiRouter);
  private readonly httpClient = inject(HttpClient);

  private readonly cacheService = new CacheService<number, Customer>(c => c.id!);
  private readonly instancesFetched = new Set<number>();

  private adjustRequestDateToISO<T extends CustomerCreateRequest | CustomerEditRequest>(request: T): T {
    return {
      ...request,
      customer: {
        ...request.customer,
        birthdate: request.customer.birthdate?.toISOString() as any
      }
    };
  }

  create(request: CustomerCreateRequest): Observable<Customer> {
    return this.httpClient
      .post<Customer>(
        this.apiRouter.customer.create(request.instanceId),
        this.adjustRequestDateToISO(request)
      )
      .pipe(
        map(customer => this.updateProperties(customer)),
        tap(customer => this.cacheService.set(customer)),
        switchMap(customer => this.cacheService.get(customer.id!))
      );
  }

  delete(instanceId: number, id: number): Observable<void> {
    return this.httpClient
      .delete<void>(this.apiRouter.customer.delete(instanceId, id))
      .pipe(
        tap(() => this.cacheService.delete(id))
      );
  }

  edit(request: CustomerEditRequest): Observable<void> {
    return this.httpClient
      .put<void>(
        this.apiRouter.customer.edit(request.instanceId, request.customer.id!),
        this.adjustRequestDateToISO(request)
      )
      .pipe(
        tap(() => {
            this.cacheService.invalidate(request.customer.id!);

            this
              .getById(request.instanceId, request.customer.id!)
              .pipe(first())
              .subscribe();
          }
        )
      );
  }

  getById(instanceId: number, id: number): Observable<Customer> {
    if (this.cacheService.has(id)) {
      return this.cacheService.get(id);
    }

    return this.httpClient
      .get<Customer>(this.apiRouter.customer.getById(instanceId!, id))
      .pipe(
        map(customer => this.updateProperties(customer)),
        tap(customer => this.cacheService.set(customer)),
        switchMap(customer => this.cacheService.get(customer.id!))
      );
  }

  getByInstanceId(instanceId: number): Observable<Customer[]> {
    if (this.instancesFetched.has(instanceId)) {
      return this.cacheService.getAllWhere(customer => customer.instanceId === instanceId);
    }

    return this.httpClient
      .get<Customer[]>(this.apiRouter.customer.getByInstanceId(instanceId))
      .pipe(
        map(customers => customers.map(customer => this.updateProperties(customer))),
        tap(customers => {
          this.instancesFetched.add(instanceId);

          this.cacheService.update(
            customers,
            customer => customer.instanceId === instanceId
          );
        }),
        switchMap(_ => this.cacheService.getAllWhere(customer => customer.instanceId === instanceId))
      );
  }

  updateProperties(customer: Customer): Customer {
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
