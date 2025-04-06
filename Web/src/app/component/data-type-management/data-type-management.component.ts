import {Component, Signal, signal} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataTypeService} from '../../service/data-type.service';
import {TextService} from '../../service/text.service';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Textarea} from 'primeng/textarea';
import {InstanceService} from '../../service/instance.service';
import {TableModule} from 'primeng/table';
import DataTypeField, {DataTypeFieldEditRequest, FieldType, fieldTypes} from '../../model/data-type-field.model';
import {Checkbox} from 'primeng/checkbox';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';
import {LocalizationService} from '../../service/localization.service';
import {IsoCountryCode} from '../../model/iso-country.model';
import {DataEntryService} from '../../service/data-entry.service';
import Option from '../../model/options.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-data-type-management',
  imports: [
    Button,
    Dialog,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Textarea,
    TableModule,
    Checkbox,
    Select,
    FormsModule,
    DatePicker,
    NgIf
  ],
  templateUrl: './data-type-management.component.html',
  styles: ``
})
export class DataTypeManagementComponent {
  dataType = signal<DataType | undefined>(undefined);
  displayFields = signal<Option<number | null>[]>([{
    label: 'Id',
    value: null
  }]);
  FieldType = FieldType;
  fieldTypes = fieldTypes;
  form!: FormGroup;
  instanceId!: Signal<number | undefined>;
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private dataEntryService: DataEntryService,
    private dataTypeService: DataTypeService,
    private localizationService: LocalizationService,
    private formBuilder: FormBuilder,
    private instanceService: InstanceService,
    private textService: TextService
  ) {
    this.instanceId = this.instanceService.getActiveInstanceId();
    this.form = this.createForm();
  }

  get formFields() {
    return this.form.get("fields") as FormArray<FormGroup>;
  }

  private readonly createForm = (dataType?: DataType) => {
    this.displayFields.set(this.displayFields().slice(0, 1));

    const displayFieldIndex = dataType?.fields.findIndex(it => it.id == dataType?.displayFieldId) || -1;

    return this.formBuilder.group({
      name: [dataType?.name || '', Validators.required],
      description: [dataType?.description || 'No description set.'],
      displayField: [displayFieldIndex === -1 ? null : displayFieldIndex],
      fields: this.formBuilder.array([], {
        validators: (controls: AbstractControl<any, any>) => {
          const fields = controls.value as FormGroup[];
          return fields.length === 0 ? {noFields: true} : null;
        }
      })
    });
  }

  readonly addField = (field?: DataTypeField) => {
    this.formFields.push(this.formBuilder.group({
      name: [field?.name || '', Validators.required],
      type: [field?.type || FieldType.Text, Validators.required],
      defaultValue: [field?.defaultValue || ''],
      isRequired: [field?.isRequired || true, Validators.required]
    }));
    if (this.dataType()) {
      this.displayFields.set([...this.displayFields(), {
        label: field?.name || `Field ${this.formFields.length}`,
        value: this.formFields.length - 1
      }]);
    }
    this.formFields.markAsTouched();
    this.formFields.markAsDirty();
  }

  readonly updateDefaultValue = (index: number, type: FieldType) => {
    const field = this.formFields.at(index);

    switch (type) {
      case FieldType.Check:
        field.patchValue({defaultValue: false});
        break;

      case FieldType.Date:
        field.patchValue({defaultValue: new Date()});
        break;

      case FieldType.Number:
        field.patchValue({defaultValue: 0});
        break;

      case FieldType.IsoCountryCode:
        field.patchValue({defaultValue: IsoCountryCode.LT});
        break;

      default:
        field.patchValue({defaultValue: ""});
        break;
    }
  }

  readonly removeField = (index: number) => {
    this.formFields.removeAt(index);
    if (this.dataType()) {
      this.displayFields.set(this.displayFields().filter(it => it.value != index));
    }
    this.formFields.markAsTouched();
    this.formFields.markAsDirty();
  }

  private readonly create = (request: DataTypeCreateRequest) => {
    this.dataTypeService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("DataType has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: DataTypeEditRequest) => {
    this.dataTypeService.edit(request).pipe(first()).subscribe({
      next: () => {
        this.onSuccess("DataType has been edited successfully.");
        this.dataEntryService.getAll(request.dataTypeId).subscribe();
      },
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly onSuccess = (message: string) => this.messages.set({success: [message]});

  readonly getErrorMessage = (field: string): string | null => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["noFields"]) return "At least one field is required.";

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  readonly getFieldType = (id: number): FieldType => {
    return this.formFields.controls.at(id)?.value?.type || FieldType.Text;
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

    if (this.dataType() != null) {
      const updatedFields: DataTypeFieldEditRequest[] = this.formFields.value.map((field: any, index: number) => {
        const candidate = this.dataType()!!.fields?.at(index) || null;

        return {
          ...candidate,
          dataTypeFieldId: candidate?.id,
          ...field
        }
      });

      this.edit({
        name: this.form.value.name,
        description: this.form.value.description,
        displayFieldIndex: this.form.value.displayField,
        dataTypeId: this.dataType()!.id!,
        fields: updatedFields
      });
    } else {
      this.create({
        instanceId: this.instanceId()!,
        name: this.form.value.name,
        description: this.form.value.description,
        fields: this.formFields.value
      });
    }
  }

  readonly show = (dataType?: DataType) => {
    this.dataType.set(dataType);
    this.form = this.createForm(dataType);
    dataType?.fields?.forEach(field => {
      this.addField(field);
    });
    this.isShown.set(true);
  }
}
