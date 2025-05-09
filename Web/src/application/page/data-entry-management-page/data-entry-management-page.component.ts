import {Component, computed, inject, input, Signal, signal} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageHandlingService} from '../../service/message-handling.service';
import DataEntry, {DataEntryCreateRequest, DataEntryEditRequest} from '../../model/data-entry.model';
import {rxResource} from '@angular/core/rxjs-interop';
import DataType from '../../model/data-type.model';
import Messages from '../../model/messages.model';
import {first, of, tap} from 'rxjs';
import {FieldType} from '../../model/data-type-field.model';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {Select} from 'primeng/select';
import {
  DataTypeEntryFieldInputComponent
} from '../../component/data-type-entry-field-input/data-type-entry-field-input.component';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {Button} from 'primeng/button';
import {NumberUtil} from '../../util/number.util';
import {DataTypeService} from '../../service/data-type.service';
import {
  DataEntryPageHeaderSectionComponent
} from '../../component/data-entry-page-header-section/data-entry-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {FloatLabel} from 'primeng/floatlabel';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'data-entry-management-page',
  imports: [
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select,
    DataTypeEntryFieldInputComponent,
    FormInputErrorComponent,
    Button,
    DataEntryPageHeaderSectionComponent,
    CardComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    FloatLabel
  ],
  templateUrl: './data-entry-management-page.component.html',
  styles: ``
})
export class DataEntryManagementPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly FieldType = FieldType;
  protected readonly dataEntryId = input<string>();
  protected readonly form = this.createForm();
  protected readonly dataTypeId = input.required<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly dataEntry = rxResource({
    request: () => ({
      dataEntryId: NumberUtil.parse(this.dataEntryId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.dataEntryId && request.instanceId
      ? this.dataEntryService.getById(request.instanceId, request.dataEntryId)
      : of(undefined)
  });

  protected readonly dataType = rxResource({
    request: () => ({
      dataEntry: this.dataEntry.value(),
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataTypeService
        .getById(request.instanceId, request.dataTypeId)
        .pipe(tap(dataType => this.patchFormValues(dataType, request.dataEntry)))
      : of(undefined)
  });

  protected readonly dataEntries = rxResource({
    request: () => ({
      dataTypeIds: this.dataType.value()?.fields
        .map(field => field.referenceId)
        .filter(id => id != null),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.dataTypeIds && request.instanceId
      ? this.dataEntryService.getAllByDataTypeIds(request.instanceId, request.dataTypeIds)
      : of(undefined)
  });

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        severity: 'success',
        closable: true
      });
      if (this.dataEntryId()) {
        this.router.navigate(['../'], {relativeTo: this.route});
      } else {
        this.router.navigate(['../', id], {relativeTo: this.route});
      }
    } else {
      this.messages.set({error: [message]});
    }
  }

  private createForm(dataType?: DataType, dataEntry?: DataEntry) {
    return this.formBuilder.group({
      values: this.formBuilder.array(
        dataType?.fields?.map(tf => {
          const entryField = dataEntry?.fields?.find(ef => ef.dataTypeFieldId === tf.id);
          return this.formBuilder.group({
            name: [tf.name, [Validators.required]],
            value: [entryField?.value, tf.isRequired ? [Validators.required] : []]
          });
        }) || []
      )
    });
  }

  private patchFormValues(dataType: DataType, dataEntry?: DataEntry) {
    this.form.reset();

    const values = dataType.fields.map(field => {
      const entryField = dataEntry?.fields.find(ef => ef.dataTypeFieldId === field.id);
      return this.formBuilder.group({
        name: [field.name, [Validators.required]],
        value: [entryField?.value, field.isRequired ? [Validators.required] : []]
      });
    });

    this.form.setControl('values', this.formBuilder.array(values));
  }

  private create(request: DataEntryCreateRequest) {
    this.dataEntryService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult("Data entry has been created successfully.", value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private edit(request: DataEntryEditRequest) {
    this.dataEntryService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.consumeResult("Data entry has been edited successfully."),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  protected formFields() {
    return this.form.controls.values.controls.map(control => {
      const dataTypeField = this.dataType.value()!.fields.find(f => f.name === control.value.name);
      return {
        control: control,
        dataTypeFieldId: dataTypeField?.id,
        field: control.value.name,
        isRequired: dataTypeField?.isRequired,
        referenceId: dataTypeField?.referenceId,
        type: dataTypeField?.type
      };
    });
  }

  protected getDataEntries(dataTypeId?: number | null): Signal<{ id: number, label: string }[]> {
    return computed(() => {
      if (!dataTypeId) {
        return [];
      }

      return this.dataEntries.value()
        ?.get(dataTypeId)
        ?.map(dataEntry => ({
          id: dataEntry.id,
          label: dataEntry.display()
        })) || [];
    });
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    if (this.dataEntry.value()) {
      this.edit({
        dataEntryId: this.dataEntry.value()!.id,
        dataTypeId: this.dataType.value()!.id,
        fields: this.formFields().map(field => {
          const candidate = this.dataEntry.value()!.fields.find(dataEntryField =>
            dataEntryField.dataTypeFieldId === field.dataTypeFieldId
          )!;

          return {
            dataEntryFieldId: candidate.id,
            dataTypeFieldId: field.dataTypeFieldId!,
            value: field.control.value.value
          };
        }),
        instanceId: NumberUtil.parse(this.instanceId())!
      });
    } else {
      this.create({
        dataTypeId: this.dataType.value()!.id,
        fields: this.dataType.value()!.fields.map((dataTypeField, _) => {
          return {
            dataTypeFieldId: dataTypeField.id,
            value: this.formFields().find(f => f.field === dataTypeField.name)!.control!.value.value
          };
        }),
        instanceId: NumberUtil.parse(this.instanceId())!
      });
    }
  }
}
