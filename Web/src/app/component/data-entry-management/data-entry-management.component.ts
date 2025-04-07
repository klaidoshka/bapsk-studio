import {Component, computed, input, OnInit, Signal, signal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataEntryService} from '../../service/data-entry.service';
import {InstanceService} from '../../service/instance.service';
import {TextService} from '../../service/text.service';
import DataEntry, {DataEntryCreateRequest, DataEntryEditRequest} from '../../model/data-entry.model';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import DataType from '../../model/data-type.model';
import {FieldType} from '../../model/data-type-field.model';
import {DataEntryFieldCreateRequest, DataEntryFieldEditRequest} from '../../model/data-entry-field.model';
import {LocalizationService} from '../../service/localization.service';
import {DataTypeEntryFieldInputComponent} from '../data-type-entry-field-input/data-type-entry-field-input.component';

@Component({
  selector: 'app-data-entry-management',
  imports: [
    Button,
    Dialog,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    DataTypeEntryFieldInputComponent,
    FormsModule
  ],
  templateUrl: './data-entry-management.component.html',
  styles: ``
})
export class DataEntryManagementComponent implements OnInit {
  dataEntry = signal<DataEntry | null>(null);
  dataType = input.required<DataType>();
  FieldType = FieldType;
  form!: FormGroup;
  instanceId!: Signal<number | null>;
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private dataEntryService: DataEntryService,
    private localizationService: LocalizationService,
    private formBuilder: FormBuilder,
    private instanceService: InstanceService,
    private textService: TextService
  ) {
    this.instanceId = computed(() => this.instanceService.getActiveInstance()()?.id || null);
  }

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
    this.form = this.createForm(this.dataType());
  }

  private readonly createForm = (dataType: DataType, dataEntry: DataEntry | null = null): FormGroup => {
    const formGroup = this.formBuilder.group({});

    dataType.fields?.forEach(tf => {
      formGroup.addControl(
        tf.name,
        this.formBuilder.control(
          dataEntry?.fields?.find(ef => ef.dataTypeFieldId === tf.id)?.value || tf.defaultValue || '',
          tf.isRequired ? Validators.required : null
        )
      );
    });

    return formGroup;
  }

  private readonly create = (request: DataEntryCreateRequest) => {
    this.dataEntryService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data entry has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: DataEntryEditRequest) => {
    this.dataEntryService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data entry has been edited successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly onSuccess = (message: string) => {
    this.messages.set({success: [message]});
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  get formFields() {
    return Object.keys(this.form.controls).map(key => {
        const control = this.form.get(key)!;
        const dataTypeField = this.dataType()?.fields?.find(f => f.name === key);
        return {
          control: control as FormControl<any>,
          field: key,
          dataTypeFieldId: dataTypeField?.id,
          type: dataTypeField?.type || FieldType.Text
        };
      }
    );
  }

  readonly getErrorMessage = (field: string): string | null => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  readonly hide = () => {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    if (this.dataEntry() != null) {
      const fields: DataEntryFieldEditRequest[] = this.formFields.map(field => {
        const candidate = this.dataEntry()!!.fields?.find(f => f.dataTypeFieldId === field.dataTypeFieldId);

        return {
          dataEntryFieldId: candidate!!.id!!,
          value: field.control?.value || this.dataType()!!.fields?.find(f => f.name === field.field)?.defaultValue || ''
        };
      });

      this.edit({
        dataEntryId: this.dataEntry()!!.id,
        dataTypeId: this.dataType()!!.id,
        fields: fields
      });
    } else {
      const fields: DataEntryFieldCreateRequest[] = this.dataType()!!.fields?.map((field, _) => {
        return {
          dataTypeFieldId: field.id,
          value: this.formFields.find(f => f.field === field.name)?.control?.value || field.defaultValue || ''
        };
      }) || [];

      this.create({
        dataTypeId: this.dataType()!!.id,
        fields: fields
      });
    }
  }

  readonly show = (dataEntry: DataEntry | null) => {
    this.dataEntry.set(dataEntry);
    this.form.reset();
    this.form = this.createForm(this.dataType(), dataEntry);
    this.isShown.set(true);
  }
}
