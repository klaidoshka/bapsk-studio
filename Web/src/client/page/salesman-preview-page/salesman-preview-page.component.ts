import {Component, inject, input} from '@angular/core';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {SalesmanService} from '../../service/salesman.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {InstanceService} from '../../service/instance.service';
import {of} from 'rxjs';

@Component({
  selector: 'salesman-preview-page',
  imports: [],
  templateUrl: './salesman-preview-page.component.html',
  styles: ``
})
export class SalesmanPreviewPageComponent {
  private readonly instanceService = inject(InstanceService);
  private readonly salesmanService = inject(SalesmanService);
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly salesmanId = input.required<string>();

  protected readonly salesman = rxResource({
    request: () => ({
      instanceId: this.instanceId(),
      salesmanId: NumberUtil.parse(this.salesmanId())
    }),
    loader: ({request}) => request.instanceId && request.salesmanId
      ? this.salesmanService.getById(request.instanceId, request.salesmanId)
      : of(undefined)
  });
}
