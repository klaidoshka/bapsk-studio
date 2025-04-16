import {Component, inject, input, signal, viewChild} from '@angular/core';
import Sale, {SaleWithVatReturnDeclaration, SoldGood} from '../../model/sale.model';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {SaleManagementComponent} from '../sale-management/sale-management.component';
import Messages from '../../model/messages.model';
import {SalePreviewComponent} from '../sale-preview/sale-preview.component';
import {SaleService} from '../../service/sale.service';
import {LocalizationService} from '../../service/localization.service';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import Customer, {toCustomerFullName} from '../../model/customer.model';
import Salesman from '../../model/salesman.model';
import {
  VatReturnDeclarationPreviewComponent
} from '../vat-return-declaration-preview/vat-return-declaration-preview.component';

@Component({
  selector: 'sale-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent,
    TableModule,
    SaleManagementComponent,
    SalePreviewComponent,
    VatReturnDeclarationPreviewComponent,
    CurrencyPipe
  ],
  templateUrl: './sale-showcase.component.html',
  styles: ``
})
export class SaleShowcaseComponent {
  private readonly localizationService = inject(LocalizationService);
  private readonly saleService = inject(SaleService);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  customers = input.required<Customer[]>();
  instanceId = input.required<number>();
  managementMenu = viewChild.required(SaleManagementComponent);
  messages = signal<Messages>({});
  previewDeclarationMenu = viewChild.required(VatReturnDeclarationPreviewComponent);
  previewSaleMenu = viewChild.required(SalePreviewComponent);
  sales = input.required<SaleWithVatReturnDeclaration[]>();
  salesmen = input.required<Salesman[]>();

  protected readonly toCustomerFullName = toCustomerFullName;

  delete(sale: Sale) {
    this.confirmationComponent().request(() => {
      this.saleService.delete(this.instanceId(), sale.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Sale deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  getTotalPrice(soldGoods: SoldGood[]): number {
    return soldGoods.reduce((total, soldGood) => total + soldGood.totalAmount, 0);
  }

  showManagement(sale: Sale | null) {
    this.managementMenu().show(sale);
  }

  showSale(sale: Sale) {
    this.previewSaleMenu().show(sale);
  }

  showVatReturnDeclaration(sale: SaleWithVatReturnDeclaration) {
    this.previewDeclarationMenu().show(sale);
  }
}
