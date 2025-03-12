import {Component, input, OnInit, signal} from '@angular/core';
import DataEntry from '../../model/data-entry.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-data-entry-preview',
  imports: [
    Button,
    Dialog,
    TableModule,
    DatePipe
  ],
  templateUrl: './data-entry-preview.component.html',
  styles: ``
})
export class DataEntryPreviewComponent implements OnInit {
  dataEntry = signal<DataEntry | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.dataEntry.set(null);
  }

  readonly show = (dataEntry: DataEntry | null) => {
    this.dataEntry.set(dataEntry);
    this.isShown.set(true);
  }
}
