import {Component, inject, OnInit, signal} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DataTypeService} from '../../service/data-type.service';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import DataTypeField, {fieldTypes} from '../../model/data-type-field.model';
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
import {ButtonDirective} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {InputText} from 'primeng/inputtext';
import {NgForOf} from '@angular/common';
import {Textarea} from 'primeng/textarea';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-data-type-page',
  templateUrl: './data-type-page.component.html',
  imports: [
    FormsModule,
    DropdownModule,
    ButtonDirective,
    Dialog,
    TableModule,
    ConfirmDialog,
    InputText,
    NgForOf,
    ReactiveFormsModule,
    Textarea,
    Toast
  ],
  providers: [ConfirmationService, MessageService]
})
export class DataTypePageComponent implements OnInit {
  private authService = inject(AuthService);
  private confirmationService = inject(ConfirmationService);
  private dataTypeService = inject(DataTypeService);
  private formBuilder = inject(FormBuilder);
  private instanceService = inject(InstanceService);
  private messageService = inject(MessageService);

  form!: FormGroup;
  dataTypes: DataType[] = [];
  instances: Instance[] = [];
  selectedInstance = signal<Instance | null>(null);
  editableDataType = signal<DataType | null>(null);
  displayDialog = signal<boolean>(false);
  fieldTypes = fieldTypes;

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
      name: ["", Validators.required],
      description: [""],
      fields: this.formBuilder.array<DataTypeField>([])
    });
  }

  get fields(): FormArray {
    return this.form.get('fields') as FormArray;
  }

  addField(field?: DataTypeField) {
    this.fields.push(this.createFieldGroup(field));
  }

  createFieldGroup(field?: DataTypeField): FormGroup {
    return this.formBuilder.group({
      dataTypeFieldId: [field ? field.id : null],
      name: [field ? field.name : '', Validators.required],
      type: [field ? field.type : '', Validators.required],
      isRequired: [field ? field.isRequired : false],
      defaultValue: [field ? field.defaultValue : null]
    });
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  openCreation() {
    this.resetForm();
    this.displayDialog.set(true);
  }

  openEdit(dataType: DataType) {
    this.form.patchValue({
      ...dataType
    });
    this.fields.clear();
    this.editableDataType.set(dataType);
    dataType.fields?.forEach(field => this.addField(field));
    this.displayDialog.set(true);
  }

  saveDataType() {
    if (!this.form.valid) {
      return;
    }

    const dataType: DataType = this.form.value;

    if (this.editableDataType() != null) {
      this.editDataType(dataType);
    } else {
      this.createDataType(dataType);
    }
  }

  editDataType(dataType: DataType) {
    const editRequest: DataTypeEditRequest = {
      ...dataType,
      fields: dataType.fields?.map(field => ({
        ...field,
        dataTypeFieldId: (field as any).dataTypeFieldId,
      })) || [],
      dataTypeId: this.editableDataType()!.id!
    };

    this.dataTypeService.edit(editRequest).subscribe(() => {
      this.loadDataTypes(this.selectedInstance());

      this.displayDialog.set(false);

      this.messageService.add({
        key: "data-type-page",
        severity: 'success',
        summary: 'Success',
        detail: 'Data type edited'
      });
    });
  }

  createDataType(dataType: DataType) {
    const createRequest: DataTypeCreateRequest = {
      ...dataType,
      instanceId: this.selectedInstance()!.id!,
      fields: dataType.fields?.map(field => ({
        dataTypeId: dataType.id,
        defaultValue: field.defaultValue,
        instanceId: dataType.instanceId,
        isRequired: field.isRequired,
        name: field.name,
        type: field.type
      })) || []
    };

    this.dataTypeService.create(createRequest).subscribe(() => {
      this.loadDataTypes(this.selectedInstance());

      this.displayDialog.set(false);

      this.messageService.add({
        key: "data-type-page",
        severity: 'success',
        summary: 'Success',
        detail: 'Data type created'
      });
    });
  }

  deleteDataType(dataType: DataType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data type?',
      accept: () => {
        this.dataTypeService.delete(dataType.id!).subscribe(() => {
          this.loadDataTypes(this.selectedInstance());

          this.messageService.add({
            key: "data-type-page",
            severity: 'success',
            summary: 'Success',
            detail: 'Data type deleted'
          });
        });
      }
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

  selectInstance(instance: Instance | null) {
    this.selectedInstance.set(instance);
    this.loadDataTypes(instance);
  }

  resetForm() {
    this.form.reset();
    this.fields.clear();
    this.editableDataType.set(null);
  }
}
