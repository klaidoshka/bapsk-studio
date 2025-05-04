import {Component, inject, input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {TableModule} from "primeng/table";
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {CustomerService} from '../../service/customer.service';
import {of} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {
  CustomerPageHeaderSectionComponent
} from '../../component/customer-page-header-section/customer-page-header-section.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';

@Component({
  selector: 'customer-preview-page',
  imports: [
    DatePipe,
    TableModule,
    CustomerPageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent
  ],
  templateUrl: './customer-preview-page.component.html',
  styles: ``
})
export class CustomerPreviewPageComponent {
  private readonly customerService = inject(CustomerService);
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  protected readonly getCountryName = getIsoCountryLabel;
  protected readonly getIdentityDocumentTypeLabel = getIdentityDocumentTypeLabel;
  protected readonly customerId = input.required<string>();
  protected readonly instanceId = input.required<string>();

  protected readonly customer = rxResource({
    request: () => ({
      customerId: NumberUtil.parse(this.customerId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.customerId && request.instanceId
      ? this.customerService.getById(request.instanceId, request.customerId)
      : of(undefined)
  });
}
