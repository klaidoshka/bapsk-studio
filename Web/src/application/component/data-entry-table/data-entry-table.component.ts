import {Component, computed, inject, input} from '@angular/core';
import {DataEntryJoined} from '../../model/data-entry.model';
import DataType from '../../model/data-type.model';
import {TableModule} from 'primeng/table';
import {DataTypeEntryFieldDisplayComponent} from '../data-type-entry-field-display/data-type-entry-field-display.component';
import {toUserIdentityFullName} from '../../model/user.model';
import {Button} from 'primeng/button';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {FieldType} from '../../model/data-type-field.model';
import {FieldTypeUtil} from '../../util/field-type.util';
import {DataEntryService} from '../../service/data-entry.service';
import {combineLatest, map, of, switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

interface DataEntryJoinedModified extends DataEntryJoined {
  [key: string]: any;
}

@Component({
  selector: 'data-entry-table',
  imports: [
    TableModule,
    DataTypeEntryFieldDisplayComponent,
    Button,
    DatePipe,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './data-entry-table.component.html',
  styles: ``
})
export class DataEntryTableComponent {
  private readonly dataEntryService = inject(DataEntryService);
  protected readonly containsActions = computed(() => !!this.delete() || !!this.manage() || !!this.preview());
  protected readonly FieldType = FieldType;
  readonly dataEntries = input.required<DataEntryJoined[]>();
  readonly dataType = input.required<DataType>();
  readonly delete = input<(entry: DataEntryJoined) => void>();
  readonly instanceId = input.required<number>();
  readonly manage = input<(entry: DataEntryJoined) => void>();
  readonly preview = input<(entry: DataEntryJoined) => void>();
  protected readonly dataEntries$ = toObservable(this.dataEntries);

  protected readonly dataEntriesModified = toObservable(this.dataType)
    .pipe(
      map(dataType => dataType.fields),
      switchMap(typeFields => this.dataEntries$.pipe(
          switchMap(entries =>
            combineLatest(entries.map(entry =>
              combineLatest(entry.fields.map(field => {
                const dataTypeField = typeFields.find(it => it.id === field.dataTypeFieldId)!;

                return dataTypeField.type === FieldType.Reference
                  ? this.dataEntryService
                    .getAllByDataTypeId(this.instanceId(), dataTypeField.referenceId!)
                    .pipe(
                      map(entries => entries.find(it => it.id === field.value)),
                      map(reference => ({
                        ...field,
                        reference: reference,
                        type: dataTypeField.type,
                      }))
                    )
                  : of({
                    ...field,
                    reference: undefined,
                    type: dataTypeField.type
                  });
              }))
                .pipe(
                  map(entryFields => {
                    const entryModified: DataEntryJoinedModified = {
                      ...entry,
                      modifiedByFullName: toUserIdentityFullName(entry.modifiedBy)
                    };

                    entryFields.forEach(field => {
                      entryModified[`field_${field.dataTypeFieldId}`] = FieldTypeUtil.toDisplayValue(field.value, field.type, field.reference);
                    });

                    return entryModified;
                  })
                )
            ))
          )
        )
      )
    );
}
