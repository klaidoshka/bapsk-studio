import {Component, input} from '@angular/core';
import {toPaymentTypeLabel, VatReturnDeclarationPaymentInfo} from '../../model/vat-return.model';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'vat-return-payment-table',
  imports: [
    TableModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './vat-return-payment-table.component.html',
  styles: ``
})
export class VatReturnPaymentTableComponent {
  protected readonly toPaymentTypeLabel = toPaymentTypeLabel;
  readonly payments = input.required<VatReturnDeclarationPaymentInfo[]>();
}
