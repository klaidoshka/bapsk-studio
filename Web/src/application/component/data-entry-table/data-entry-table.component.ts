import {Component, computed, input} from '@angular/core';
import {DataEntryJoined} from '../../model/data-entry.model';
import DataType from '../../model/data-type.model';
import {TableModule} from 'primeng/table';
import {DataTypeEntryFieldDisplayComponent} from '../data-type-entry-field-display/data-type-entry-field-display.component';
import {toUserIdentityFullName} from '../../model/user.model';
import {Button} from 'primeng/button';
import {DatePipe, NgIf} from '@angular/common';
import {SortEvent} from 'primeng/api';
import {FieldType} from '../../model/data-type-field.model';

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
  private readonly defaultSortFields = ['createdAt', 'modifiedAt', 'modifiedByFullName'];
  protected readonly toUserIdentityFullName = toUserIdentityFullName;
  protected readonly containsActions = computed(() => !!this.delete() || !!this.manage() || !!this.preview());
  readonly dataEntries = input.required<DataEntryJoined[]>();
  readonly dataEntriesModified = computed(() => this.dataEntries().map(entry => ({
    ...entry,
    modifiedByFullName: toUserIdentityFullName(entry.modifiedBy)
  })));
  readonly dataType = input.required<DataType>();
  readonly delete = input<(entry: DataEntryJoined) => void>();
  readonly instanceId = input.required<number>();
  readonly manage = input<(entry: DataEntryJoined) => void>();
  readonly preview = input<(entry: DataEntryJoined) => void>();

  onSort(event: SortEvent) {
    if (!event.data) {
      return;
    }

    event.data.sort((a: any, b: any) => {
      if (!event.multiSortMeta || event.multiSortMeta.length === 0) {
        return 0;
      }

      for (const meta of event.multiSortMeta) {
        const field = meta.field;
        const order = meta.order;
        let comparisonResult = 0;

        if (this.defaultSortFields.includes(field)) {
          comparisonResult = this.handleDefaultFieldSort(field, a[field], b[field]);
        } else {
          comparisonResult = this.handleDataTypeFieldSort(field, a, b);
        }

        comparisonResult *= order;

        if (comparisonResult !== 0) {
          return comparisonResult;
        }
      }

      return 0;
    });
  }

  private handleDataTypeFieldSort(field: string, a: any, b: any) {
    const fieldType = this.dataType()?.fields.find(f => f.id.toString() === field)?.type;
    const fieldA = a.fields?.find((f: any) => f.dataTypeFieldId.toString() === field)?.value;
    const fieldB = b.fields?.find((f: any) => f.dataTypeFieldId.toString() === field)?.value;

    if (fieldA == null && fieldB != null) {
      return -1;
    } else if (fieldA != null && fieldB == null) {
      return 1;
    } else if (fieldA == null && fieldB == null) {
      return 0;
    } else {
      switch (fieldType) {
        case FieldType.Currency:
        case FieldType.Number:
          return Number(fieldA) - Number(fieldB);
        case FieldType.Date:
          return new Date(fieldA).getTime() - new Date(fieldB).getTime();
        default:
          return fieldA.toString().localeCompare(fieldB!.toString());
      }
    }
  }

  private handleDefaultFieldSort(field: string, valueA: any, valueB: any) {
    if (valueA == null && valueB != null) {
      return -1;
    } else if (valueA != null && valueB == null) {
      return 1;
    } else if (valueA == null && valueB == null) {
      return 0;
    } else if (valueA instanceof Date || field === 'createdAt' || field === 'modifiedAt') {
      return new Date(valueA).getTime() - new Date(valueB).getTime();
    } else {
      return valueA.toString().localeCompare(valueB.toString());
    }
  }
}
