import {Component, computed, effect, inject, signal, untracked} from '@angular/core';
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
import {VatReturnService} from '../../service/vat-return.service';
import {DataEntryService} from '../../service/data-entry.service';
import {UserService} from '../../service/user.service';
import {HttpClient} from '@angular/common/http';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';

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
  private userService = inject(UserService);
  private vatReturnService = inject(VatReturnService);

  customers = computed(() => {
    const instanceId = this.instanceId();
    return instanceId != null ? this.customerService.getAsSignal(instanceId)() : [];
  });

  error = computed(() => this.dataEntries.error() || this.dataTypes.error());

  dataEntries = rxResource({
    request: () => ({
      dataTypeId: this.selectedDataType()?.id
    }),
    loader: ({request}) => request.dataTypeId
      ? this.dataEntryService.getAllByDataTypeId(request.dataTypeId)
      : of([])
  });

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  instanceId = this.instanceService.getActiveInstanceId();

  sales = computed(() => {
    const instanceId = this.instanceId();
    const sales = instanceId != null ? this.saleService.getAsSignal(instanceId)() : [];

    return sales.map(sale => {
      const declaration = this.vatReturnService.getBySaleIdAsSignal(instanceId!, sale.id!)();
      return {
        ...sale,
        vatReturnDeclaration: declaration != null
          ? {
            ...declaration,
            declaredBy: computed(() =>
              declaration!.declaredById != null
                ? this.userService.getIdentityByIdAsSignal(declaration!.declaredById!)()
                : undefined
            )()!
          }
          : undefined
      };
    });
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

  selectFile(event: Event) {
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
          const blob = new Blob([result as string], {type: 'text/html'});
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

    const targetDataType = this.dataTypes.value()?.at(0);

    if (workspace == WorkspaceType.DataType && this.selectedDataType() !== targetDataType) {
      this.selectedDataType.set(targetDataType);
    }

    this.selectedWorkspace.set(workspace);
  }
}
