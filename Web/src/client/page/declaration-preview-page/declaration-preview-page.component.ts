import {Component, computed, inject, input, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  SubmitDeclarationState,
  toExportResultLabel,
  toSubmitDeclarationStateLabel
} from '../../model/vat-return.model';
import {VatReturnService} from '../../service/vat-return.service';
import {TableModule} from 'primeng/table';
import {first, of} from 'rxjs';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {toCustomerFullName} from '../../model/customer.model';
import {RoundPipe} from '../../pipe/round.pipe';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import {Button} from 'primeng/button';
import {
  DeclarationPreviewPageSkeletonComponent
} from './declaration-preview-page-skeleton/declaration-preview-page-skeleton.component';
import {Badge} from 'primeng/badge';
import {
  VatReturnPaymentTableComponent
} from '../../component/vat-return-payment-table/vat-return-payment-table.component';
import {rxResource} from '@angular/core/rxjs-interop';

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
    DeclarationPreviewPageSkeletonComponent,
    Badge,
    VatReturnPaymentTableComponent
  ],
  templateUrl: './declaration-preview-page.component.html',
  styles: ``
})
export class DeclarationPreviewPageComponent {
  protected readonly SubmitDeclarationState = SubmitDeclarationState;
  private readonly route = inject(ActivatedRoute);
  private readonly vatReturnService = inject(VatReturnService);
  private readonly isRefreshing = signal<boolean>(false);
  protected readonly declarationPreviewCode = input<string>();
  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toExportResultLabel = toExportResultLabel;
  protected readonly toSubmitDeclarationStateLabel = toSubmitDeclarationStateLabel;
  protected readonly isLoading = computed(() => this.declaration.isLoading() || this.isRefreshing());
  protected readonly showQrCodes = signal<boolean>(false);

  protected readonly declaration = rxResource({
    request: () => ({
      code: this.declarationPreviewCode()
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
    const code = this.declarationPreviewCode();

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
