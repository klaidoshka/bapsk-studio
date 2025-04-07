import {Component, signal} from '@angular/core';
import DataType from '../../model/data-type.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {toFieldTypeLabel} from '../../model/data-type-field.model';

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
export class DataTypePreviewComponent {
  dataType = signal<DataType | null>(null);
  isShown = signal<boolean>(false);

  protected readonly toFieldTypeLabel = toFieldTypeLabel;

  readonly hide = () => {
    this.isShown.set(false);
    this.dataType.set(null);
  }

  readonly show = (dataType: DataType | null) => {
    this.dataType.set(dataType);
    this.isShown.set(true);
  }
}
