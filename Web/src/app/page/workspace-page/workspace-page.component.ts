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
import {SaleShowcaseComponent} from '../../component/sale-showcase/sale-showcase.component';
import {
  SalesmanShowcaseComponent
} from '../../component/salesman-showcase/salesman-showcase.component';
import {NgForOf, NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';

@Component({
  selector: 'app-workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [DataEntryShowcaseComponent, Message, CustomerShowcaseComponent, SaleShowcaseComponent, SalesmanShowcaseComponent, NgIf, NgForOf, DropdownModule, FormsModule, AutoComplete],
  providers: []
})
export class WorkspacePageComponent {
  protected readonly WorkspaceType = WorkspaceType;

  customers!: Signal<Customer[]>;
  dataTypes!: Signal<DataType[]>;
  filteredDataTypes = signal<DataType[]>([]);
  instanceId!: Signal<number | null>;
  sales!: Signal<Sale[]>;
  salesmen!: Signal<Salesman[]>;
  selectedDataType = signal<DataType | null>(null);
  workspace = signal<WorkspaceType>(WorkspaceType.DataType);
  workspaces = [WorkspaceType.Customer, WorkspaceType.Sale, WorkspaceType.Salesman, WorkspaceType.DataType];

  constructor(
    private customerService: CustomerService,
    dataTypeService: DataTypeService,
    instanceService: InstanceService,
    private saleService: SaleService,
    private salesmanService: SalesmanService
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
      const workspace = untracked(() => this.workspace());

      if (workspace !== WorkspaceType.DataType) {
        return;
      }

      untracked(() => {
        if (dataTypes.length === 0) {
          this.workspace.set(WorkspaceType.Customer);
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
  }

  filterDataTypes(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredDataTypes.set(
      this.dataTypes().filter(it => it.name.toLowerCase().includes(query))
    );
  }

  getWorkspaceName(type: WorkspaceType): string {
    return WorkspaceType[type];
  }

  selectDataType(dataType?: DataType) {
    if (dataType != null && this.selectedDataType() !== dataType) {
      this.selectedDataType.set(dataType);
    }
  }

  selectWorkspace(workspace: WorkspaceType) {
    if (this.workspace() === workspace) {
      return;
    }

    this.selectedDataType.set(null);
    this.workspace.set(workspace);
  }
}
