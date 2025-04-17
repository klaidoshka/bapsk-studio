import {Component, computed, effect, inject, input, Signal, signal} from '@angular/core';
import {
  ImportConfigurationCreateRequest,
  ImportConfigurationEditRequest,
  ImportConfigurationField
} from '../../model/import-configuration.model';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {
  DataTypeEntryFieldInputComponent
} from '../../component/data-type-entry-field-input/data-type-entry-field-input.component';
import {Button} from 'primeng/button';
import {NgIf} from '@angular/common';
import {InstanceService} from '../../service/instance.service';
import {DataTypeService} from '../../service/data-type.service';
import DataTypeField, {FieldType} from '../../model/data-type-field.model';
import {TextService} from '../../service/text.service';
import Messages from '../../model/messages.model';
import {first, of} from 'rxjs';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {DataEntryService} from '../../service/data-entry.service';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'import-configuration-management-page',
  imports: [
    ReactiveFormsModule,
    InputText,
    Select,
    DataTypeEntryFieldInputComponent,
    Button,
    NgIf,
    MessagesShowcaseComponent,
    TableModule
  ],
  templateUrl: './import-configuration-management-page.component.html',
  styles: ``
})
export class ImportConfigurationManagementPageComponent {
  protected readonly FieldType = FieldType;
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly instanceService = inject(InstanceService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly textService = inject(TextService);

  configuration = rxResource({
    request: () => ({
      configurationId: this.configurationId() === undefined ? undefined : +this.configurationId()!
    }),
    loader: ({ request }) => request.configurationId
      ? this.importConfigurationService.getById(request.configurationId)
      : of(undefined)
  });

  configurationId = input<string>();

  dataEntries = rxResource({
    request: () => {
      let dataTypeIds = this.configuration
        .value()?.dataType.fields
        .map(field => field.referenceId)
        .filter(id => id != null);

      if (!dataTypeIds) {
        dataTypeIds = this.dataTypes.value()?.map(dataType => dataType.id);
      }

      return { dataTypeIds: dataTypeIds || [] };
    },
    loader: ({ request }) => request.dataTypeIds.length > 0
      ? this.dataEntryService.getAllByDataTypeIds(request.dataTypeIds)
      : of(undefined)
  });

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({ request }) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  form = this.formBuilder.group({
    dataTypeId: [this.configuration.value()?.dataTypeId, [Validators.required]],
    fields: this.formBuilder.array([]),
    id: [this.configuration.value()?.id],
    name: [this.configuration.value()?.name, [Validators.required]]
  });

  instanceId = this.instanceService.getActiveInstanceId();
  messages = signal<Messages>({});

  constructor() {
    const effectRef = effect(() => {
      const configuration = this.configuration.value();

      if (!configuration) {
        return;
      }

      this.form.patchValue({
        dataTypeId: configuration!.dataTypeId,
        id: configuration!.id,
        name: configuration!.name
      });

      this.changeFormFields(this.configuration.value()!.dataTypeId);

      effectRef.destroy();
    });
  }

  private addFormField(dataTypeField: DataTypeField, configurationField?: ImportConfigurationField) {
    this.formFields().push(this.createFormField(dataTypeField, configurationField));
  }

  private createFormField(dataTypeField: DataTypeField, configurationField?: ImportConfigurationField) {
    return this.formBuilder.group({
      dataTypeFieldId: [dataTypeField.id, [Validators.required]],
      defaultValue: [configurationField?.defaultValue || dataTypeField.defaultValue],
      id: [configurationField?.id],
      type: [dataTypeField.type, [Validators.required]]
    });
  }

  private changeMessages(message: string, success: boolean = true) {
    this.messages.set(success ? { success: [message] } : { error: [message] });
  }

  private create(request: ImportConfigurationCreateRequest) {
    this.importConfigurationService.create(request).pipe(first()).subscribe({
      next: () => this.changeMessages("Import configuration created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: ImportConfigurationEditRequest) {
    this.importConfigurationService.edit(request).pipe(first()).subscribe({
      next: () => this.changeMessages("Import configuration edited successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  changeFormFields(dataTypeId: number) {
    this.formFields().clear();

    const dataType = this.configuration.value()?.dataType || this.dataTypes
      .value()!
      .find(dt => dt.id === dataTypeId)!;

    dataType.fields.forEach(field => {
      this.addFormField(
        field,
        this.configuration.value()?.fields.find(cf => cf.dataTypeFieldId === field.id)
      );
    });
  }

  formFields() {
    return this.form.get('fields') as FormArray<FormGroup>;
  }

  getErrorMessage(field: string) {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  getDataEntries(index: number): Signal<{ id: number, label: string }[]> {
    return computed(() => {
      const dataTypeId = this.form.value.dataTypeId;
      let dataType = this.configuration.value()?.dataType;

      if (dataType?.id !== dataTypeId) {
        dataType = this.dataTypes.value()?.find(dataType => dataType.id === dataTypeId);
      }

      const dataTypeFieldId = this
        .formFields()
        .at(index)?.value?.dataTypeFieldId as number | undefined;

      if (!dataTypeFieldId) {
        return [];
      }

      const dataTypeField = dataType?.fields?.find(field =>
        field.id === dataTypeFieldId
      );

      if (dataTypeField?.referenceId) {
        return this.dataEntries.value()
          ?.get(dataTypeField.referenceId)
          ?.map(entry => ({
            id: entry.id,
            label: entry.display()
          })) || [];
      }

      return [];
    });
  }

  getFieldType(index: number) {
    return this
      .formFields()
      .at(index)
      .get('type')!.value as FieldType;
  }

  getFieldName(index: number) {
    const field = this.formFields()
      .at(index)
      .get('dataTypeFieldId')!.value;

    const dataType = this.dataTypes
      .value()!
      .find(dt => dt.id === this.form.value.dataTypeId)!;

    return dataType.fields.find(df => df.id === field)?.name || "";
  }

  moveField(index: number, value: number) {
    const fields = this.formFields();
    const field = fields.at(index);

    if (index + value < 0 || index + value >= fields.length) {
      return;
    }

    fields.removeAt(index);
    fields.insert(index + value, field);
    fields.markAsDirty();
  }

  save() {
    if (!this.form.valid) {
      this.changeMessages("Please fill out the form.", false);
    }

    const request: ImportConfigurationEditRequest = {
      importConfiguration: {
        dataTypeId: this.form.value.dataTypeId!,
        fields: this.formFields().value.map((it, index) => ({
          dataTypeFieldId: it.dataTypeFieldId,
          defaultValue: it.defaultValue,
          id: it.id,
          order: index
        })),
        id: this.form.value.id || undefined,
        name: this.form.value.name!
      }
    };

    if (this.configurationId()) {
      this.edit(request);
    } else {
      this.create(request);
    }
  }
}
