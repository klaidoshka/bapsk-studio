import {Component, computed, input, OnInit, Signal} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import DataType from '../../model/data-type.model';
import DataTypeField, {FieldType} from '../../model/data-type-field.model';
import {DataEntryJoined} from '../../model/data-entry.model';
import {Badge} from 'primeng/badge';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {getIsoCountryLabel} from '../../model/iso-country.model';

@Component({
  selector: 'app-data-type-entry-field-display',
  imports: [
    Badge,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './data-type-entry-field-display.component.html',
  styles: ``
})
export class DataTypeEntryFieldDisplayComponent implements OnInit {
  protected readonly FieldType = FieldType;
  private dataTypeField !: Signal<DataTypeField | undefined>;

  dataType = input.required<DataType>();
  dataTypeFieldId = input.required<number>();
  fieldType!: Signal<FieldType>;
  referencedDataEntry!: Signal<DataEntryJoined | undefined>;
  value = input.required<any>();

  constructor(private dataEntryService: DataEntryService) {
  }

  protected readonly getIsoCountryLabel = getIsoCountryLabel;

  ngOnInit() {
    this.dataTypeField = computed(() => this.dataType().fields.find(it => it.id === this.dataTypeFieldId()));
    this.fieldType = computed(() => this.dataTypeField()?.type || FieldType.Text);
    this.referencedDataEntry = computed(() => {
      if (!this.dataTypeField()?.referenceId || this.fieldType() !== FieldType.Reference) {
        return undefined;
      }

      return this.dataEntryService.getAsSignal(Number(this.dataTypeField()?.referenceId))().find(it => it.id === this.value());
    });
  }
}
