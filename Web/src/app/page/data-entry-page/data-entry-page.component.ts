import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DataEntryService} from '../../service/data-entry.service';
import DataEntry, {
  DataEntryCreateRequest,
  DataEntryEditRequest
} from '../../model/data-entry.model';
import DataEntryField from '../../model/data-entry-field.model';
import Instance from '../../model/instance.model';
import {InstanceService} from '../../service/instance.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import DataType from '../../model/data-type.model';
import {DataTypeService} from '../../service/data-type.service';
import {ButtonDirective} from 'primeng/button';
import {Toast} from 'primeng/toast';
import {NgForOf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-data-entry-page',
  templateUrl: './data-entry-page.component.html',
  imports: [
    FormsModule,
    DropdownModule,
    TableModule,
    ReactiveFormsModule,
    ButtonDirective,
    Toast,
    NgForOf,
    Dialog,
    InputText
  ],
  providers: [ConfirmationService, MessageService]
})
export class DataEntryPageComponent implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private dataEntryService = inject(DataEntryService);
  private dataTypeService = inject(DataTypeService);
  private formBuilder = inject(FormBuilder);
  private instanceService = inject(InstanceService);
  private messageService = inject(MessageService);

  form!: FormGroup;
  dataEntries: DataEntry[] = [];
  dataTypes: DataType[] = [];
  instances: Instance[] = [];
  selectedDataType = signal<DataType | null>(null);
  selectedInstance = signal<Instance | null>(null);
  editableDataEntry = signal<DataEntry | null>(null);
  displayDialog = signal<boolean>(false);

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (!user) {
        return;
      }

      this.instanceService.getByUser().subscribe((instances) => {
        this.instances = instances;
      });
    });

    this.form = this.formBuilder.group({
      id: null,
      fields: this.formBuilder.array([])
    });
  }

  get fields(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  addField(field: DataEntryField | null) {
    this.fields.push(this.createFieldGroup(field));
  }

  createFieldGroup(field: DataEntryField | null): FormGroup {
    return this.formBuilder.group({
      id: [field?.id || null],
      dataTypeFieldId: [field?.dataTypeFieldId || null],
      value: [field?.value, Validators.required]
    });
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  openCreation() {
    this.resetForm();
    this.displayDialog.set(true);
  }

  openEdit(dataEntry: DataEntry) {
    this.form.patchValue({id: dataEntry.id});
    this.fields.clear();
    this.editableDataEntry.set(dataEntry);
    dataEntry.fields?.forEach(field => this.addField(field));
    this.displayDialog.set(true);
  }

  saveDataEntry() {
    if (!this.form.valid) {
      return;
    }

    const dataEntry: DataEntry = this.form.value;

    if (this.editableDataEntry() != null) {
      this.editDataEntry(dataEntry);
    } else {
      this.createDataEntry(dataEntry);
    }
  }

  editDataEntry(dataEntry: DataEntry) {
    const editRequest: DataEntryEditRequest = {
      dataEntryId: dataEntry.id,
      fields: dataEntry.fields.map(field => ({
        dataEntryFieldId: field.id,
        dataTypeFieldId: field.dataTypeFieldId,
        id: field.id,
        value: field.value
      }))
    };

    this.dataEntryService.edit(editRequest).subscribe(() => {
      this.loadDataEntries(this.selectedDataType());

      this.displayDialog.set(false);

      this.messageService.add({
        key: "data-entry-page",
        severity: 'success',
        summary: 'Success',
        detail: 'Data entry edited'
      });
    });
  }

  createDataEntry(dataEntry: DataEntry) {
    const createRequest: DataEntryCreateRequest = {
      dataTypeId: this.selectedDataType()!.id!,
      fields: dataEntry.fields
    };

    this.dataEntryService.create(createRequest).subscribe(() => {
      this.loadDataEntries(this.selectedDataType());

      this.displayDialog.set(false);

      this.messageService.add({
        key: "data-entry-page",
        severity: 'success',
        summary: 'Success',
        detail: 'Data entry created'
      });
    });
  }

  deleteDataEntry(dataEntry: DataEntry) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data type?',
      accept: () => {
        this.dataEntryService.delete(dataEntry.id!).subscribe(() => {
          this.loadDataEntries(this.selectedDataType());

          this.messageService.add({
            key: "data-entry-page",
            severity: 'success',
            summary: 'Success',
            detail: 'Data entry deleted'
          });
        });
      }
    });
  }

  loadDataEntries(dataType: DataType | null) {
    if (dataType == null || dataType.id == null) {
      this.dataEntries = [];
      return;
    }

    this.dataEntryService.getByDataTypeId(dataType.id).subscribe((dataEntries) => {
      this.dataEntries = dataEntries;
    });
  }

  loadDataTypes(instance: Instance | null) {
    if (instance == null || instance.id == null) {
      this.dataTypes = [];
      return;
    }

    this.dataTypeService.getByInstanceId(instance.id).subscribe((dataTypes) => {
      this.dataTypes = dataTypes;
    });
  }

  selectDataType(dataType: DataType | null) {
    this.selectedDataType.set(dataType);
    this.loadDataEntries(dataType);
  }

  selectInstance(instance: Instance | null) {
    this.selectedInstance.set(instance);
    this.loadDataTypes(instance);
  }

  resetForm() {
    this.form.reset();
    this.fields.clear();
    this.editableDataEntry.set(null);
  }
}
