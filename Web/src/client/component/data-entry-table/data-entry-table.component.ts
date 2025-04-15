import {Component, computed, input} from '@angular/core';
import {DataEntryJoined} from '../../model/data-entry.model';
import DataType from '../../model/data-type.model';
import {TableModule} from 'primeng/table';
import {DataTypeEntryFieldDisplayComponent} from '../data-type-entry-field-display/data-type-entry-field-display.component';
import {toUserIdentityFullName} from '../../model/user.model';
import {Button} from 'primeng/button';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'data-entry-table',
  imports: [
    TableModule,
    DataTypeEntryFieldDisplayComponent,
    Button,
    DatePipe,
    NgIf
  ],
  templateUrl: './data-entry-table.component.html',
  styles: ``
})
export class DataEntryTableComponent {
  containsActions = computed(() => !!this.delete() || !!this.manage() || !!this.preview());
  dataEntries = input.required<DataEntryJoined[]>();
  dataType = input.required<DataType>();
  delete = input<(entry: DataEntryJoined) => void>();
  manage = input<(entry: DataEntryJoined) => void>();
  preview = input<(entry: DataEntryJoined) => void>();

  protected readonly toUserIdentityFullName = toUserIdentityFullName;
}
