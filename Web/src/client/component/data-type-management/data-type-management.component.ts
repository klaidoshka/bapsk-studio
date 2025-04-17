import {Component, inject, signal} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {DataTypeService} from '../../service/data-type.service';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import Messages from '../../model/messages.model';
import {first, of} from 'rxjs';
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
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {DataEntryService} from '../../service/data-entry.service';
import Option from '../../model/options.model';
import {NgIf} from '@angular/common';
import {DataTypeEntryFieldInputComponent} from '../data-type-entry-field-input/data-type-entry-field-input.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'data-type-management',
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
    NgIf,
    DataTypeEntryFieldInputComponent,
    FormInputErrorComponent
  ],
  templateUrl: './data-type-management.component.html',
  styles: ``
})
export class DataTypeManagementComponent {
  protected readonly FieldType = FieldType;
  protected readonly fieldTypes = fieldTypes;
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);

  dataType = signal<DataType | undefined>(undefined);

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({ request }) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  displayFields = signal<Option<number | null>[]>([{
    label: 'Id',
    value: null
  }]);

  form = this.createForm();
  instanceId = this.instanceService.getActiveInstanceId();
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  customErrorMessages = {
    'noFields': () => 'At least one field is required.'
  };

  get formFields() {
    return this.form.get("fields") as FormArray<FormGroup>;
  }

  private create(request: DataTypeCreateRequest) {
    this.dataTypeService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data type has been created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private createForm(dataType?: DataType) {
    this.displayFields.set(this.displayFields().slice(0, 1));

    let displayFieldIndex = dataType?.fields.findIndex(it => it.id === dataType?.displayFieldId);

    if (displayFieldIndex === undefined) {
      displayFieldIndex = -1;
    }

    return this.formBuilder.group({
      name: [dataType?.name || '', Validators.required],
      description: [dataType?.description || 'No description set.'],
      displayField: [displayFieldIndex === -1 ? null : displayFieldIndex],
      fields: this.formBuilder.array([], [this.fieldsValidator])
    });
  }

  private edit(request: DataTypeEditRequest) {
    this.dataTypeService.edit(request).pipe(first()).subscribe({
      next: () => {
        this.onSuccess("Data type has been edited successfully.");
        this.dataEntryService.getAllByDataTypeId(request.dataTypeId).subscribe();
      },
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private fieldsValidator(control: AbstractControl): ValidationErrors | null {
    return (control as FormArray).length === 0 ? { noFields: true } : null;
  };

  private onSuccess(message: string) {
    this.messages.set({ success: [message] });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  getFieldType(id: number): FieldType {
    return this.formFields.controls.at(id)?.value?.type || FieldType.Text;
  }

  addField(dataType?: DataType, field?: DataTypeField) {
    const isRequiredControl = this.formBuilder.control(field?.isRequired || true, Validators.required);
    const isReference = field?.type === FieldType.Reference;

    if (isReference) {
      isRequiredControl.disable();
    }

    this.formFields.push(this.formBuilder.group({
      dataTypeFieldId: [field?.id],
      defaultValue: [isReference ? field?.referenceId : field?.defaultValue],
      isRequired: isRequiredControl,
      name: [field?.name || '', Validators.required],
      referencedType: [field?.referenceId || null, isReference ? Validators.required : null],
      type: [field?.type || FieldType.Text, Validators.required]
    }));

    if (dataType) {
      this.displayFields.set([...this.displayFields(), {
        label: field?.name || `#${this.formFields.length} Field`,
        value: this.formFields.length - 1
      }]);
    }

    this.form.markAsDirty();
  }

  removeField(index: number) {
    this.formFields.removeAt(index);

    const displayFieldIndex = this.form.get('displayField')?.value;

    if (displayFieldIndex === index) {
      this.form.get('displayField')?.setValue(null);
    }

    if (this.dataType()) {
      this.displayFields.set(this.displayFields().filter(it => it.value != index));
    }

    this.form.markAsDirty();
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["Please fill out the form."] });
      return;
    }

    const request: DataTypeEditRequest = {
      name: this.form.value.name || '',
      description: this.form.value.description || null,
      displayFieldIndex: this.form.value.displayField === null ? undefined : this.form.value.displayField,
      dataTypeId: this.dataType()!.id!,
      fields: this.formFields.controls.map((field: FormGroup) => {
        const fieldType = field.value.type;
        const isReference = fieldType === FieldType.Reference;

        return {
          dataTypeFieldId: field.value.dataTypeFieldId,
          name: field.value.name,
          type: fieldType,
          defaultValue: isReference ? null : field.value.defaultValue,
          referenceId: isReference ? field.value.referencedType : null,
          isRequired: isReference ? true : field.value.isRequired
        } as DataTypeFieldEditRequest;
      })
    };

    if (this.dataType() != null) {
      this.edit(request);
    } else {
      this.create({
        ...request,
        instanceId: this.instanceId()!
      });
    }
  }

  show(dataType?: DataType) {
    this.dataType.set(dataType);
    this.form = this.createForm(dataType);

    dataType?.fields?.forEach(field => {
      this.addField(dataType, field);
    });

    this.form.markAsPristine();
    this.isShown.set(true);
  }
}
