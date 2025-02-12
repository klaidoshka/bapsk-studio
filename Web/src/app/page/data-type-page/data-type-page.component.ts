import {Component} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DataTypeService} from '../../service/data-type.service';
import DataType, {DataTypeCreateRequest, DataTypeEditRequest} from '../../model/data-type.model';
import DataTypeField, {
  DataTypeFieldCreateRequest,
  DataTypeFieldEditRequest,
  FieldType
} from '../../model/data-type-field.model';
import Instance from '../../model/instance.model';
import {InstanceService} from '../../service/instance.service';
import {DataTypeFieldService} from '../../service/data-type-field.service';
import {FormsModule} from '@angular/forms';
import {Checkbox} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonDirective} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {NgIf} from '@angular/common';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-data-type-page',
  templateUrl: './data-type-page.component.html',
  imports: [
    FormsModule,
    Checkbox,
    DropdownModule,
    ButtonDirective,
    Dialog,
    TableModule,
    NgIf,
    ConfirmDialog,
    InputText
  ],
  styleUrls: ['./data-type-page.component.css']
})
export class DataTypePageComponent {
  dataTypes: DataType[] = [];
  dataTypeFields: DataTypeField[] = [];
  instances: Instance[] = [];
  selectedInstance: Instance | null = null;
  selectedDataType: DataType | null = null;

  name: string = '';
  description: string | null = null;
  displayDialog: boolean = false;
  editingDataType: DataType | null = null;

  fieldName: string = '';
  defaultValue: any = null;
  isRequired: boolean = false;
  type: FieldType = FieldType.Text;
  displayFieldDialog: boolean = false;
  editingDataTypeField: DataTypeField | null = null;

  fieldTypes = [
    {label: 'Check', value: FieldType.Check},
    {label: 'Date', value: FieldType.Date},
    {label: 'Decimal', value: FieldType.Decimal},
    {label: 'DecimalArray', value: FieldType.DecimalArray},
    {label: 'Int', value: FieldType.Int},
    {label: 'IntArray', value: FieldType.IntArray},
    {label: 'Text', value: FieldType.Text},
    {label: 'TextArray', value: FieldType.TextArray}
  ];

  constructor(
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private dataTypeService: DataTypeService,
    private dataTypeFieldService: DataTypeFieldService,
    private instanceService: InstanceService,
    private messageService: MessageService
  ) {
    authService.getUser().subscribe((user) => {
      if (!user) {
        return;
      }

      instanceService.getByUserId(user.id).subscribe((instances) => {
        this.instances = instances;
      });
    });
  }

  openCreation() {
    this.editingDataType = null;
    this.name = '';
    this.description = null;
    this.displayDialog = true;
  }

  openEdit(dataType: DataType) {
    this.editingDataType = dataType;
    this.name = dataType.name;
    this.description = dataType.description;
    this.displayDialog = true;
  }

  saveDataType() {
    if (this.editingDataType) {
      const editRequest: DataTypeEditRequest = {
        id: this.editingDataType.id,
        name: this.name,
        description: this.description
      };
      this.dataTypeService.edit(editRequest).subscribe(() => {
        this.loadDataTypes(this.selectedInstance!.id!);
        this.displayDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data Type updated'
        });
      });
    } else {
      const createRequest: DataTypeCreateRequest = {
        name: this.name,
        description: this.description,
        instanceId: this.selectedInstance!.id!
      };
      this.dataTypeService.create(createRequest).subscribe(() => {
        this.loadDataTypes(this.selectedInstance!.id!);
        this.displayDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data Type created'
        });
      });
    }
  }

  deleteDataType(dataType: DataType) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data type?',
      accept: () => {
        this.dataTypeService.delete(dataType.id).subscribe(() => {
          this.loadDataTypes(this.selectedInstance!.id!);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data Type deleted'
          });
        });
      }
    });
  }

  loadDataTypes(instanceId: number | null) {
    if (!instanceId) {
      this.dataTypes = [];
      return;
    }

    this.dataTypeService.getByInstanceId(instanceId!).subscribe((dataTypes) => {
      this.dataTypes = dataTypes;
    });
  }

  onDataTypeSelect(event: any) {
    this.selectedDataType = event.data;
    this.loadDataTypeFields(this.selectedDataType!.id!);
  }

  openFieldCreation() {
    this.editingDataTypeField = null;
    this.fieldName = '';
    this.defaultValue = null;
    this.isRequired = false;
    this.type = FieldType.Text;
    this.displayFieldDialog = true;
  }

  openFieldEdit(dataTypeField: DataTypeField) {
    this.editingDataTypeField = dataTypeField;
    this.fieldName = dataTypeField.name;
    this.defaultValue = dataTypeField.defaultValue;
    this.isRequired = dataTypeField.isRequired;
    this.type = dataTypeField.type;
    this.displayFieldDialog = true;
  }

  saveDataTypeField() {
    if (this.editingDataTypeField) {
      const editRequest: DataTypeFieldEditRequest = {
        id: this.editingDataTypeField.id,
        name: this.fieldName,
        defaultValue: this.defaultValue,
        isRequired: this.isRequired,
        type: this.type
      };
      this.dataTypeFieldService.edit(editRequest).subscribe(() => {
        this.loadDataTypeFields(this.selectedDataType!.id!);
        this.displayFieldDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data Type Field updated'
        });
      });
    } else {
      const createRequest: DataTypeFieldCreateRequest = {
        dataTypeId: this.selectedDataType!.id!,
        name: this.fieldName,
        defaultValue: this.defaultValue,
        isRequired: this.isRequired,
        type: this.type,
        instanceId: this.selectedInstance!.id!
      };
      this.dataTypeFieldService.create(createRequest).subscribe(() => {
        this.loadDataTypeFields(this.selectedDataType!.id!);
        this.displayFieldDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data Type Field created'
        });
      });
    }
  }

  deleteDataTypeField(dataTypeField: DataTypeField) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this data type field?',
      accept: () => {
        this.dataTypeFieldService.delete(dataTypeField.id).subscribe(() => {
          this.loadDataTypeFields(this.selectedDataType!.id!);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Data Type Field deleted'
          });
        });
      }
    });
  }

  loadDataTypeFields(dataTypeId: number) {
    this.dataTypeFieldService.getByDataTypeId(dataTypeId).subscribe((dataTypeFields) => {
      this.dataTypeFields = dataTypeFields;
    });
  }
}
