import {Component, inject, input, signal, viewChild} from '@angular/core';
import Customer from '../../model/customer.model';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {CustomerManagementComponent} from '../customer-management/customer-management.component';
import {CustomerPreviewComponent} from '../customer-preview/customer-preview.component';
import {CustomerService} from '../../service/customer.service';
import {LocalizationService} from '../../service/localization.service';
import {Button} from 'primeng/button';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {getIsoCountryLabel} from '../../model/iso-country.model';

@Component({
  selector: 'customer-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    CustomerManagementComponent,
    CustomerPreviewComponent,
    DatePipe
  ],
  templateUrl: './customer-showcase.component.html',
  styles: ``
})
export class CustomerShowcaseComponent {
  protected readonly getIdentityDocumentTypeLabel = getIdentityDocumentTypeLabel;
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  private readonly customerService = inject(CustomerService);
  private readonly localizationService = inject(LocalizationService);

  customers = input.required<Customer[]>();
  confirmationComponent = viewChild.required(ConfirmationComponent);
  instanceId = input.required<number>();
  managementMenu = viewChild.required(CustomerManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(CustomerPreviewComponent);

  delete(customer: Customer) {
    this.confirmationComponent().request(() => {
      this.customerService.delete(this.instanceId(), customer.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Customer deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  showManagement(customer: Customer | null) {
    this.managementMenu().show(customer);
  }

  showPreview(customer: Customer) {
    this.previewMenu().show(customer);
  }
}
