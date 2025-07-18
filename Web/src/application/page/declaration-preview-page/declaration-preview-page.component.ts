import {Component, computed, inject, input, signal} from '@angular/core';
import {SubmitDeclarationState, toExportResultLabel, toSubmitDeclarationStateInfo} from '../../model/vat-return.model';
import {VatReturnService} from '../../service/vat-return.service';
import {TableModule} from 'primeng/table';
import {first, of} from 'rxjs';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {toCustomerFullName} from '../../model/customer.model';
import {RoundPipe} from '../../pipe/round.pipe';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import {Button} from 'primeng/button';
import {Badge} from 'primeng/badge';
import {VatReturnPaymentTableComponent} from '../../component/vat-return-payment-table/vat-return-payment-table.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {TranslatePipe} from '@ngx-translate/core';
import {toMeasurementLabel} from '../../model/standard-measurement.model';

@Component({
  selector: 'declaration-preview-page',
  imports: [
    TableModule,
    NgIf,
    DatePipe,
    CurrencyPipe,
    RoundPipe,
    NgForOf,
    NgClass,
    Button,
    Badge,
    VatReturnPaymentTableComponent,
    LoadingSpinnerComponent,
    TranslatePipe
  ],
  templateUrl: './declaration-preview-page.component.html',
  styles: ``
})
export class DeclarationPreviewPageComponent {
  protected readonly SubmitDeclarationState = SubmitDeclarationState;
  private readonly vatReturnService = inject(VatReturnService);
  private readonly isRefreshing = signal<boolean>(false);
  protected readonly code = input<string>();
  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toExportResultLabel = toExportResultLabel;
  protected readonly toMeasurementLabel = toMeasurementLabel;
  protected readonly toSubmitDeclarationStateInfo = toSubmitDeclarationStateInfo;
  protected readonly isLoading = computed(() => this.declaration.isLoading() || this.isRefreshing());
  protected readonly showQrCodes = signal<boolean>(false);

  protected readonly declaration = rxResource({
    request: () => ({
      code: this.code()
    }),
    loader: ({request}) => request.code
      ? this.vatReturnService.getWithSaleByPreviewCode(request.code)
      : of(undefined)
  })

  protected getVATToReturn(sale: SaleWithVatReturnDeclaration): number {
    return sale.soldGoods
      .map(it => it.vatAmount)
      .reduce((a, b) => a + b);
  }

  protected refresh() {
    const code = this.code();

    if (!code) {
      return;
    }

    this.isRefreshing.set(true);

    this.vatReturnService
      .updateByPreviewCode(code)
      .pipe(first())
      .subscribe(() => {
        this.declaration.reload();
        this.isRefreshing.set(false);
      });
  }
}
