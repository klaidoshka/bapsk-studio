import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  SubmitDeclarationState,
  toExportResultLabel,
  toSubmitDeclarationStateLabel,
  VatReturnDeclarationWithSale
} from '../../model/vat-return.model';
import {VatReturnService} from '../../service/vat-return.service';
import {TableModule} from 'primeng/table';
import {first} from 'rxjs';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {toCustomerFullName} from '../../model/customer.model';
import {RoundPipe} from '../../pipe/round.pipe';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import {Button} from 'primeng/button';
import {
  DeclarationPreviewPageSkeletonComponent
} from './declaration-preview-page-skeleton/declaration-preview-page-skeleton.component';
import {Badge} from 'primeng/badge';
import {VatReturnPaymentTableComponent} from '../../component/vat-return-payment-table/vat-return-payment-table.component';

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

  declarationPreviewCode = signal<string | undefined>(undefined);
  declaration = signal<VatReturnDeclarationWithSale | undefined>(undefined);
  showQrCodes = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  isRefreshing = signal<boolean>(false);

  constructor() {
    this.route.queryParams.subscribe(params => {
      const previewCode = params['code'];

      if (!previewCode) {
        return;
      }

      this.declarationPreviewCode.set(previewCode);

      this.loadDeclaration(previewCode, () => this.isLoading.set(false));
    });
  }

  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly toExportResultLabel = toExportResultLabel;
  protected readonly toSubmitDeclarationStateLabel = toSubmitDeclarationStateLabel;

  loadDeclaration(code: string, callback?: () => void) {
    this.vatReturnService.getWithSaleByPreviewCode(code).pipe(first()).subscribe({
      next: declaration => {
        if (declaration) {
          this.declaration.set(declaration);
        } else if (this.declaration()) {
          this.declaration.set(undefined);
        }
        callback?.()
      },
      error: () => callback?.()
    });
  }

  getVATToReturn(sale: SaleWithVatReturnDeclaration): number {
    return sale.soldGoods
      .map(it => it.vatAmount)
      .reduce((a, b) => a + b);
  }

  refresh() {
    const code = this.declarationPreviewCode();

    if (!code) {
      return;
    }

    this.isRefreshing.set(true);

    this.vatReturnService.updateByPreviewCode(code).pipe(first()).subscribe(() =>
      this.loadDeclaration(code, () => this.isRefreshing.set(false))
    );
  }
}
