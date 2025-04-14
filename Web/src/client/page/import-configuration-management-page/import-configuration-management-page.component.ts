import {Component, computed, inject, input, signal} from '@angular/core';
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
import {LocalizationService} from '../../service/localization.service';
import {DataEntryService} from '../../service/data-entry.service';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'import-configuration-management-page',
  imports: [
    ReactiveFormsModule,
    InputText,
    Select,
    DataTypeEntryFieldInputComponent,
    Button,
    NgIf,
    MessagesShowcaseComponent
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
  private readonly localizationService = inject(LocalizationService);
  private readonly textService = inject(TextService);

  configuration = rxResource({
    request: () => ({
      configurationId: this.configurationId() === undefined ? undefined : +this.configurationId()!
    }),
    loader: ({request}) => request.configurationId
      ? this.importConfigurationService.getById(request.configurationId)
      : of(undefined)
  });

  configurationId = input<string>();

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  form!: FormGroup;
  instanceId = this.instanceService.getActiveInstanceId();
  messages = signal<Messages>({});

  constructor() {
    this.form = this.formBuilder.group({
      dataTypeId: [this.configuration.value()?.dataTypeId, [Validators.required]],
      fields: this.formBuilder.array([]),
      id: [this.configuration.value()?.id],
      name: [this.configuration.value()?.name, [Validators.required]]
    });

    if (this.configuration.value()?.dataTypeId) {
      this.changeFields(this.configuration.value()!.dataTypeId);
    }
  }

  private readonly addField = (dataTypeField: DataTypeField, configurationField?: ImportConfigurationField) => {
    this.fields().push(
      this.formBuilder.group({
        dataTypeFieldId: [dataTypeField.id, [Validators.required]],
        defaultValue: [configurationField?.defaultValue || dataTypeField.defaultValue],
        id: [configurationField?.id],
        type: [dataTypeField.type, [Validators.required]]
      })
    );
  }

  private readonly changeMessages = (message: string, success: boolean = true) => {
    this.messages.set(success ? {success: [message]} : {error: [message]});
  }

  private readonly create = (request: ImportConfigurationCreateRequest) => {
    this.importConfigurationService.create(request)
      .pipe(first())
      .subscribe({
        next: () => this.changeMessages("Import configuration created successfully."),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }

  private readonly edit = (request: ImportConfigurationEditRequest) => {
    this.importConfigurationService.edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.changeMessages("Import configuration edited successfully."),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }

  readonly fields = () => {
    return this.form.get('fields') as FormArray<FormGroup>;
  }

  readonly changeFields = (dataTypeId: number) => {
    this.fields().clear();

    const dataType = this.dataTypes.value()!.find(dt => dt.id === dataTypeId)!;

    dataType.fields.forEach(field => {
      this.addField(
        field,
        this.configuration.value()?.fields.find(cf => cf.dataTypeFieldId === field.id)
      );
    });
  }

  readonly getErrorMessage = (field: string) => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  readonly getDataEntries = (index: number) => {
    const dataTypeFieldId = this.fields().at(index).get('dataTypeFieldId')!.value as number;
    const dataTypeId = this.form.get('dataTypeId')!.value as number;
    const dataType = this.dataTypes.value()!.find(dt => dt.id === dataTypeId)!;
    const dataTypeField = dataType.fields.find(df => df.id === dataTypeFieldId);

    return computed(() => toSignal(this.dataEntryService.getAllByDataTypeId(dataTypeField!.referenceId!))()!
      .map(it => ({
        label: it.display(),
        id: it.id
      })));
  }

  readonly getFieldType = (index: number) => {
    return this
      .fields()
      .at(index)
      .get('type')!.value as FieldType;
  }

  readonly getFieldName = (index: number) => {
    const field = this.fields()
      .at(index)
      .get('dataTypeFieldId')!.value;

    const dataType = this.dataTypes
      .value()!
      .find(dt => dt.id === this.form.value.dataTypeId)!;

    return dataType.fields.find(df => df.id === field)?.name || "";
  }

  readonly moveField = (index: number, value: number) => {
    const fields = this.fields();
    const field = fields.at(index);

    if (index + value < 0 || index + value >= fields.length) {
      return;
    }

    fields.removeAt(index);
    fields.insert(index + value, field);
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.changeMessages("Please fill out the form.", false);
    }

    const request: ImportConfigurationEditRequest = {
      importConfiguration: {
        dataTypeId: this.form.value.dataTypeId,
        fields: this.fields().value.map((it, index) => ({
          dataTypeFieldId: it.dataTypeFieldId,
          defaultValue: it.defaultValue,
          id: it.id,
          order: index
        })),
        id: this.form.value.id,
        name: this.form.value.name
      }
    };

    if (this.configurationId()) {
      this.edit(request);
    } else {
      this.create(request);
    }
  }
}
