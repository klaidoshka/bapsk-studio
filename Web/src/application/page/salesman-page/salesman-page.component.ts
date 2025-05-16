import {Component, inject, input, signal, viewChild} from '@angular/core';
import {MessageHandlingService} from '../../service/message-handling.service';
import {SalesmanService} from '../../service/salesman.service';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import Messages from '../../model/messages.model';
import Salesman from '../../model/salesman.model';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {first, map, Observable, of, startWith} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {NumberUtil} from '../../util/number.util';
import {
  SalesmanPageHeaderSectionComponent
} from "../../component/salesman-page-header-section/salesman-page-header-section.component";
import {CardComponent} from '../../component/card/card.component';
import {SaleService} from '../../service/sale.service';
import {AsyncPipe} from '@angular/common';
import {Badge} from 'primeng/badge';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'salesman-page',
  imports: [
    Button,
    TableModule,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    SalesmanPageHeaderSectionComponent,
    CardComponent,
    AsyncPipe,
    Badge,
    TranslatePipe
  ],
  templateUrl: './salesman-page.component.html',
  styles: ``
})
export class SalesmanPageComponent {
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly salesmanService = inject(SalesmanService);
  private readonly saleService = inject(SaleService);
  private readonly translateService = inject(TranslateService);
  protected readonly getCountryLabel = getIsoCountryLabel;
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly salesmen = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.salesmanService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(salesmen => salesmen.map(salesman => ({
            ...salesman,
            vatPayerCode: {
              ...salesman.vatPayerCode,
              issuedByLabel: this.getCountryLabel(salesman.vatPayerCode.issuedBy)
            }
          })))
        )
      : of(undefined)
  });

  protected delete(salesman: Salesman) {
    this.confirmationComponent().request(() => {
      this.salesmanService
        .delete(NumberUtil.parse(this.instanceId())!, salesman.id!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['action.salesman.deleted']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected getCustomersServed(salesman: Salesman): Observable<number> {
    return this.saleService
      .getAllByInstanceId(NumberUtil.parse(this.instanceId())!)
      .pipe(
        map(sales => sales.filter(sale => sale.salesman.id === salesman.id)),
        map(sales => sales.map(sale => sale.customer.id)),
        map(customers => [...new Set(customers)]),
        map(customers => customers.length),
        startWith(0)
      );
  }

  protected manage(salesman?: Salesman) {
    this.router.navigate(['./' + (salesman ? `${salesman.id}/edit` : 'create')], {relativeTo: this.route});
  }

  protected preview(salesman: Salesman) {
    this.router.navigate(['./' + salesman.id], {relativeTo: this.route});
  }
}
