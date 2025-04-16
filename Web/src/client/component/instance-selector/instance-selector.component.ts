import {Component, effect, Signal, viewChild, ViewEncapsulation, WritableSignal} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import Instance from '../../model/instance.model';
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InstanceManagementComponent} from '../instance-management/instance-management.component';
import {Select} from 'primeng/select';

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
  instances!: Signal<Instance[]>;
  managementMenu = viewChild.required(InstanceManagementComponent);
  selectedInstance!: WritableSignal<Instance | undefined>;

  constructor(
    private instanceService: InstanceService
  ) {
    this.instances = this.instanceService.getAsSignal();
    this.selectedInstance = this.instanceService.getActiveInstance();

    effect(() => {
      if (this.instances().length == 1) {
        this.selectInstance(this.instances()[0]);
      }
    });
  }

  readonly selectInstance = (instance: Instance | null) => {
    if (this.selectedInstance() !== instance && instance !== null) {
      this.instanceService.setActiveInstance(instance);
    }
  }

  readonly showManagementMenu = () => {
    this.managementMenu().show();
  }
}
