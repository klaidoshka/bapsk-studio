import {Component, computed, inject, input, signal, viewChild} from '@angular/core';
import {VatReturnService} from '../../service/vat-return.service';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import {
  VatReturnDeclarationSubmissionComponent
} from '../../component/vat-return-declaration-submission/vat-return-declaration-submission.component';
import {toUserIdentityFullName} from '../../model/user.model';
import {toCustomerFullName} from '../../model/customer.model';
import {SubmitDeclarationState, toExportResultLabel, toSubmitDeclarationStateLabel} from '../../model/vat-return.model';
import {NumberUtil} from '../../util/number.util';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, NgClass, NgIf} from '@angular/common';
import {Badge} from 'primeng/badge';
import {TableModule} from 'primeng/table';
import {RoundPipe} from '../../pipe/round.pipe';
import {VatReturnPaymentTableComponent} from '../../component/vat-return-payment-table/vat-return-payment-table.component';
import {
  VatReturnDeclarationPaymentComponent
} from '../../component/vat-return-declaration-payment/vat-return-declaration-payment.component';
import {SaleService} from '../../service/sale.service';
import {SalePageHeaderSectionComponent} from "../../component/sale-page-header-section/sale-page-header-section.component";
import {CardComponent} from '../../component/card/card.component';
import {CardHeadlessComponent} from '../../component/card-headless/card-headless.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'sale-vat-return-declaration-page',
  imports: [
    Button,
    NgIf,
    ConfirmationComponent,
    Badge,
    DatePipe,
    CurrencyPipe,
    NgClass,
    TableModule,
    RoundPipe,
    VatReturnPaymentTableComponent,
    VatReturnDeclarationPaymentComponent,
    VatReturnDeclarationSubmissionComponent,
    SalePageHeaderSectionComponent,
    CardComponent,
    CardHeadlessComponent,
    FailedToLoadPleaseReloadComponent,
    ProgressSpinner,
    Tooltip
  ],
  templateUrl: './sale-vat-return-declaration-page.component.html',
  styles: ``
})
export class SaleVatReturnDeclarationPageComponent {
  private readonly saleService = inject(SaleService);
  private readonly vatReturnService = inject(VatReturnService);
  protected readonly SubmitDeclarationState = SubmitDeclarationState;
  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toExportResultLabel = toExportResultLabel;
  protected readonly toSubmitDeclarationStateLabel = toSubmitDeclarationStateLabel;
  protected readonly toUserIdentityFullName = toUserIdentityFullName;
  protected readonly cancelConfirmationComponent = viewChild(ConfirmationComponent);
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));
  protected readonly isCancelling = signal<boolean>(false);
  protected readonly isRefreshing = signal<boolean>(false);
  protected readonly saleId = input.required<string>();
  protected readonly showQrCodes = signal<boolean>(false);
  protected readonly submissionForm = viewChild(VatReturnDeclarationSubmissionComponent);

  readonly declaration = rxResource({
    request: () => ({
      instanceId: this.instanceIdAsNumber(),
      saleId: NumberUtil.parse(this.saleId())
    }),
    loader: ({request}) => request.instanceId && request.saleId
      ? this.vatReturnService.getWithDeclarerBySaleId(request.instanceId, request.saleId)
      : of(undefined)
  });

  readonly sale = rxResource({
    request: () => ({
      instanceId: this.instanceIdAsNumber(),
      saleId: NumberUtil.parse(this.saleId())
    }),
    loader: ({request}) => request.instanceId && request.saleId
      ? this.saleService.getById(request.instanceId, request.saleId)
      : of(undefined)
  });

  protected cancel() {
    this.cancelConfirmationComponent()?.request(() => {
      this.isCancelling.set(true);

      this.vatReturnService
        .cancel(this.instanceIdAsNumber()!, this.declaration.value()!.saleId)
        .pipe(first())
        .subscribe({
          next: () => this.isCancelling.set(false),
          error: () => this.isCancelling.set(false)
        });
    });
  }

  protected getVATToReturn(sale: SaleWithVatReturnDeclaration): number {
    return sale.soldGoods
      .map(it => it.vatAmount)
      .reduce((a, b) => a + b);
  }

  protected refresh() {
    this.isRefreshing.set(true);

    this.vatReturnService
      .update(this.instanceIdAsNumber()!, this.declaration.value()!.saleId)
      .pipe(first())
      .subscribe({
        next: () => this.isRefreshing.set(false),
        error: () => this.isRefreshing.set(false)
      });
  }
}
