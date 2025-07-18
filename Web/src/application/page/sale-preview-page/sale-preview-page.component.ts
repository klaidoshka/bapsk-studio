import {Component, inject, input} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {RoundPipe} from '../../pipe/round.pipe';
import {TableModule} from 'primeng/table';
import {SaleService} from '../../service/sale.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {of} from 'rxjs';
import {SalePageHeaderSectionComponent} from '../../component/sale-page-header-section/sale-page-header-section.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'sale-preview-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    RoundPipe,
    TableModule,
    SalePageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './sale-preview-page.component.html',
  styles: ``
})
export class SalePreviewPageComponent {
  private readonly saleService = inject(SaleService);
  protected readonly instanceId = input.required<string>();
  protected readonly saleId = input.required<string>();

  protected readonly sale = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      saleId: NumberUtil.parse(this.saleId())
    }),
    loader: ({request}) => request.instanceId && request.saleId
      ? this.saleService.getWithVatDeclarationById(request.instanceId, request.saleId)
      : of(undefined)
  });
}
