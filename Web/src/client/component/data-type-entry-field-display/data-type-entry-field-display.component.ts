import {Component, computed, inject, input} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import DataType from '../../model/data-type.model';
import {FieldType} from '../../model/data-type-field.model';
import {Badge} from 'primeng/badge';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, of} from 'rxjs';
import {InstanceService} from '../../service/instance.service';

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
  private readonly dataEntryService = inject(DataEntryService);
  private readonly instanceService = inject(InstanceService);
  protected readonly FieldType = FieldType;
  protected readonly getIsoCountryLabel = getIsoCountryLabel;
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  readonly dataType = input<DataType>();
  readonly dataTypeFieldId = input<number>();
  readonly type = input<FieldType>();
  protected readonly typeResolved = computed(() => this.type() || this.dataTypeField()?.type || FieldType.Text)
  readonly value = input.required<any>();

  protected readonly dataTypeField = computed(() => this.dataType()
    ?.fields.find(it => it.id === this.dataTypeFieldId())
  );

  protected readonly referencedDataEntry = rxResource({
    request: () => {
      const referenceId = this.dataTypeField()?.referenceId;
      const value = this.value();

      if (!referenceId || this.type() !== FieldType.Reference) {
        return undefined;
      }

      return {
        instanceId: this.instanceId(),
        referenceId: +referenceId,
        value
      };
    },
    loader: ({request}) => request?.instanceId
      ? this.dataEntryService
        .getAllByDataTypeId(request.instanceId, request.referenceId)
        .pipe(
          map(entries => entries.find(it => it.id === request.value))
        )
      : of(undefined)
  });
}
