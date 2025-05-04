import {Component, computed, inject, input} from '@angular/core';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {toUserIdentityFullName} from '../../model/user.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {DataEntryService} from '../../service/data-entry.service';
import {of} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {DataTypeService} from '../../service/data-type.service';
import {
  DataEntryPageHeaderSectionComponent
} from '../../component/data-entry-page-header-section/data-entry-page-header-section.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';

@Component({
  selector: 'data-entry-preview-page',
  imports: [
    DataTypeEntryFieldDisplayComponent,
    DatePipe,
    TableModule,
    DataEntryPageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent
  ],
  templateUrl: './data-entry-preview-page.component.html',
  styles: ``
})
export class DataEntryPreviewPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  protected readonly toUserIdentityFullName = toUserIdentityFullName;
  protected readonly dataEntryId = input.required<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));

  protected readonly dataEntry = rxResource({
    request: () => ({
      dataEntryId: NumberUtil.parse(this.dataEntryId()),
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({request}) => request.dataEntryId && request.instanceId
      ? this.dataEntryService.getById(request.instanceId, request.dataEntryId)
      : of(undefined)
  });

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: this.dataEntry.value()?.dataTypeId,
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataTypeService.getById(request.instanceId, request.dataTypeId)
      : of(undefined)
  });
}
