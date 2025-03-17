import {Component, computed, input, OnInit, Signal, signal} from '@angular/core';
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
    DatePicker
  ],
  templateUrl: './data-type-management.component.html',
  styles: ``
})
export class DataTypeManagementComponent implements OnInit {
  dataType = signal<DataType | null>(null);
  FieldType = FieldType;
  fieldTypes = fieldTypes;
  form!: FormGroup;
  instanceId!: Signal<number | null>;
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private dataTypeService: DataTypeService,
    private localizationService: LocalizationService,
    private formBuilder: FormBuilder,
    private instanceService: InstanceService,
    private textService: TextService
  ) {
    this.instanceId = computed(() => this.instanceService.getActiveInstance()()?.id || null)
    this.form = this.createForm();
  }

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  get formFields() {
    return this.form.get("fields") as FormArray<FormGroup>;
  }

  private readonly createForm = () => {
    return this.formBuilder.group({
      name: ["", Validators.required],
      description: ["No description set."],
      fields: this.formBuilder.array([], {
        validators: (controls: AbstractControl<any, any>) => {
          const fields = controls.value as FormGroup[];

          if (fields.length === 0) {
            return {noFields: true};
          }

          return null;
        }
      })
    });
  }

  readonly addField = (field: DataTypeField | null) => {
    if (field) {
      this.formFields.push(this.formBuilder.group({
        name: [field.name, Validators.required],
        type: [field.type, Validators.required],
        defaultValue: [field.defaultValue],
        isRequired: [field.isRequired, Validators.required]
      }));
    } else {
      this.formFields.push(this.formBuilder.group({
        name: ["", Validators.required],
        type: [FieldType.Text, Validators.required],
        defaultValue: [""],
        isRequired: [true, Validators.required]
      }));
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
    this.formFields.markAsTouched();
    this.formFields.markAsDirty();
  }

  private readonly create = (request: DataTypeCreateRequest) => {
    this.dataTypeService.create(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["DataType has been created successfully."]}),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: DataTypeEditRequest) => {
    this.dataTypeService.edit(request).pipe(first()).subscribe({
      next: () => this.messages.set({success: ["Instance has been edited successfully."]}),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

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
        dataTypeId: this.dataType()!!.id!!,
        fields: updatedFields
      });
    } else {
      this.create({
        instanceId: this.instanceId()!!,
        name: this.form.value.name,
        description: this.form.value.description,
        fields: this.formFields.value
      });
    }
  }

  readonly show = (dataType: DataType | null) => {
    this.form = this.createForm();
    this.dataType.set(dataType);

    if (dataType) {
      this.form.patchValue({...dataType});
      dataType.fields?.forEach(field => {
        this.addField(field);
      });
    }

    this.dataType.set(dataType);
    this.isShown.set(true);
  }
}
