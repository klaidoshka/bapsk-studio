import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../../component/confirmation/confirmation.component";
import {DatePipe} from "@angular/common";
import {
  MessagesShowcaseComponent
} from "../../component/messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import {CustomerService} from '../../service/customer.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import Customer from '../../model/customer.model';
import Messages from '../../model/messages.model';
import {first, of} from 'rxjs';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';

@Component({
  selector: 'customer-page',
  imports: [
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent,
    TableModule
  ],
  templateUrl: './customer-page.component.html',
  styles: ``
})
export class CustomerPageComponent {
  private readonly customerService = inject(CustomerService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly router = inject(Router);
  protected readonly getIdentityDocumentTypeLabel = getIdentityDocumentTypeLabel;
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly customers = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.customerService.getAllByInstanceId(request.instanceId)
      : of([])
  })

  protected delete(customer: Customer) {
    this.confirmationComponent().request(() => {
      this.customerService
        .delete(NumberUtil.parse(this.instanceId())!, customer.id!!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Customer deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(customer?: Customer) {
    this.router.navigate(
      ['home/workspace/customer/' + (customer ? `${customer}/edit` : 'create')]
    );
  }

  protected preview(customer: Customer) {
    this.router.navigate(['home/workspace/customer/' + customer.id]);
  }
}
