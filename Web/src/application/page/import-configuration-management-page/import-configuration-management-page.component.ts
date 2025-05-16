import {Component, computed, inject, input, Signal, signal} from '@angular/core';
import {
  ImportConfigurationCreateRequest,
  ImportConfigurationEditRequest,
  ImportConfigurationField,
  ImportConfigurationJoined
} from '../../model/import-configuration.model';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {
  DataTypeEntryFieldInputComponent
} from '../../component/data-type-entry-field-input/data-type-entry-field-input.component';
import {Button} from 'primeng/button';
import {DataTypeService} from '../../service/data-type.service';
import DataTypeField, {FieldType} from '../../model/data-type-field.model';
import Messages from '../../model/messages.model';
import {first, of, tap} from 'rxjs';
import {MessageHandlingService} from '../../service/message-handling.service';
import {DataEntryService} from '../../service/data-entry.service';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {TableModule} from 'primeng/table';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {NumberUtil} from '../../util/number.util';
import {
  ImportConfigurationPageHeaderSectionComponent
} from '../../component/import-configuration-page-header-section/import-configuration-page-header-section.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import DataType from '../../model/data-type.model';
import {CardComponent} from '../../component/card/card.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'import-configuration-management-page',
  imports: [
    ReactiveFormsModule,
    InputText,
    Select,
    DataTypeEntryFieldInputComponent,
    Button,
    MessagesShowcaseComponent,
    TableModule,
    FormInputErrorComponent,
    ImportConfigurationPageHeaderSectionComponent,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    CardComponent,
    FloatLabel,
    IconField,
    InputIcon,
    TranslatePipe
  ],
  templateUrl: './import-configuration-management-page.component.html',
  styles: ``
})
export class ImportConfigurationManagementPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  protected readonly FieldType = FieldType;
  protected readonly configurationId = input<string>();
  protected readonly form = this.createForm();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly configuration = rxResource({
    request: () => ({
      configurationId: NumberUtil.parse(this.configurationId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({ request }) => request.configurationId && request.instanceId
      ? this.importConfigurationService
        .getById(request.instanceId, request.configurationId)
        .pipe(tap(configuration => this.patchFormValues(configuration)))
      : of(undefined)
  });

  protected readonly dataEntries = rxResource({
    request: () => {
      let dataTypeIds = this.configuration.value()?.dataType.fields
        .map(field => field.referenceId)
        .filter(id => id != null);

      if (!dataTypeIds) {
        dataTypeIds = this.dataTypes.value()?.map(dataType => dataType.id);
      }

      return {
        dataTypeIds: dataTypeIds,
        instanceId: NumberUtil.parse(this.instanceId())!
      };
    },
    loader: ({ request }) => request.dataTypeIds && request.instanceId
      ? this.dataEntryService.getAllByDataTypeIds(request.instanceId, request.dataTypeIds)
      : of(undefined)
  });

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({ request }) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of(undefined)
  });

  private addFormField(dataTypeField: DataTypeField, configurationField?: ImportConfigurationField) {
    this.form.controls.fields.push(this.createFormField(dataTypeField, configurationField));
  }

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        summary: this.translateService.instant('action.import-configuration.summary'),
        severity: 'success',
        closable: true
      });
      if (this.configurationId()) {
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../', id], { relativeTo: this.route });
      }
    } else {
      this.messages.set({ error: [message] });
    }
  }

  private createFormField(dataTypeField?: DataTypeField, configurationField?: ImportConfigurationField) {
    return this.formBuilder.group({
      dataTypeFieldId: [dataTypeField?.id, [Validators.required]],
      defaultValue: [configurationField?.defaultValue || dataTypeField?.defaultValue],
      id: [configurationField?.id],
      type: [dataTypeField?.type, [Validators.required]]
    });
  }

  private create(request: ImportConfigurationCreateRequest) {
    this.importConfigurationService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult(this.translateService.instant("action.import-configuration.created"), value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private createForm(configuration?: ImportConfigurationJoined) {
    const form = this.formBuilder.group({
      dataTypeId: [configuration?.dataTypeId, [Validators.required]],
      fields: this.formBuilder.array(
        configuration?.fields.map(_ => this.createFormField(undefined, undefined)) || []
      ),
      id: [configuration?.id],
      name: [configuration?.name, [Validators.required]]
    });

    form.controls.fields.clear();

    return form;
  }

  private edit(request: ImportConfigurationEditRequest) {
    this.importConfigurationService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.consumeResult(this.translateService.instant("action.import-configuration.edited")),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private patchFormValues(configuration: ImportConfigurationJoined) {
    this.form.reset();
    this.form.patchValue({
      dataTypeId: configuration.dataTypeId,
      id: configuration.id,
      name: configuration.name
    });
    this.changeFormFieldsByConfiguration(configuration.dataType, configuration);
  }

  protected changeFormFields(dataTypeId: number, configuration?: ImportConfigurationJoined) {
    const dataType = this.configuration.value()?.dataType || this.dataTypes.value()
      ?.find(dt => dt.id === dataTypeId);
    if (dataType) {
      this.changeFormFieldsByConfiguration(dataType, configuration);
    }
  }

  protected changeFormFieldsByConfiguration(dataType: DataType, configuration?: ImportConfigurationJoined) {
    this.form.controls.fields.clear();

    if (configuration) {
      configuration?.fields
        .sort((a, b) => a.order - b.order)
        .forEach(field => {
          const dataTypeField = dataType.fields.find(dtField => dtField.id === field.dataTypeFieldId);
          if (dataTypeField) {
            this.addFormField(dataTypeField, field);
          }
        });
    } else {
      dataType.fields.forEach(field => this.addFormField(field));
    }
  }

  protected getDataEntries(index: number): Signal<{ id: number, label: string }[]> {
    return computed(() => {
      const dataTypeId = this.form.value.dataTypeId;
      let dataType = this.configuration.value()?.dataType;

      if (dataType?.id !== dataTypeId) {
        dataType = this.dataTypes.value()?.find(dataType => dataType.id === dataTypeId);
      }

      const dataTypeFieldId = this.form.controls.fields.at(index)?.value?.dataTypeFieldId as number | undefined;

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

  protected getFieldType(index: number) {
    return this.form.controls.fields.at(index).get('type')!.value as FieldType;
  }

  protected getFieldName(index: number) {
    const field = this.form.controls.fields.at(index).get('dataTypeFieldId')!.value;
    const dataType = this.dataTypes.value()!.find(dt => dt.id === this.form.value.dataTypeId)!;
    return dataType.fields.find(df => df.id === field)?.name || "";
  }

  protected moveField(index: number, value: number) {
    const fields = this.form.controls.fields;
    const field = fields.at(index);

    if (index + value < 0 || index + value >= fields.length) {
      return;
    }

    fields.removeAt(index);
    fields.insert(index + value, field);
    fields.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["error.fill-all-fields."] });
      return;
    }

    const request: ImportConfigurationEditRequest = {
      importConfiguration: {
        dataTypeId: this.form.value.dataTypeId!,
        fields: this.form.value.fields!.map((it, index) => ({
          dataTypeFieldId: it.dataTypeFieldId!,
          defaultValue: it.defaultValue,
          id: it.id ?? 0,
          order: index
        })),
        id: this.form.value.id || 0,
        name: this.form.value.name!
      },
      instanceId: NumberUtil.parse(this.instanceId())!
    };

    if (this.configurationId()) {
      this.edit(request);
    } else {
      this.create(request);
    }
  }
}
