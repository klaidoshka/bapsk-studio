import {Component, effect, Signal, signal} from '@angular/core';
import {DropdownModule} from "primeng/dropdown";
import Instance from '../../model/instance.model';
import {AuthService} from '../../service/auth.service';
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-instance-selector',
  imports: [
    DropdownModule,
    Button,
    AutoComplete,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './instance-selector.component.html',
  styles: ``
})
export class InstanceSelectorComponent {
  filteredInstances = signal<Instance[]>([]);
  instances!: Signal<Instance[]>;
  isAuthenticated!: Signal<boolean>;
  selectedInstance!: Signal<Instance | null>;

  constructor(
    private authService: AuthService,
    private instanceService: InstanceService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.instances = this.instanceService.getAllAsSignal();
    this.selectedInstance = this.instanceService.getActiveInstance();

    effect(() => {
      if (this.instances().length == 1) {
        this.selectInstance(this.instances()[0]);
      }
    });
  }

  selectInstance(instance: Instance | null) {
    if (this.selectedInstance() !== instance && instance !== null) {
      this.instanceService.setActiveInstance(instance);
    }
  }

  filterInstances(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();

    this.filteredInstances.set(this.instances().filter((instance) => {
      return instance.name.toLowerCase().includes(query);
    }));
  }
}
