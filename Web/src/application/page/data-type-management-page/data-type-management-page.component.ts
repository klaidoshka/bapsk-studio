import {Component, inject, input, OnDestroy, signal} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import {DataTypeService} from '../../service/data-type.service';
import {MessageHandlingService} from '../../service/message-handling.service';
import {AbstractControl, FormArray, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {debounceTime, first, of, Subscription, tap} from 'rxjs';
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
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {ReportTemplateService} from '../../service/report-template.service';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Dialog} from 'primeng/dialog';
import Option from '../../model/options.model';

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
    TableModule,
    TranslatePipe,
    Dialog
  ],
  templateUrl: './data-type-management-page.component.html',
  styles: ``
})
export class DataTypeManagementPageComponent implements OnDestroy {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly reportTemplateService = inject(ReportTemplateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  private fieldNameSubscriptions = new Map<number, Subscription>();
  protected readonly dataTypeId = input<number | undefined, string>(undefined, { transform: v => NumberUtil.parse(v) });
  protected readonly form = this.createForm();
  protected readonly instanceId = input.required<number | undefined, string>({ transform: v => NumberUtil.parse(v) });
  protected readonly messages = signal<Messages>({});
  protected readonly FieldType = FieldType;

  protected readonly fieldTypes = fieldTypes.map(fieldType => ({
    ...fieldType,
    label: this.translateService.instant(fieldType.label)
  }));

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: this.dataTypeId(),
      instanceId: this.instanceId()
    }),
    loader: ({ request }) =>
      request.dataTypeId && request.instanceId
        ? this.dataTypeService
          .getById(request.instanceId, request.dataTypeId)
          .pipe(tap(dataType => this.patchFormValues(dataType)))
        : of(undefined).pipe(tap(() => this.addField()))
  });

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({ request }) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of(undefined)
  });

  protected readonly displayFields = signal<Option<number>[]>([{ label: 'ID', value: -1 }]);

  ngOnDestroy() {
    this.fieldNameSubscriptions.forEach(sub => sub.unsubscribe());
    this.fieldNameSubscriptions.clear();
  }

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        summary: this.translateService.instant('action.data-type.summary'),
        severity: 'success',
        closable: true
      });
      if (this.dataTypeId()) {
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../', id], { relativeTo: this.route });
      }
    } else {
      this.messages.set({ error: [message] });
    }
  }

  private create(request: DataTypeCreateRequest) {
    this.dataTypeService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult(this.translateService.instant("action.data-type.created"), value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
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
        referencedTypeDialogVisible: [false as boolean],
        type: [null as FieldType | null]
      })
    ], [this.fieldsValidator]);

    fields.clear();

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
          const instanceId = this.instanceId()!;
          this.consumeResult(this.translateService.instant("action.data-type.edited"));
          this.dataEntryService.unmarkDataTypeIdAsFetched(request.dataTypeId);

          this.dataEntryService
            .getAllByDataTypeId(instanceId, request.dataTypeId)
            .pipe(first())
            .subscribe();

          this.importConfigurationService.unmarkDataTypeIdAsFetched(request.dataTypeId);

          this.importConfigurationService
            .getAllByDataTypeId(instanceId, request.dataTypeId)
            .pipe(first())
            .subscribe();

          this.reportTemplateService.unmarkInstanceIdAsFetched(instanceId)

          this.reportTemplateService
            .getAllByDataTypeId(instanceId, request.dataTypeId)
            .pipe(first())
            .subscribe();
        },
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private fieldsValidator(control: AbstractControl): ValidationErrors | null {
    return (control as FormArray).length === 0 ? { "data-type-management.no-fields": true } : null;
  };

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

    dataType.fields.forEach(field => this.addField(field));
    this.updateDisplayFields();
    this.form.markAsPristine();
  }

  protected addField(field?: DataTypeField) {
    const fieldGroup = this.formBuilder.group({
      dataTypeFieldId: [field?.id],
      defaultValue: [field?.defaultValue],
      isRequired: [field?.isRequired || false, [Validators.required]],
      name: [field?.name || '', [Validators.required]],
      referencedType: [field?.referenceId || null, field?.type === FieldType.Reference ? [Validators.required] : []],
      referencedTypeDialogVisible: [false as boolean],
      type: [field?.type || FieldType.Text, [Validators.required]]
    })

    this.form.controls.fields.push(fieldGroup);

    const sub = fieldGroup.controls.name.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.updateDisplayFields();
    });

    this.fieldNameSubscriptions.set(this.form.controls.fields.length, sub);
    this.form.markAsDirty();
  }

  protected clearDefaultValue(index: number) {
    const field = this.form.controls.fields.at(index);
    if (field) {
      field.patchValue({ defaultValue: undefined });
      field.markAsDirty();
    }
  }

  protected getFieldType(id: number): FieldType {
    return this.form.controls.fields.controls.at(id)?.value?.type || FieldType.Text;
  }

  protected removeField(index: number) {
    this.form.controls.fields.removeAt(index);

    this.updateDisplayFields();

    this.fieldNameSubscriptions.get(index)?.unsubscribe();
    this.fieldNameSubscriptions.delete(index);
    this.fieldNameSubscriptions = new Map(
      Array.from(this.fieldNameSubscriptions.entries()).map(([i, sub]) => [i > index ? i - 1 : i, sub])
    );

    const displayFieldIndex = this.form.get('displayField')?.value;

    if (displayFieldIndex === index) {
      this.form.get('displayField')?.setValue(null);
    }

    this.form.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["error.fill-all-fields."] });
      return;
    }

    const request: DataTypeEditRequest = {
      name: this.form.value.name || '',
      description: this.form.value.description || null,
      displayFieldIndex: this.form.value.displayField === -1 ? undefined : this.form.value.displayField!,
      dataTypeId: this.dataType.value()?.id || 0,
      fields: this.form.controls.fields.controls.map(field => {
        const fieldType = field.value.type;
        return {
          dataTypeFieldId: field.value.dataTypeFieldId,
          name: field.value.name,
          type: fieldType,
          defaultValue: field.value.defaultValue,
          referenceId: fieldType === FieldType.Reference ? field.value.referencedType : null,
          isRequired: field.value.isRequired
        } as DataTypeFieldEditRequest;
      }),
      instanceId: this.instanceId()!
    };

    if (this.dataType.value()) {
      this.edit(request);
    } else {
      this.create({
        ...request,
        instanceId: this.instanceId()!
      });
    }
  }

  private updateDisplayFields() {
    const displayFields = this.form.controls.fields.controls.map((control, index) => ({
      label: control.value.name || `#${index + 1}`,
      value: index
    }));

    this.displayFields.update(old => [old.at(0)!, ...displayFields]);
  }
}
