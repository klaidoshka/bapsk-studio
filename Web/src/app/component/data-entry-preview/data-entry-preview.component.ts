import {Component, input, OnInit, signal} from '@angular/core';
import {DataEntryJoined} from '../../model/data-entry.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {DatePipe, NgIf} from '@angular/common';
import {toUserIdentityFullName} from '../../model/user.model';
import DataType from '../../model/data-type.model';
import DataTypeEntryPair from './data-type-entry.pair';

@Component({
  selector: 'app-data-entry-preview',
  imports: [
    Button,
    Dialog,
    TableModule,
    DatePipe,
    NgIf
  ],
  templateUrl: './data-entry-preview.component.html',
  styles: ``
})
export class DataEntryPreviewComponent implements OnInit {
  protected readonly toUserIdentityFullName = toUserIdentityFullName;

  dataTypeEntry = signal<DataTypeEntryPair | undefined>(undefined);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.dataTypeEntry.set(undefined);
  }

  readonly show = (dataType: DataType, dataEntry: DataEntryJoined) => {
    this.dataTypeEntry.set({
      dataType: dataType,
      dataEntry: dataEntry
    });
    this.isShown.set(true);
  }
}
