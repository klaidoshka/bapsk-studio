import {Component, effect, inject, input, signal, untracked} from '@angular/core';
import {FieldType} from '../../model/data-type-field.model';
import {Checkbox} from 'primeng/checkbox';
import {DatePicker} from 'primeng/datepicker';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {IsoCountries} from '../../model/iso-country.model';
import {Select} from 'primeng/select';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {DataEntryService} from '../../service/data-entry.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, of} from 'rxjs';

@Component({
  selector: 'data-type-entry-field-input',
  imports: [
    Checkbox,
    DatePicker,
    ReactiveFormsModule,
    InputText,
    InputNumber,
    FormsModule,
    Select,
    IconField,
    InputIcon
  ],
  templateUrl: './data-type-entry-field-input.component.html',
  styles: ``,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DataTypeEntryFieldInputComponent
    }
  ]
})
export class DataTypeEntryFieldInputComponent implements ControlValueAccessor {
  private readonly dataEntryService = inject(DataEntryService);
  protected readonly FieldType = FieldType;
  protected readonly IsoCountries = IsoCountries;
  readonly type = input.required<FieldType>();
  readonly inputId = input<string>();
  readonly referencedDataTypeId = input<number>();
  readonly referencedDataTypeInstanceId = input<number>();
  protected readonly oldType = signal<FieldType | undefined>(undefined);

  protected readonly onChange = signal<(value: string) => void>(() => {
  });
  protected readonly onTouched = signal<() => void>(() => {
  });
  protected readonly touched = signal<boolean>(false);
  protected readonly disabled = signal<boolean>(false);
  protected readonly value = signal<any>(undefined);

  protected readonly dataEntries = rxResource({
    request: () => ({
      dataTypeId: this.referencedDataTypeId(),
      instanceId: this.referencedDataTypeInstanceId()
    }),
    loader: ({ request }) => request.dataTypeId && request.instanceId
      ? this.dataEntryService.getAllByDataTypeId(request.instanceId, request.dataTypeId).pipe(
        map(entries => entries.map(entry => ({
          ...entry,
          displayLabel: entry.display()
        })))
      )
      : of(undefined)
  });

  constructor() {
    effect(() => {
      const oldType = untracked(() => this.oldType());
      const keepValue = untracked(() => oldType === undefined || oldType === this.type());
      const value = untracked(() => this.value());

      this.oldType.set(this.type());

      if (!keepValue || value == null || value == '') {
        this.value.set(this.resolveDefaultValue(this.type()));

        if (oldType !== undefined) {
          this.callOnChange();
        }
      }
    });
  }

  callOnChange() {
    this.onChange()!(this.value());
  }

  markAsTouched() {
    if (!this.touched()) {
      this.onTouched()();
      this.touched.set(true);
    }
  }

  registerOnChange(onChange: (value: any) => void) {
    this.onChange.set(onChange);
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched.set(onTouched);
  }

  setDisabledState(disabled: boolean) {
    this.disabled.set(disabled);
  }

  writeValue(value: any) {
    this.value.set(value);
  }

  resolveDefaultValue(type: FieldType): any {
    switch (type) {
      case FieldType.Check:
        return false;

      case FieldType.Currency:
      case FieldType.Number:
        return undefined;

      case FieldType.Date:
      case FieldType.IsoCountryCode:
        return undefined;

      default:
        return '';
    }
  }
}
