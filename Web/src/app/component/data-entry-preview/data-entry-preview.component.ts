import {Component, input, OnInit, signal} from '@angular/core';
import {DataEntryWithUsers} from '../../model/data-entry.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {DatePipe, NgIf} from '@angular/common';
import {toUserIdentityFullName} from '../../model/user.model';

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

  dataEntry = signal<DataEntryWithUsers | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.dataEntry.set(null);
  }

  readonly show = (dataEntry: DataEntryWithUsers | null) => {
    this.dataEntry.set(dataEntry);
    this.isShown.set(true);
  }
}
