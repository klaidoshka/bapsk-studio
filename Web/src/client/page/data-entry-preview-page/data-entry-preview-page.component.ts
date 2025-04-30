import {Component, inject, input} from '@angular/core';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {DatePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {toUserIdentityFullName} from '../../model/user.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {DataEntryService} from '../../service/data-entry.service';
import {InstanceService} from '../../service/instance.service';
import {of} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {DataTypeService} from '../../service/data-type.service';

@Component({
  selector: 'data-entry-preview-page',
  imports: [
    DataTypeEntryFieldDisplayComponent,
    DatePipe,
    TableModule
  ],
  templateUrl: './data-entry-preview-page.component.html',
  styles: ``
})
export class DataEntryPreviewPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly instanceService = inject(InstanceService);
  protected readonly toUserIdentityFullName = toUserIdentityFullName;
  protected readonly dataEntryId = input.required<string>();
  protected readonly instanceId = this.instanceService.getActiveInstanceId();

  protected readonly dataEntry = rxResource({
    request: () => ({
      dataEntryId: NumberUtil.parse(this.dataEntryId()),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataEntryId && request.instanceId
      ? this.dataEntryService.getById(request.instanceId, request.dataEntryId)
      : of(undefined)
  });

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: this.dataEntry.value()?.dataTypeId,
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataTypeService.getById(request.instanceId, request.dataTypeId)
      : of(undefined)
  });
}
