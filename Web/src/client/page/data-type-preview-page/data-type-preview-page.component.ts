import {Component, inject, input} from '@angular/core';
import {Badge} from 'primeng/badge';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {TableModule} from 'primeng/table';
import DataTypeField, {FieldType, toFieldTypeLabel} from '../../model/data-type-field.model';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {NgClass} from '@angular/common';

@Component({
  selector: 'data-type-preview-page',
  imports: [
    Badge,
    DataTypeEntryFieldDisplayComponent,
    TableModule,
    NgClass
  ],
  templateUrl: './data-type-preview-page.component.html',
  styles: ``
})
export class DataTypePreviewPageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly instanceService = inject(InstanceService);
  protected readonly FieldType = FieldType;
  protected readonly toFieldTypeLabel = toFieldTypeLabel;
  protected readonly dataTypeId = input<string>();
  protected readonly instanceId = this.instanceService.getActiveInstanceId();

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataTypeService.getById(request.instanceId, request.dataTypeId)
      : of(undefined)
  });

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  getDisplayFieldName() {
    const displayFieldId = this.dataType.value()?.displayFieldId;

    return this.dataType.value()?.fields?.find(it => it.id === displayFieldId)?.name || 'Id';
  }

  getReferencedDataTypeName(field: DataTypeField) {
    return this.dataTypes.value()!.find(it => it.id === field.referenceId)!.name;
  }
}
