import {Component, computed, inject, input, Signal, signal} from '@angular/core';
import {DataEntryService} from '../../service/data-entry.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {InstanceService} from '../../service/instance.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import DataEntry, {
  DataEntryCreateRequest,
  DataEntryEditRequest
} from '../../model/data-entry.model';
import {rxResource} from '@angular/core/rxjs-interop';
import DataType from '../../model/data-type.model';
import Messages from '../../model/messages.model';
import {first, of, tap} from 'rxjs';
import {FieldType} from '../../model/data-type-field.model';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {Select} from 'primeng/select';
import {
  DataTypeEntryFieldInputComponent
} from '../../component/data-type-entry-field-input/data-type-entry-field-input.component';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {Button} from 'primeng/button';
import {NumberUtil} from '../../util/number.util';
import {DataTypeService} from '../../service/data-type.service';

@Component({
  selector: 'data-entry-management-page',
  imports: [
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select,
    DataTypeEntryFieldInputComponent,
    FormInputErrorComponent,
    Button
  ],
  templateUrl: './data-entry-management-page.component.html',
  styles: ``
})
export class DataEntryManagementPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  protected readonly FieldType = FieldType;
  protected readonly dataEntryId = input<string>();
  protected readonly form = this.createForm();
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly messages = signal<Messages>({});

  protected readonly dataEntry = rxResource({
    request: () => ({
      dataEntryId: NumberUtil.parse(this.dataEntryId()),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataEntryId && request.instanceId
      ? this.dataEntryService.getById(request.instanceId, request.dataEntryId)
      : of(undefined)
  });

  protected readonly dataType = rxResource({
    request: () => ({
      dataEntry: this.dataEntry.value(),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataEntry?.dataTypeId && request.instanceId
      ? this.dataTypeService
        .getById(request.instanceId, request.dataEntry.dataTypeId)
        .pipe(
          tap(dataType => this.patchFormValues(dataType, request.dataEntry!))
        )
      : of(undefined)
  });

  protected readonly dataEntries = rxResource({
    request: () => ({
      dataTypeIds: this.dataType.value()?.fields
        .map(field => field.referenceId)
        .filter(id => id != null),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataTypeIds && request.instanceId
      ? this.dataEntryService.getAllByDataTypeIds(request.instanceId, request.dataTypeIds)
      : of(undefined)
  });

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

  private patchFormValues(dataType: DataType, dataEntry: DataEntry) {
    this.form.patchValue({
      values: dataType.fields.map((field) => {
        const entryField = dataEntry.fields.find((ef) => ef.dataTypeFieldId === field.id);
        return {
          name: field.name,
          value: entryField?.value
        };
      })
    });
  }

  private create(request: DataEntryCreateRequest) {
    this.dataEntryService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data entry has been created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: DataEntryEditRequest) {
    this.dataEntryService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data entry has been edited successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  protected get formFields() {
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
        fields: this.formFields.map(field => {
          const candidate = this.dataEntry.value()!.fields.find(dataEntryField =>
            dataEntryField.dataTypeFieldId === field.dataTypeFieldId
          )!;

          return {
            dataEntryFieldId: candidate.id,
            dataTypeFieldId: field.dataTypeFieldId!,
            value: field.control.value.value
          };
        }),
        instanceId: this.instanceId()!
      });
    } else {
      this.create({
        dataTypeId: this.dataType.value()!.id,
        fields: this.dataType.value()!.fields.map((dataTypeField, _) => {
          return {
            dataTypeFieldId: dataTypeField.id,
            value: this.formFields.find(f => f.field === dataTypeField.name)!.control!.value.value
          };
        }),
        instanceId: this.instanceId()!
      });
    }
  }
}
