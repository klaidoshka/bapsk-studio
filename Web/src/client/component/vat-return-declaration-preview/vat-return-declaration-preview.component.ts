import {Component, inject, input, signal, viewChild} from '@angular/core';
import {SubmitDeclarationState, toExportResultLabel, toSubmitDeclarationStateLabel} from '../../model/vat-return.model';
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
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';

@Component({
  selector: 'vat-return-declaration-preview',
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
  private readonly vatReturnService = inject(VatReturnService);

  cancelConfirmationComponent = viewChild(ConfirmationComponent);

  declaration = rxResource({
    request: () => ({
      saleId: this.sale()?.id
    }),
    loader: ({ request }) => request.saleId
      ? this.vatReturnService.getWithDeclarerBySaleId(request.saleId)
      : of(undefined)
  })

  instanceId = input.required<number>();
  isCanceling = signal<boolean>(false);
  isRefreshing = signal<boolean>(false);
  isShown = signal<boolean>(false);
  sale = signal<SaleWithVatReturnDeclaration | undefined>(undefined);
  showQrCodes = signal<boolean>(false);
  submissionForm = viewChild(VatReturnDeclarationSubmissionComponent);

  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toExportResultLabel = toExportResultLabel;
  protected readonly toSubmitDeclarationStateLabel = toSubmitDeclarationStateLabel;
  protected readonly toUserIdentityFullName = toUserIdentityFullName;

  cancel() {
    this.cancelConfirmationComponent()?.request(() => {
      this.isCanceling.set(true);

      this.vatReturnService.cancel(this.declaration.value()!.saleId).pipe(first()).subscribe({
        next: () => this.isCanceling.set(false),
        error: () => this.isCanceling.set(false)
      });
    });
  }

  getVATToReturn(sale: SaleWithVatReturnDeclaration): number {
    return sale.soldGoods
      .map(it => it.vatAmount)
      .reduce((a, b) => a + b);
  }

  hide() {
    this.isShown.set(false);
    this.sale.set(undefined);
  }

  refresh() {
    this.isRefreshing.set(true);

    this.vatReturnService.update(this.declaration.value()!.saleId).pipe(first()).subscribe({
      next: () => this.isRefreshing.set(false),
      error: () => this.isRefreshing.set(false)
    });
  }

  show(sale: SaleWithVatReturnDeclaration) {
    this.sale.set(sale);
    this.submissionForm()?.reset();
    this.isShown.set(true);
  }
}
