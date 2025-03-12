import {Component, input, signal, viewChild} from '@angular/core';
import Sale from '../../model/sale.model';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {SaleManagementComponent} from '../sale-management/sale-management.component';
import Messages from '../../model/messages.model';
import {SalePreviewComponent} from '../sale-preview/sale-preview.component';
import {SaleService} from '../../service/sale.service';
import {LocalizationService} from '../../service/localization.service';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import Customer from '../../model/customer.model';
import Salesman from '../../model/salesman.model';

@Component({
  selector: 'app-sale-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent,
    TableModule,
    SaleManagementComponent,
    SalePreviewComponent
  ],
  templateUrl: './sale-showcase.component.html',
  styles: ``
})
export class SaleShowcaseComponent {
  confirmationComponent = viewChild.required(ConfirmationComponent);
  customers = input.required<Customer[]>();
  instanceId = input.required<number>();
  managementMenu = viewChild.required(SaleManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(SalePreviewComponent);
  sales = input.required<Sale[]>();
  salesmen = input.required<Salesman[]>();

  constructor(
    private saleService: SaleService,
    private localizationService: LocalizationService
  ) {
  }

  readonly delete = (sale: Sale) => {
    this.confirmationComponent().request(() => {
      this.saleService.delete(this.instanceId(), sale.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Sale deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  readonly showManagement = (sale: Sale | null) => {
    this.managementMenu().show(sale);
  }

  readonly showPreview = (sale: Sale) => {
    this.previewMenu().show(sale);
  }
}
