import {Component, inject, input} from '@angular/core';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {RoundPipe} from '../../pipe/round.pipe';
import {TableModule} from 'primeng/table';
import {SaleService} from '../../service/sale.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {InstanceService} from '../../service/instance.service';
import {NumberUtil} from '../../util/number.util';
import {of} from 'rxjs';

@Component({
  selector: 'sale-preview-page',
  imports: [
    CurrencyPipe,
    DatePipe,
    RoundPipe,
    TableModule
  ],
  templateUrl: './sale-preview-page.component.html',
  styles: ``
})
export class SalePreviewPageComponent {
  private readonly instanceService = inject(InstanceService);
  private readonly saleService = inject(SaleService);
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly saleId = input.required<string>();

  protected readonly sale = rxResource({
    request: () => ({
      instanceId: this.instanceId(),
      saleId: NumberUtil.parse(this.saleId())
    }),
    loader: ({request}) => request.instanceId && request.saleId
      ? this.saleService.getWithVatDeclarationById(request.instanceId, request.saleId)
      : of(undefined)
  });
}
