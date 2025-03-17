import {Component, effect, input, OnInit, Signal, signal, viewChild} from '@angular/core';
import {
  getSubmitDeclarationStateLabel,
  SubmitDeclarationState,
  VatReturnDeclarationWithDeclarer
} from '../../model/vat-return.model';
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
import {VatReturnService} from '../../service/vat-return.service';

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

  declaration!: Signal<VatReturnDeclarationWithDeclarer | undefined>;
  instanceId = input.required<number>();
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);
  sale = signal<SaleWithVatReturnDeclaration | undefined>(undefined);
  submissionForm = viewChild(VatReturnDeclarationSubmissionComponent);

  constructor(private vatReturnService: VatReturnService) {
    effect(() => {
      const saleId = this.sale()?.id;

      if (saleId === undefined) {
        return;
      }

      this.declaration = this.vatReturnService.getBySaleIdAsSignal(this.instanceId(), saleId);
    });
  }

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
    this.sale.set(undefined);
  }

  readonly show = (sale: SaleWithVatReturnDeclaration) => {
    this.sale.set(sale);
    this.submissionForm()?.reset();
    this.isShown.set(true);
  }
}
