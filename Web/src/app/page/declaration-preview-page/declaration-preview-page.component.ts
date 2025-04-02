import {Component, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {getSubmitDeclarationStateLabel, VatReturnDeclarationWithSale} from '../../model/vat-return.model';
import {VatReturnService} from '../../service/vat-return.service';
import {TableModule} from 'primeng/table';
import {first} from 'rxjs';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {toCustomerFullName} from '../../model/customer.model';
import {RoundPipe} from '../../pipe/round.pipe';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-declaration-preview-page',
  imports: [
    TableModule,
    NgIf,
    DatePipe,
    CurrencyPipe,
    RoundPipe,
    NgForOf,
    NgClass,
    Button
  ],
  templateUrl: './declaration-preview-page.component.html',
  styles: ``
})
export class DeclarationPreviewPageComponent {
  declaration = signal<VatReturnDeclarationWithSale | undefined>(undefined);
  declarationPreviewCode = signal<string | undefined>(undefined);
  showQrCodes = signal<boolean>(false);

  constructor(
    route: ActivatedRoute,
    private vatReturnService: VatReturnService
  ) {
    route.queryParams.subscribe(params => {
      const previewCode = params['code'];

      if (!previewCode) {
        return;
      }

      this.declarationPreviewCode.set(previewCode);
      this.loadDeclaration(previewCode);
    });
  }

  protected readonly getSubmitDeclarationStateLabel = getSubmitDeclarationStateLabel;
  protected readonly toCustomerFullName = toCustomerFullName;

  readonly loadDeclaration = (code: string) => {
    this.vatReturnService.getWithSaleByPreviewCode(code).pipe(first()).subscribe(declaration => {
      if (declaration) {
        this.declaration.set(declaration);
      } else if (this.declaration()) {
        this.declaration.set(undefined);
      }
    });
  }

  readonly getVATToReturn = (sale: SaleWithVatReturnDeclaration): number => {
    return sale.soldGoods
    .map(it => it.vatAmount)
    .reduce((a, b) => a + b);
  }

  readonly refresh = () => {
    const code = this.declarationPreviewCode();

    if (!code) {
      return;
    }

    this.loadDeclaration(code);
  }
}
