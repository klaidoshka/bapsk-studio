import {Component, computed, input, OnInit, Signal, signal} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {DataTypeService} from '../../service/data-type.service';
import {TextService} from '../../service/text.service';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import Messages from '../../model/messages-model';
import {first} from 'rxjs';
import ErrorResponse from '../../model/error-response.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Textarea} from 'primeng/textarea';
import {InstanceService} from '../../service/instance.service';
import {TableModule} from 'primeng/table';
import DataTypeField, {
  DataTypeFieldEditRequest,
  FieldType,
  fieldTypes
} from '../../model/data-type-field.model';
import {Checkbox} from 'primeng/checkbox';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';

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
  isProcessing = signal<boolean>(false);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);
  messages = signal<Messages>({});

  constructor(
    private formBuilder: FormBuilder,
    private dataTypeService: DataTypeService,
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

  private createForm() {
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

  addField(field: DataTypeField | null) {
    if (field) {
      this.formFields.push(this.formBuilder.group({
        name: [field.name, Validators.required],
        type: [fieldTypes.find(t =>
          t.label.toLowerCase() == field.type.toString().toLowerCase()
        )?.value, Validators.required],
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

  clearDefaultValue(index: number) {
    this.formFields.at(index).patchValue({defaultValue: ""});
  }

  removeField(index: number) {
    this.formFields.removeAt(index);
    this.formFields.markAsTouched();
    this.formFields.markAsDirty();
  }

  private create(request: DataTypeCreateRequest) {
    this.isProcessing.set(true);

    this.dataTypeService.create(request).pipe(first()).subscribe({
      next: () => {
        this.messages.set({success: ["DataType has been created successfully."]});
      },
      error: (response: ErrorResponse) => {
        this.messages.set({error: response.error.messages || ["Extremely rare error occurred, please try again later."]});
      },
      complete: () => {
        this.isProcessing.set(false);
      }
    });
  }

  private edit(request: DataTypeEditRequest) {
    this.isProcessing.set(true);

    this.dataTypeService.edit(request).pipe(first()).subscribe({
      next: () => {
        this.messages.set({success: ["Instance has been edited successfully."]});
      },
      error: (response: ErrorResponse) => {
        this.messages.set({error: response.error.messages || ["Extremely rare error occurred, please try again later."]});
      },
      complete: () => {
        this.isProcessing.set(false);
      }
    });
  }

  getErrorMessage(field: string): string | null {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    if (control.errors?.["noFields"]) return "At least one field is required.";

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  getFieldType(id: number): FieldType {
    return this.formFields.controls.at(id)?.value?.type || FieldType.Text;
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  save() {
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

  show(dataType: DataType | null) {
    this.form = this.createForm();

    if (dataType) {
      this.dataType.set(dataType);
      this.form.patchValue({...dataType});
      dataType.fields?.forEach(field => {
        this.addField(field);
      });
    }

    this.isShown.set(true);
  }
}
