import {Component, inject, input, signal} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import {DataTypeService} from '../../service/data-type.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of, tap} from 'rxjs';
import Option from '../../model/options.model';
import Messages from '../../model/messages.model';
import DataTypeField, {DataTypeFieldEditRequest, FieldType, fieldTypes} from '../../model/data-type-field.model';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {Select} from 'primeng/select';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {
  DataTypeEntryFieldInputComponent
} from '../../component/data-type-entry-field-input/data-type-entry-field-input.component';
import {Checkbox} from 'primeng/checkbox';
import {Button} from 'primeng/button';
import {NumberUtil} from '../../util/number.util';
import {
  DataTypePageHeaderSectionComponent
} from '../../component/data-type-page-header-section/data-type-page-header-section.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {InputText} from 'primeng/inputtext';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {CardComponent} from '../../component/card/card.component';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'data-type-management-page',
  imports: [
    FormInputErrorComponent,
    Select,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    DataTypeEntryFieldInputComponent,
    Checkbox,
    Button,
    DataTypePageHeaderSectionComponent,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    InputText,
    FloatLabel,
    IconField,
    InputIcon,
    CardComponent,
    TableModule
  ],
  templateUrl: './data-type-management-page.component.html',
  styles: ``
})
export class DataTypeManagementPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly customErrorMessages = {'noFields': () => 'At least one field is required.'};
  protected readonly dataTypeId = input<string>();
  protected readonly fieldTypes = fieldTypes;
  protected readonly form = this.createForm();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});
  protected readonly FieldType = FieldType;

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) =>
      request.dataTypeId && request.instanceId
        ? this.dataTypeService
          .getById(request.instanceId, request.dataTypeId)
          .pipe(tap(dataType => this.patchFormValues(dataType)))
        : of(undefined)
  });

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of(undefined)
  });

  protected readonly displayFields = signal<Option<number>[]>([{
    label: 'Id',
    value: -1
  }]);

  private create(request: DataTypeCreateRequest) {
    this.dataTypeService
      .create(request)
      .pipe(first())
      .subscribe({
        next: () => this.onSuccess("Data type has been created successfully."),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }

  private createForm() {
    const dataType = {} as DataType | undefined;

    const fields = this.formBuilder.array([
      this.formBuilder.group({
        dataTypeFieldId: [undefined as number | undefined],
        defaultValue: [undefined as any | undefined],
        isRequired: [null as boolean | null],
        name: [null as string | null],
        referencedType: [null as number | null],
        type: [null as FieldType | null]
      })
    ], [this.fieldsValidator]);

    return this.formBuilder.group({
      name: [dataType?.name || '', Validators.required],
      description: [dataType?.description || 'No description set.'],
      displayField: [-1 as number],
      fields: fields
    });
  }

  private edit(request: DataTypeEditRequest) {
    this.dataTypeService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => {
          this.onSuccess("Data type has been edited successfully.");

          this.dataEntryService
            .getAllByDataTypeId(NumberUtil.parse(this.instanceId())!, request.dataTypeId)
            .pipe(first())
            .subscribe();
        },
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }

  private fieldsValidator(control: AbstractControl): ValidationErrors | null {
    return (control as FormArray).length === 0 ? {noFields: true} : null;
  };

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private patchFormValues(dataType: DataType) {
    this.displayFields.set(this.displayFields().slice(0, 1));

    let displayFieldIndex = dataType?.fields.findIndex(it => it.id === dataType?.displayFieldId);

    if (displayFieldIndex === undefined) {
      displayFieldIndex = -1;
    }

    this.form.reset();
    this.form.controls.fields.clear();

    this.form.patchValue({
      name: dataType.name,
      description: dataType.description,
      displayField: displayFieldIndex
    });

    dataType.fields.forEach(field => this.addField(dataType, field));
    this.form.markAsPristine();
  }

  protected getFieldType(id: number): FieldType {
    return this.form.controls.fields.controls.at(id)?.value?.type || FieldType.Text;
  }

  protected addField(dataType?: DataType, field?: DataTypeField) {
    const isRequiredControl = this.formBuilder.control(field?.isRequired ?? true, Validators.required);

    const isReference = field?.type === FieldType.Reference;

    if (isReference) {
      isRequiredControl.disable();
    }

    this.form.controls.fields.push(this.formBuilder.group({
      dataTypeFieldId: [field?.id],
      defaultValue: [isReference ? field?.referenceId : field?.defaultValue],
      isRequired: isRequiredControl,
      name: [field?.name || '', [Validators.required]],
      referencedType: [field?.referenceId || null, isReference ? [Validators.required] : []],
      type: [field?.type || FieldType.Text, [Validators.required]]
    }));

    if (dataType) {
      this.displayFields.set([...this.displayFields(), {
        label: field?.name || `#${this.form.controls.fields.length} Field`,
        value: this.form.controls.fields.length - 1
      }]);
    }

    this.form.markAsDirty();
  }

  protected removeField(index: number) {
    this.form.controls.fields.removeAt(index);

    const displayFieldIndex = this.form.get('displayField')?.value;

    if (displayFieldIndex === index) {
      this.form.get('displayField')?.setValue(null);
    }

    if (this.dataType.value()) {
      this.displayFields.set(this.displayFields().filter(it => it.value != index));
    }

    this.form.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: DataTypeEditRequest = {
      name: this.form.value.name || '',
      description: this.form.value.description || null,
      displayFieldIndex: this.form.value.displayField === -1 ? undefined : this.form.value.displayField!,
      dataTypeId: this.dataType.value()?.id || 0,
      fields: this.form.controls.fields.controls.map(field => {
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
      }),
      instanceId: NumberUtil.parse(this.instanceId())!
    };

    if (this.dataType.value()) {
      this.edit(request);
    } else {
      this.create({
        ...request,
        instanceId: NumberUtil.parse(this.instanceId())!
      });
    }
  }
}
