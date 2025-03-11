import {Component, input, signal, viewChild} from '@angular/core';
import Customer from '../../model/customer.model';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {CustomerManagementComponent} from '../customer-management/customer-management.component';
import {CustomerPreviewComponent} from '../customer-preview/customer-preview.component';
import {CustomerService} from '../../service/customer.service';
import {ErrorResolverService} from '../../service/error-resolver.service';

@Component({
  selector: 'app-customer-showcase',
  imports: [],
  templateUrl: './customer-showcase.component.html',
  styles: ``
})
export class CustomerShowcaseComponent {
  customers = input.required<Customer[]>();
  confirmationComponent = viewChild.required(ConfirmationComponent);
  managementMenu = viewChild.required(CustomerManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(CustomerPreviewComponent);

  constructor(
    private customerService: CustomerService,
    private errorResolverService: ErrorResolverService
  ) {
  }

  readonly delete = (customer: Customer) => {
    this.confirmationComponent().request(() => {
      this.customerService.delete(customer.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Customer deleted successfully']}),
        error: (response) => this.errorResolverService.resolveHttpResponseTo(response, this.messages)
      });
    });
  }

  readonly showManagement = (customer: Customer | null) => {
    this.managementMenu().show(customer);
  }

  readonly showPreview = (customer: Customer) => {
    this.previewMenu().show(customer);
  }
}
