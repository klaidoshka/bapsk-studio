import {Component, effect, inject, Injector, input, signal} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {DataEntryService} from '../../service/data-entry.service';
import {InstanceService} from '../../service/instance.service';
import {TextService} from '../../service/text.service';
import DataEntry, {
  DataEntryCreateRequest,
  DataEntryEditRequest
} from '../../model/data-entry.model';
import Messages from '../../model/messages.model';
import {combineLatest, first, map} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import DataType from '../../model/data-type.model';
import {FieldType} from '../../model/data-type-field.model';
import {LocalizationService} from '../../service/localization.service';
import {
  DataTypeEntryFieldInputComponent
} from '../data-type-entry-field-input/data-type-entry-field-input.component';
import {Select} from 'primeng/select';
import {NgIf} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';

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
    NgIf
  ],
  templateUrl: './data-entry-management.component.html',
  styles: ``
})
export class DataEntryManagementComponent {
  protected readonly FieldType = FieldType;
  private dataEntryService = inject(DataEntryService);
  private formBuilder = inject(FormBuilder);
  private injector = inject(Injector);
  private instanceService = inject(InstanceService);
  private localizationService = inject(LocalizationService);
  private textService = inject(TextService);

  dataEntry = signal<DataEntry | undefined>(undefined);

  dataEntries = rxResource({
    request: () => ({
      dataTypeIds: this.dataType().fields
        .map(field => field.referenceId)
        .filter(id => id != null)
    }),
    loader: ({request}) => combineLatest(request.dataTypeIds
      .map(id => this.dataEntryService
        .getAllByDataTypeId(id)
        .pipe(
          map(entries => ({
            id,
            values: entries.map(it => ({
              id: it.id,
              label: it.display()
            }))
          }))
        )
      ))
      .pipe(
        map(entries => {
          const map = new Map<number, { label: string, id: number }[]>();

          entries.forEach(entry => {
            const id = entry.id;
            const dataEntries = entry.values;

            if (dataEntries.length > 0) {
              map.set(id, dataEntries);
            }
          });

          return map;
        })
      ),
    injector: this.injector
  });

  dataType = input.required<DataType>();
  form!: FormGroup;
  instanceId = this.instanceService.getActiveInstanceId();
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  constructor() {
    effect(() => {
      this.dataType(); // Init dependency
      this.form = this.createForm();
    });
  }

  private readonly createForm = (dataType?: DataType, dataEntry?: DataEntry): FormGroup => {
    const formGroup = this.formBuilder.group({});

    dataType?.fields?.forEach(tf => {
      const entryField = dataEntry?.fields?.find(ef => ef.dataTypeFieldId === tf.id);

      formGroup.addControl(
        tf.name,
        this.formBuilder.control(
          entryField?.value,
          tf.isRequired ? Validators.required : null
        )
      );
    });

    return formGroup;
  }

  private readonly create = (request: DataEntryCreateRequest) => {
    this.dataEntryService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data entry has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: DataEntryEditRequest) => {
    this.dataEntryService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Data entry has been edited successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly onSuccess = (message: string) => {
    this.messages.set({success: [message]});
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  get formFields() {
    return Object.keys(this.form.controls).map(key => {
        const control = this.form.get(key)!;
        const dataTypeField = this.dataType()!.fields.find(f => f.name === key)!;
        return {
          control: control as FormControl<any>,
          dataTypeFieldId: dataTypeField.id,
          field: key,
          isRequired: dataTypeField.isRequired,
          referenceId: dataTypeField.referenceId,
          type: dataTypeField.type
        };
      }
    );
  }

  getDataEntries(dataTypeId: number) {
    return this.dataEntries.value()?.get(dataTypeId);
  }

  readonly getErrorMessage = (field: string): string | null => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    if (control.errors?.["required"]) {
      return `${this.textService.capitalize(field)} is required.`;
    }

    return null;
  }

  readonly hide = () => {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
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
            dataTypeFieldId: field.dataTypeFieldId,
            value: field.control.value
          };
        })
      });
    } else {
      this.create({
        dataTypeId: this.dataType()!.id,
        fields: this.dataType()!.fields.map((dataTypeField, _) => {
          return {
            dataTypeFieldId: dataTypeField.id,
            value: this.formFields.find(f => f.field === dataTypeField.name)!.control!.value
          };
        })
      });
    }
  }

  readonly show = (dataEntry?: DataEntry) => {
    this.dataEntry.set(dataEntry);
    this.form = this.createForm(this.dataType(), dataEntry);
    this.isShown.set(true);
  }
}
