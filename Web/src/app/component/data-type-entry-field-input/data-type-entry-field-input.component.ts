import {Component, computed, effect, input, OnInit, Signal, signal} from '@angular/core';
import {FieldType} from '../../model/data-type-field.model';
import {Checkbox} from 'primeng/checkbox';
import {DatePicker} from 'primeng/datepicker';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {InputNumber} from 'primeng/inputnumber';
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {DataTypeService} from '../../service/data-type.service';
import DataType from '../../model/data-type.model';
import {InstanceService} from '../../service/instance.service';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-data-type-entry-field-input',
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
export class DataTypeEntryFieldInputComponent implements ControlValueAccessor, OnInit {
  protected readonly FieldType = FieldType;
  protected readonly IsoCountries = IsoCountries;

  dataTypes!: Signal<DataType[]>;
  type = input.required<FieldType>();
  onChange = signal<(value: string) => void>(() => {
  });
  onTouched = signal<() => void>(() => {
  });
  touched = signal<boolean>(false);
  disabled = signal<boolean>(false);
  value = signal<any>(undefined);

  constructor(
    private dataTypeService: DataTypeService,
    instanceService: InstanceService
  ) {
    this.dataTypes = computed(() => {
      const instanceId = instanceService.getActiveInstanceId()();
      return instanceId ? this.dataTypeService.getAsSignal(instanceId)() : [];
    });

    effect(() => {
      this.type(); // Init dependency
      this.value.set(this.defaultValue());
      this.callOnChange();
    });
  }

  ngOnInit() {
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

  readonly defaultValue = (): any => {
    switch (this.type()) {
      case FieldType.Check:
        return false;

      case FieldType.Currency:
      case FieldType.Number:
        return 0;

      case FieldType.Date:
        return new Date();

      case FieldType.IsoCountryCode:
        return getDefaultIsoCountry().code;

      case FieldType.Reference:
        return this.dataTypes().at(0)?.id;

      default:
        return '';
    }
  }
}
