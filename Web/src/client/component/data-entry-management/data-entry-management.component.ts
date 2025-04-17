import {Component, computed, effect, inject, input, Signal, signal} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DataEntryService} from '../../service/data-entry.service';
import {InstanceService} from '../../service/instance.service';
import DataEntry, {DataEntryCreateRequest, DataEntryEditRequest} from '../../model/data-entry.model';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import DataType from '../../model/data-type.model';
import {FieldType} from '../../model/data-type-field.model';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {DataTypeEntryFieldInputComponent} from '../data-type-entry-field-input/data-type-entry-field-input.component';
import {Select} from 'primeng/select';
import {NgIf} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'data-entry-management',
  imports: [
    Button,
    Dialog,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    DataTypeEntryFieldInputComponent,
    FormsModule,
    Select,
    NgIf,
    FormInputErrorComponent
  ],
  templateUrl: './data-entry-management.component.html',
  styles: ``
})
export class DataEntryManagementComponent {
  protected readonly FieldType = FieldType;
  private readonly dataEntryService = inject(DataEntryService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);

  dataEntry = signal<DataEntry | undefined>(undefined);

  dataEntries = rxResource({
    request: () => ({
      dataTypeIds: this.dataType().fields
        .map(field => field.referenceId)
        .filter(id => id != null)
    }),
    loader: ({ request }) => this.dataEntryService.getAllByDataTypeIds(request.dataTypeIds)
  });

  dataType = input.required<DataType>();
  form = this.createForm();
  instanceId = this.instanceService.getActiveInstanceId();
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  constructor() {
    effect(() => {
      this.dataType(); // Init dependency
      this.form = this.createForm();
    });
  }

  private createForm(dataType?: DataType, dataEntry?: DataEntry) {
    return this.formBuilder.group({
      values: this.formBuilder.array(
        dataType?.fields?.map(tf => {
          const entryField = dataEntry?.fields?.find(ef => ef.dataTypeFieldId === tf.id);

          return this.formBuilder.group({
            name: [tf.name, [Validators.required]],
            value: [entryField?.value, [tf.isRequired ? Validators.required : null]]
          });
        }) || []
      )
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
    this.messages.set({ success: [message] });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  get formFields() {
    return this.form.controls.values.controls.map(control => {
      const dataTypeField = this.dataType()!.fields.find(f => f.name === control.value.name);
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

  getDataEntries(dataTypeId?: number | null): Signal<{ id: number, label: string }[]> {
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

    if (this.dataEntry() != null) {
      this.edit({
        dataEntryId: this.dataEntry()!.id,
        dataTypeId: this.dataType()!.id,
        fields: this.formFields.map(field => {
          const candidate = this.dataEntry()!.fields.find(dataEntryField => dataEntryField.dataTypeFieldId === field.dataTypeFieldId)!;

          return {
            dataEntryFieldId: candidate.id,
            dataTypeFieldId: field.dataTypeFieldId!,
            value: field.control.value.value
          };
        })
      });
    } else {
      this.create({
        dataTypeId: this.dataType()!.id,
        fields: this.dataType()!.fields.map((dataTypeField, _) => {
          return {
            dataTypeFieldId: dataTypeField.id,
            value: this.formFields.find(f => f.field === dataTypeField.name)!.control!.value.value
          };
        })
      });
    }
  }

  show(dataEntry?: DataEntry) {
    this.dataEntry.set(dataEntry);
    this.form = this.createForm(this.dataType(), dataEntry);
    this.isShown.set(true);
  }

  protected readonly Object = Object;
}
