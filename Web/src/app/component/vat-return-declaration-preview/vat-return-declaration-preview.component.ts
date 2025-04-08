import {Component, effect, input, Signal, signal, viewChild} from '@angular/core';
import {
  getSubmitDeclarationStateLabel,
  SubmitDeclarationState,
  VatReturnDeclarationWithDeclarer
} from '../../model/vat-return.model';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
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
import {RoundPipe} from '../../pipe/round.pipe';
import {Badge} from 'primeng/badge';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'app-vat-return-declaration-preview',
  imports: [
    Dialog,
    NgIf,
    TableModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    VatReturnDeclarationSubmissionComponent,
    CurrencyPipe,
    NgForOf,
    RoundPipe,
    Badge,
    Button,
    NgClass,
    ConfirmationComponent
  ],
  templateUrl: './vat-return-declaration-preview.component.html',
  styles: ``
})
export class VatReturnDeclarationPreviewComponent {
  protected readonly SubmitDeclarationState = SubmitDeclarationState;

  cancelConfirmationComponent = viewChild(ConfirmationComponent);
  declaration!: Signal<VatReturnDeclarationWithDeclarer | undefined>;
  instanceId = input.required<number>();
  isCanceling = signal<boolean>(false);
  isRefreshing = signal<boolean>(false);
  isShown = signal<boolean>(false);
  sale = signal<SaleWithVatReturnDeclaration | undefined>(undefined);
  showQrCodes = signal<boolean>(false);
  submissionForm = viewChild(VatReturnDeclarationSubmissionComponent);

  constructor(private vatReturnService: VatReturnService) {
    effect(() => {
      const saleId = this.sale()?.id;

      if (saleId === undefined) {
        return;
      }

      this.declaration = this.vatReturnService.getWithDeclarerBySaleIdAsSignal(this.instanceId(), saleId);
    });
  }

  protected readonly getSubmitDeclarationStateLabel = getSubmitDeclarationStateLabel;
  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toUserIdentityFullName = toUserIdentityFullName;

  readonly cancel = () => {
    this.cancelConfirmationComponent()?.request(() => {
      this.isCanceling.set(true);

      this.vatReturnService.cancel(this.declaration()!.saleId).subscribe({
        complete: () => this.isCanceling.set(false)
      });
    });
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

  readonly refresh = () => {
    this.isRefreshing.set(true);

    this.vatReturnService.update(this.declaration()!.saleId).subscribe({
      complete: () => this.isRefreshing.set(false)
    });
  }

  readonly show = (sale: SaleWithVatReturnDeclaration) => {
    this.sale.set(sale);
    this.submissionForm()?.reset();
    this.isShown.set(true);
  }
}
