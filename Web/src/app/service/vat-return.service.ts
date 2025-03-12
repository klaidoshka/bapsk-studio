import {Injectable, signal, WritableSignal} from '@angular/core';
import {ApiRouter} from './api-router.service';
import {HttpClient} from '@angular/common/http';
import VatReturnDeclaration, {
  SubmitDeclarationState,
  VatReturnDeclarationSubmitRequest
} from '../model/vat-return.model';
import {tap} from 'rxjs';
import {toEnumOrThrow} from '../util/enum.util';

@Injectable({
  providedIn: 'root'
})
export class VatReturnService {
  // Key: InstanceId
  private store = new Map<number, WritableSignal<VatReturnDeclaration[]>>();

  constructor(
    private apiRouter: ApiRouter,
    private httpClient: HttpClient
  ) {
  }

  private readonly updateSingleInStore = (instanceId: number, declaration: VatReturnDeclaration) => {
    const existingSignal = this.store.get(instanceId);

    if (existingSignal != null) {
      existingSignal.update(declarations => {
        const index = declarations.findIndex(c => c.id === declaration.id);

        if (index !== -1) {
          declarations[index] = declaration;
        } else {
          declarations.push(declaration);
        }

        return declarations;
      });
    } else {
      this.store.set(instanceId, signal([declaration]));
    }
  }

  readonly get = (instanceId: number) => {
    return this.httpClient.get<VatReturnDeclaration[]>(this.apiRouter.vatReturnGet(instanceId)).pipe(
      tap(declarations => {
        const existingSignal = this.store.get(instanceId);

        if (existingSignal != null) {
          existingSignal.update(() => declarations.map(this.updateProperties));
        } else {
          this.store.set(instanceId, signal(declarations.map(this.updateProperties)));
        }
      })
    );
  }

  readonly getBySaleId = (saleId: number) => {
    return this.httpClient.get<VatReturnDeclaration>(this.apiRouter.vatReturnGetBySaleId(saleId)).pipe(
      tap(declaration => this.updateSingleInStore(declaration.instanceId!, this.updateProperties(declaration)))
    );
  }

  /**
   * Get the declarations as a readonly signal. VatReturnDeclarations are cached and updated whenever
   * HTTP requests are made via this service.
   *
   * @param instanceId
   *
   * @returns Readonly signal of declarations
   */
  readonly getAsSignal = (instanceId: number) => {
    if (!this.store.has(instanceId)) {
      this.store.set(instanceId, signal([]));

      new Promise((resolve) => this.get(instanceId).subscribe(resolve));
    }

    return this.store.get(instanceId)!.asReadonly();
  }

  readonly submit = (request: VatReturnDeclarationSubmitRequest) => {
    return this.httpClient.post<VatReturnDeclaration>(this.apiRouter.vatReturnSubmit(), request).pipe(
      tap(declaration => this.updateSingleInStore(request.instanceId, this.updateProperties(declaration)))
    );
  }

  readonly updateProperties = (declaration: VatReturnDeclaration): VatReturnDeclaration => {
    return {
      ...declaration,
      state: toEnumOrThrow(declaration.state, SubmitDeclarationState),
    }
  }
}
