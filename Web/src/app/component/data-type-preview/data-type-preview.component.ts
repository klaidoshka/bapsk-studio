import {Component, input, OnInit, signal} from '@angular/core';
import DataType from '../../model/data-type.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {FieldType, fieldTypes} from '../../model/data-type-field.model';

@Component({
  selector: 'app-data-type-preview',
  imports: [
    Button,
    Dialog,
    TableModule
  ],
  templateUrl: './data-type-preview.component.html',
  styles: ``
})
export class DataTypePreviewComponent implements OnInit {
  dataType = signal<DataType | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  readonly ngOnInit = () => {
    this.isShown.set(this.isShownInitially());
  }

  readonly getFieldTypeLabel = (type: FieldType) => {
    const enumKey = Object
    .keys(FieldType)
    .find(t => t.toString().toLowerCase() === type.toString().toLowerCase());

    const enumValue = FieldType[enumKey as keyof typeof FieldType];

    return fieldTypes.find(t => t.value === enumValue)?.label;
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.dataType.set(null);
  }

  readonly show = (dataType: DataType | null) => {
    this.dataType.set(dataType);
    this.isShown.set(true);
  }
}
