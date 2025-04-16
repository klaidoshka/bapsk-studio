import {Component, effect, input, signal, untracked} from '@angular/core';
import {FieldType} from '../../model/data-type-field.model';
import {Checkbox} from 'primeng/checkbox';
import {DatePicker} from 'primeng/datepicker';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {Select} from 'primeng/select';

@Component({
  selector: 'data-type-entry-field-input',
  imports: [
    Checkbox,
    DatePicker,
    ReactiveFormsModule,
    InputText,
    InputNumber,
    FormsModule,
    Select
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
  protected readonly FieldType = FieldType;
  protected readonly IsoCountries = IsoCountries;

  type = input.required<FieldType>();
  oldType = signal<FieldType | undefined>(undefined);

  onChange = signal<(value: string) => void>(() => {
  });
  onTouched = signal<() => void>(() => {
  });
  touched = signal<boolean>(false);
  disabled = signal<boolean>(false);
  value = signal<any>(undefined);

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
      this.onTouched();
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
        return 0;

      case FieldType.Date:
        return new Date();

      case FieldType.IsoCountryCode:
        return getDefaultIsoCountry().code;

      default:
        return '';
    }
  }
}
