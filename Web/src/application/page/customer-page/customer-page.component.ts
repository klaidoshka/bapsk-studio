import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../../component/confirmation/confirmation.component";
import {DatePipe} from "@angular/common";
import {MessagesShowcaseComponent} from "../../component/messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import {CustomerService} from '../../service/customer.service';
import {MessageHandlingService} from '../../service/message-handling.service';
import Customer from '../../model/customer.model';
import Messages from '../../model/messages.model';
import {first, map, of} from 'rxjs';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {
  CustomerPageHeaderSectionComponent
} from '../../component/customer-page-header-section/customer-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'customer-page',
  imports: [
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent,
    TableModule,
    CustomerPageHeaderSectionComponent,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './customer-page.component.html',
  styles: ``
})
export class CustomerPageComponent {
  private readonly customerService = inject(CustomerService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly customers = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.customerService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(customers => customers.map(customer => ({
            ...customer,
            residenceCountryLabel: getIsoCountryLabel(customer.residenceCountry),
            identityDocument: {
              ...customer.identityDocument,
              typeLabel: getIdentityDocumentTypeLabel(customer.identityDocument.type)
            }
          })))
        )
      : of([])
  })

  protected delete(customer: Customer) {
    this.confirmationComponent().request(() => {
      this.customerService
        .delete(NumberUtil.parse(this.instanceId())!, customer.id!!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['action.customer.deleted']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected manage(customer?: Customer) {
    this.router.navigate(['./' + (customer ? `${customer.id}/edit` : 'create')], {relativeTo: this.route});
  }

  protected preview(customer: Customer) {
    this.router.navigate(['./' + customer.id], {relativeTo: this.route});
  }
}
