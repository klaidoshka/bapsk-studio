import {Component, effect, inject, viewChild, ViewEncapsulation} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import Instance from '../../model/instance.model';
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InstanceManagementComponent} from '../instance-management/instance-management.component';
import {Select} from 'primeng/select';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'instance-selector',
  imports: [
    DropdownModule,
    Button,
    ReactiveFormsModule,
    FormsModule,
    InstanceManagementComponent,
    Select
  ],
  templateUrl: './instance-selector.component.html',
  styleUrl: `./instance-selector.component.scss`,
  encapsulation: ViewEncapsulation.None
})
export class InstanceSelectorComponent {
  private readonly instanceService = inject(InstanceService);

  instances = rxResource({ loader: () => this.instanceService.getAll() });
  managementMenu = viewChild.required(InstanceManagementComponent);
  selectedInstance = this.instanceService.getActiveInstance();

  constructor() {
    effect(() => {
      if (this.instances.value()?.length == 1) {
        this.selectInstance(this.instances.value()![0]);
      }
    });
  }

  selectInstance(instance: Instance | null) {
    if (this.selectedInstance() !== instance && instance !== null) {
      this.instanceService.setActiveInstance(instance);
    }
  }

  showManagementMenu() {
    this.managementMenu().show();
  }
}
