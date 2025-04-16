import {Component, computed, Signal, signal} from '@angular/core';
import DataType from '../../model/data-type.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import DataTypeField, {FieldType, toFieldTypeLabel} from '../../model/data-type-field.model';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import {NgClass, NgIf} from '@angular/common';
import {DataTypeEntryFieldDisplayComponent} from '../data-type-entry-field-display/data-type-entry-field-display.component';

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

  dataType = signal<DataType | undefined>(undefined);
  dataTypes!: Signal<DataType[]>;
  isShown = signal<boolean>(false);

  constructor(
    dataTypeService: DataTypeService,
    instanceService: InstanceService
  ) {
    this.dataTypes = computed(() => {
      const instanceId = instanceService.getActiveInstanceId()();
      return instanceId ? dataTypeService.getAsSignal(instanceId)()! : [];
    });
  }

  protected readonly toFieldTypeLabel = toFieldTypeLabel;

  readonly getDisplayFieldName = () => this.dataType()?.fields?.find(it => it.id === this.dataType()?.displayFieldId)?.name || 'Id';

  readonly getReferencedDataTypeName = (field: DataTypeField) => {
    return this.dataTypes().find(it => it.id === field.referenceId)!.name;
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.dataType.set(undefined);
  }

  readonly show = (dataType: DataType) => {
    this.dataType.set(dataType);
    this.isShown.set(true);
  }
}
