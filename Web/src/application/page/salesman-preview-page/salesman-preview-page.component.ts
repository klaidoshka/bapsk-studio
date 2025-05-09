import {Component, inject, input} from '@angular/core';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {SalesmanService} from '../../service/salesman.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {of} from 'rxjs';
import {
  SalesmanPageHeaderSectionComponent
} from "../../component/salesman-page-header-section/salesman-page-header-section.component";
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';

@Component({
  selector: 'salesman-preview-page',
  imports: [
    SalesmanPageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent
  ],
  templateUrl: './salesman-preview-page.component.html',
  styles: ``
})
export class SalesmanPreviewPageComponent {
  private readonly salesmanService = inject(SalesmanService);
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  protected readonly instanceId = input.required<string>();
  protected readonly salesmanId = input.required<string>();

  protected readonly salesman = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      salesmanId: NumberUtil.parse(this.salesmanId())
    }),
    loader: ({request}) => request.instanceId && request.salesmanId
      ? this.salesmanService.getById(request.instanceId, request.salesmanId)
      : of(undefined)
  });
}
