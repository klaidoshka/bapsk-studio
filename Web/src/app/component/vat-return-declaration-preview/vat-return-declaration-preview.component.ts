import {Component, input, OnInit, signal, viewChild} from '@angular/core';
import {getSubmitDeclarationStateLabel, SubmitDeclarationState} from '../../model/vat-return.model';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  VatReturnDeclarationSubmissionComponent
} from '../vat-return-declaration-submission/vat-return-declaration-submission.component';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import {toUserIdentityFullName} from '../../model/user.model';
import {toCustomerFullName} from '../../model/customer.model';

@Component({
  selector: 'app-vat-return-declaration-preview',
  imports: [
    Button,
    Dialog,
    NgIf,
    TableModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    VatReturnDeclarationSubmissionComponent,
    CurrencyPipe
  ],
  templateUrl: './vat-return-declaration-preview.component.html',
  styles: ``
})
export class VatReturnDeclarationPreviewComponent implements OnInit {
  protected readonly SubmitDeclarationState = SubmitDeclarationState;
  protected readonly getSubmitDeclarationStateLabel = getSubmitDeclarationStateLabel;
  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toUserIdentityFullName = toUserIdentityFullName;

  instanceId = input.required<number>();
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);
  sale = signal<SaleWithVatReturnDeclaration | null>(null);
  submissionForm = viewChild(VatReturnDeclarationSubmissionComponent);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly getSoldGoodsTotalCount = (sale: SaleWithVatReturnDeclaration): number => {
    return sale.soldGoods
    .map(it => it.quantity)
    .reduce((a, b) => a + b);
  }

  readonly getVATToReturn = (sale: SaleWithVatReturnDeclaration): number => {
    return sale.soldGoods
    .map(it => it.vatAmount)
    .reduce((a, b) => a + b);
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.sale.set(null);
  }

  readonly show = (sale?: SaleWithVatReturnDeclaration | null) => {
    this.sale.set(sale || null);
    this.submissionForm()?.reset();
    this.isShown.set(true);
  }
}
