import {Component, computed, effect, Signal, signal, untracked} from '@angular/core';
import {
  DataEntryShowcaseComponent
} from '../../component/data-entry-showcase/data-entry-showcase.component';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import DataType from '../../model/data-type.model';
import {Message} from 'primeng/message';
import {CustomerService} from '../../service/customer.service';
import {SaleService} from '../../service/sale.service';
import {SalesmanService} from '../../service/salesman.service';
import {WorkspaceType} from './workspace-selector.model';
import Customer from '../../model/customer.model';
import Sale from '../../model/sale.model';
import Salesman from '../../model/salesman.model';
import {
  CustomerShowcaseComponent
} from '../../component/customer-showcase/customer-showcase.component';
import {
  SalesmanShowcaseComponent
} from '../../component/salesman-showcase/salesman-showcase.component';
import {NgForOf, NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {SaleShowcaseComponent} from '../../component/sale-showcase/sale-showcase.component';
import {Select} from 'primeng/select';
import VatReturnDeclaration from '../../model/vat-return.model';
import {VatReturnService} from '../../service/vat-return.service';
import {
  VatReturnDeclarationShowcaseComponent
} from '../../component/vat-return-declaration-showcase/vat-return-declaration-showcase.component';

@Component({
  selector: 'app-workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [DataEntryShowcaseComponent, Message, CustomerShowcaseComponent, SalesmanShowcaseComponent, NgIf, NgForOf, DropdownModule, FormsModule, SaleShowcaseComponent, Select, VatReturnDeclarationShowcaseComponent],
  providers: []
})
export class WorkspacePageComponent {
  protected readonly WorkspaceType = WorkspaceType;

  customers!: Signal<Customer[]>;
  dataTypes!: Signal<DataType[]>;
  declarations!: Signal<VatReturnDeclaration[]>;
  instanceId!: Signal<number | null>;
  sales!: Signal<Sale[]>;
  salesmen!: Signal<Salesman[]>;
  selectedDataType = signal<DataType | null>(null);
  selectedWorkspace = signal<WorkspaceType>(WorkspaceType.DataType);

  workspaces = [
    WorkspaceType.Customer, WorkspaceType.Sale, WorkspaceType.Salesman,
    WorkspaceType.VatReturnDeclarations, WorkspaceType.DataType
  ];

  constructor(
    customerService: CustomerService,
    dataTypeService: DataTypeService,
    instanceService: InstanceService,
    saleService: SaleService,
    salesmanService: SalesmanService,
    vatReturnService: VatReturnService
  ) {
    this.instanceId = instanceService.getActiveInstanceId();

    this.customers = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? customerService.getAsSignal(instanceId)() : [];
    });

    this.dataTypes = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? dataTypeService.getAsSignal(instanceId)() : [];
    });

    effect(() => {
      const dataTypes = this.dataTypes();
      const selectedDataTypeId = untracked(() => this.selectedDataType()?.id);
      const workspace = untracked(() => this.selectedWorkspace());

      if (workspace !== WorkspaceType.DataType) {
        return;
      }

      untracked(() => {
        if (dataTypes.length === 0) {
          this.selectedWorkspace.set(WorkspaceType.Customer);
        } else if (dataTypes.findIndex(it => it.id === selectedDataTypeId) === -1) {
          this.selectedDataType.set(dataTypes[0]);
        }
      });
    });

    this.sales = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? saleService.getAsSignal(instanceId)() : [];
    });

    this.salesmen = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? salesmanService.getAsSignal(instanceId)() : [];
    });

    this.declarations = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? vatReturnService.getAsSignal(instanceId)() : [];
    });
  }

  getWorkspaceName(type: WorkspaceType): string {
    switch (type) {
      case WorkspaceType.Customer:
        return 'Customers';
      case WorkspaceType.Sale:
        return 'Sales';
      case WorkspaceType.Salesman:
        return 'Salesmen';
      case WorkspaceType.DataType:
        return 'Data Types (Your data)';
      case WorkspaceType.VatReturnDeclarations:
        return 'VAT Return Declarations';
    }
  }

  selectDataType(dataType?: DataType) {
    if (dataType != null && this.selectedDataType() !== dataType) {
      this.selectedDataType.set(dataType);
    }
  }

  selectWorkspace(workspace: WorkspaceType) {
    if (this.selectedWorkspace() === workspace) {
      return;
    }

    this.selectedDataType.set(null);
    this.selectedWorkspace.set(workspace);
  }
}
