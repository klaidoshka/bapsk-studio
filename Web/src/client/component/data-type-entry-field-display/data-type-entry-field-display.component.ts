import {Component, computed, inject, input} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import DataType from '../../model/data-type.model';
import {FieldType} from '../../model/data-type-field.model';
import {Badge} from 'primeng/badge';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {map, of} from 'rxjs';

@Component({
  selector: 'data-type-entry-field-display',
  imports: [
    Badge,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './data-type-entry-field-display.component.html',
  styles: ``
})
export class DataTypeEntryFieldDisplayComponent {
  protected readonly FieldType = FieldType;
  private readonly dataEntryService = inject(DataEntryService);

  dataType = input.required<DataType>();

  dataTypeField = computed(() => this
    .dataType()
    .fields
    .find(it => it.id === this.dataTypeFieldId()));

  dataTypeFieldId = input.required<number>();

  fieldType = computed(() => this.dataTypeField()?.type || FieldType.Text);

  referencedDataEntry = rxResource({
    request: () => {
      const referenceId = this.dataTypeField()?.referenceId;
      const value = this.value();

      if (!referenceId || this.fieldType() !== FieldType.Reference) {
        return undefined;
      }

      return {
        referenceId: +referenceId,
        value
      };
    },
    loader: ({request}) => {
      if (!request) {
        return of(undefined);
      }

      return this.dataEntryService
        .getAllByDataTypeId(request.referenceId)
        .pipe(
          map(entries => entries.find(it => it.id === request.value))
        );
    }
  });

  value = input.required<any>();

  protected readonly getIsoCountryLabel = getIsoCountryLabel;
}
