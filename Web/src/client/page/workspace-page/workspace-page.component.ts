import {Component, computed, effect, inject, signal, untracked} from '@angular/core';
import {DataEntryShowcaseComponent} from '../../component/data-entry-showcase/data-entry-showcase.component';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import DataType from '../../model/data-type.model';
import {Message} from 'primeng/message';
import {CustomerService} from '../../service/customer.service';
import {SaleService} from '../../service/sale.service';
import {SalesmanService} from '../../service/salesman.service';
import {WorkspaceType} from './workspace-selector.model';
import {CustomerShowcaseComponent} from '../../component/customer-showcase/customer-showcase.component';
import {SalesmanShowcaseComponent} from '../../component/salesman-showcase/salesman-showcase.component';
import {NgForOf, NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {SaleShowcaseComponent} from '../../component/sale-showcase/sale-showcase.component';
import {Select} from 'primeng/select';
import {VatReturnService} from '../../service/vat-return.service';
import {DataEntryService} from '../../service/data-entry.service';
import {HttpClient} from '@angular/common/http';
import {rxResource} from '@angular/core/rxjs-interop';
import {combineLatest, map, of} from 'rxjs';

@Component({
  selector: 'workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [DataEntryShowcaseComponent, Message, CustomerShowcaseComponent, SalesmanShowcaseComponent, NgIf, NgForOf, DropdownModule, FormsModule, SaleShowcaseComponent, Select],
  providers: []
})
export class WorkspacePageComponent {
  protected readonly WorkspaceType = WorkspaceType;
  private customerService = inject(CustomerService);
  private dataEntryService = inject(DataEntryService);
  private dataTypeService = inject(DataTypeService);
  private httpClient = inject(HttpClient);
  private instanceService = inject(InstanceService);
  private saleService = inject(SaleService);
  private salesmanService = inject(SalesmanService);
  private vatReturnService = inject(VatReturnService);

  customers = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({ request }) => request.instanceId
      ? this.customerService.getByInstanceId(request.instanceId)
      : of([])
  })

  error = computed(() => this.dataEntries.error() || this.dataTypes.error());

  dataEntries = rxResource({
    request: () => ({
      dataTypeId: this.selectedDataType()?.id
    }),
    loader: ({ request }) => request.dataTypeId
      ? this.dataEntryService.getAllByDataTypeId(request.dataTypeId)
      : of([])
  });

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({ request }) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  instanceId = this.instanceService.getActiveInstanceId();

  sales = rxResource({
    request: () => ({
      sales: this.instanceId() != null ? this.saleService.getAsSignal(this.instanceId()!)() : []
    }),
    loader: ({ request }) => combineLatest(
      request.sales.map(sale => this.vatReturnService
        .getBySaleId(sale.id)
        .pipe(
          map(declaration => ({
            ...sale,
            vatReturnDeclaration: declaration
          }))
        )
      )
    )
  });

  salesmen = computed(() => {
    const instanceId = this.instanceId();
    return instanceId != null ? this.salesmanService.getAsSignal(instanceId)() : [];
  });

  selectedDataType = signal<DataType | undefined>(undefined);
  selectedWorkspace = signal<WorkspaceType>(WorkspaceType.DataType);

  workspacesPart = [
    WorkspaceType.Customer, WorkspaceType.Salesman, WorkspaceType.Sale
  ];

  constructor() {
    effect(() => {
      const dataTypes = this.dataTypes.value();
      const selectedDataTypeId = untracked(() => this.selectedDataType()?.id);
      const workspace = untracked(() => this.selectedWorkspace());

      if (workspace !== WorkspaceType.DataType) {
        return;
      }

      untracked(() => {
        if (dataTypes?.length === 0) {
          this.selectedWorkspace.set(WorkspaceType.Customer);
        } else if (dataTypes?.findIndex(it => it.id === selectedDataTypeId) === -1) {
          this.selectedDataType.set(dataTypes[0]);
        }
      });
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
    if (dataType && this.selectedDataType() !== dataType) {
      this.selectedDataType.set(dataType);
    }
  }

  selectWorkspace(workspace: WorkspaceType) {
    if (this.selectedWorkspace() === workspace) {
      return;
    }

    const targetDataType = this.dataTypes.value()?.at(0);

    if (workspace == WorkspaceType.DataType && this.selectedDataType() !== targetDataType) {
      this.selectedDataType.set(targetDataType);
    }

    this.selectedWorkspace.set(workspace);
  }
}
