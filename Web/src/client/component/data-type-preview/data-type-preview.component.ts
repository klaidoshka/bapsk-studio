import {Component, inject, signal} from '@angular/core';
import DataType from '../../model/data-type.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import DataTypeField, {FieldType, toFieldTypeLabel} from '../../model/data-type-field.model';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import {NgClass, NgIf} from '@angular/common';
import {
  DataTypeEntryFieldDisplayComponent
} from '../data-type-entry-field-display/data-type-entry-field-display.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';

@Component({
  selector: 'data-type-preview',
  imports: [
    Button,
    Dialog,
    TableModule,
    NgClass,
    DataTypeEntryFieldDisplayComponent,
    NgIf
  ],
  templateUrl: './data-type-preview.component.html',
  styles: ``
})
export class DataTypePreviewComponent {
  protected readonly FieldType = FieldType;
  private readonly dataTypeService = inject(DataTypeService);
  private readonly instanceService = inject(InstanceService);

  dataType = signal<DataType | undefined>(undefined);

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  instanceId = this.instanceService.getActiveInstanceId();
  isShown = signal<boolean>(false);

  protected readonly toFieldTypeLabel = toFieldTypeLabel;

  getDisplayFieldName() {
    return this.dataType()
      ?.fields
      ?.find(it => it.id === this.dataType()?.displayFieldId)?.name || 'Id';
  }

  getReferencedDataTypeName(field: DataTypeField) {
    return this.dataTypes.value()!.find(it => it.id === field.referenceId)!.name;
  }

  hide() {
    this.isShown.set(false);
    this.dataType.set(undefined);
  }

  show(dataType: DataType) {
    this.dataType.set(dataType);
    this.isShown.set(true);
  }
}
