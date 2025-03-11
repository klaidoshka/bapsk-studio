import {Component, effect, Signal, signal, viewChild, WritableSignal} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import Instance from '../../model/instance.model';
import {AuthService} from '../../service/auth.service';
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InstanceManagementComponent} from '../instance-management/instance-management.component';

@Component({
  selector: 'app-instance-selector',
  imports: [
    DropdownModule,
    Button,
    AutoComplete,
    ReactiveFormsModule,
    FormsModule,
    InstanceManagementComponent
  ],
  templateUrl: './instance-selector.component.html',
  styles: ``
})
export class InstanceSelectorComponent {
  filteredInstances = signal<Instance[]>([]);
  instances!: Signal<Instance[]>;
  isAuthenticated!: Signal<boolean>;
  managementMenu = viewChild.required(InstanceManagementComponent);
  selectedInstance!: WritableSignal<Instance | null>;

  constructor(
    private authService: AuthService,
    private instanceService: InstanceService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.instances = this.instanceService.getAsSignal();
    this.selectedInstance = this.instanceService.getActiveInstance();

    effect(() => {
      if (this.instances().length == 1) {
        this.selectInstance(this.instances()[0]);
      }
    });
  }

  filterInstances(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredInstances.set(this.instances().filter((instance) => {
      return instance.name.toLowerCase().includes(query);
    }));
  }

  selectInstance(instance: Instance | null) {
    if (this.selectedInstance() !== instance && instance !== null) {
      this.instanceService.setActiveInstance(instance);
    }
  }

  showManagementMenu() {
    this.managementMenu().show(null);
  }
}
