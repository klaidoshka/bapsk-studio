import {Component, input, OnInit, signal} from '@angular/core';
import DataType from '../../model/data-type.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-data-type-preview',
  imports: [
    Button,
    Dialog,
    TableModule,
    UpperCasePipe
  ],
  templateUrl: './data-type-preview.component.html',
  styles: ``
})
export class DataTypePreviewComponent implements OnInit {
  dataType = signal<DataType | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  hide() {
    this.isShown.set(false);
    this.dataType.set(null);
  }

  show(dataType: DataType | null) {
    this.dataType.set(dataType);
    this.isShown.set(true);
  }
}
