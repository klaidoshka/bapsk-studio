import {Component, inject, input} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {TableModule} from "primeng/table";
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {CustomerService} from '../../service/customer.service';
import {InstanceService} from '../../service/instance.service';
import {of} from 'rxjs';

@Component({
  selector: 'customer-preview-page',
  imports: [
    DatePipe,
    NgIf,
    TableModule
  ],
  templateUrl: './customer-preview-page.component.html',
  styles: ``
})
export class CustomerPreviewPageComponent {
  private readonly customerService = inject(CustomerService);
  private readonly instanceService = inject(InstanceService);
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  protected readonly getCountryName = getIsoCountryLabel;
  protected readonly getIdentityDocumentTypeLabel = getIdentityDocumentTypeLabel;
  protected readonly customerId = input.required<string>();
  protected readonly instanceId = this.instanceService.getActiveInstanceId();

  protected readonly customer = rxResource({
    request: () => ({
      customerId: +this.customerId(),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.customerService.getById(request.instanceId, request.customerId)
      : of(undefined)
  });
}
