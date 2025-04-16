import {Component, computed, effect, Signal, signal, untracked} from '@angular/core';
import {DataEntryShowcaseComponent} from '../../component/data-entry-showcase/data-entry-showcase.component';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import DataType from '../../model/data-type.model';
import {Message} from 'primeng/message';
import {CustomerService} from '../../service/customer.service';
import {SaleService} from '../../service/sale.service';
import {SalesmanService} from '../../service/salesman.service';
import {WorkspaceType} from './workspace-selector.model';
import Customer from '../../model/customer.model';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';
import Salesman from '../../model/salesman.model';
import {CustomerShowcaseComponent} from '../../component/customer-showcase/customer-showcase.component';
import {SalesmanShowcaseComponent} from '../../component/salesman-showcase/salesman-showcase.component';
import {NgForOf, NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {SaleShowcaseComponent} from '../../component/sale-showcase/sale-showcase.component';
import {Select} from 'primeng/select';
import {VatReturnService} from '../../service/vat-return.service';
import {DataEntryJoined} from '../../model/data-entry.model';
import {DataEntryService} from '../../service/data-entry.service';
import {UserService} from '../../service/user.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [DataEntryShowcaseComponent, Message, CustomerShowcaseComponent, SalesmanShowcaseComponent, NgIf, NgForOf, DropdownModule, FormsModule, SaleShowcaseComponent, Select],
  providers: []
})
export class WorkspacePageComponent {
  protected readonly WorkspaceType = WorkspaceType;

  customers!: Signal<Customer[]>;
  dataEntries!: Signal<DataEntryJoined[]>;
  dataTypes!: Signal<DataType[]>;
  instanceId!: Signal<number | undefined>;
  sales!: Signal<SaleWithVatReturnDeclaration[]>;
  salesmen!: Signal<Salesman[]>;
  selectedDataType = signal<DataType | null>(null);
  selectedWorkspace = signal<WorkspaceType>(WorkspaceType.DataType);

  workspacesPart = [
    WorkspaceType.Customer, WorkspaceType.Salesman, WorkspaceType.Sale
  ];

  constructor(
    private httpClient: HttpClient,

    customerService: CustomerService,
    dataEntryService: DataEntryService,
    dataTypeService: DataTypeService,
    instanceService: InstanceService,
    saleService: SaleService,
    salesmanService: SalesmanService,
    userService: UserService,
    vatReturnService: VatReturnService
  ) {
    this.instanceId = instanceService.getActiveInstanceId();

    this.customers = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? customerService.getAsSignal(instanceId)() : [];
    });

    this.dataEntries = computed(() => {
      const dataTypeId = this.selectedDataType()?.id;
      return dataTypeId == null ? [] : dataEntryService.getAsSignal(dataTypeId)();
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
      const sales = instanceId != null ? saleService.getAsSignal(instanceId)() : [];

      return sales.map(sale => {
        const declaration = vatReturnService.getBySaleIdAsSignal(instanceId!, sale.id!)();
        return {
          ...sale,
          vatReturnDeclaration: declaration != null
            ? {
              ...declaration,
              declaredBy: computed(() =>
                declaration!.declaredById != null
                  ? userService.getIdentityByIdAsSignal(declaration!.declaredById!)()
                  : undefined
              )()!,
            }
            : undefined
        };
      });
    });

    this.salesmen = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? salesmanService.getAsSignal(instanceId)() : [];
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
        return 'Your Data Types';
    }
  }

  selectDataType(dataType?: DataType) {
    if (dataType != null && this.selectedDataType() !== dataType) {
      this.selectedDataType.set(dataType);
    }
  }

  readonly selectFile = (event: Event) => {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (file.type !== 'text/html') {
      alert('Please upload a valid HTML file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.httpClient
      .post(`http://localhost:4000/api/v1/misc/beautify-html-table`, reader.result, {
        headers: {
          'Content-Type': 'text/html'
        },
        responseType: 'text'
      })
      .subscribe((result) => {
        const blob = new Blob([result as string], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = 'beautified.html';
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
      });
    }

    reader.readAsText(file);
  }

  selectWorkspace(workspace: WorkspaceType) {
    if (this.selectedWorkspace() === workspace) {
      return;
    }

    if (workspace == WorkspaceType.DataType) {
      this.selectedDataType.set(this.dataTypes().at(0) || null);
    } else {
      this.selectedDataType.set(null);
    }

    this.selectedWorkspace.set(workspace);
  }
}
