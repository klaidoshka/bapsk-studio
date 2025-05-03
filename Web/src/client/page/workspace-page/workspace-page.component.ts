import {Component, computed, inject, signal} from '@angular/core';
import {DataTypeService} from '../../service/data-type.service';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {
  InstanceSelectorComponent
} from '../../component/instance-selector/instance-selector.component';
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';

@Component({
  selector: 'workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [DropdownModule, FormsModule, RouterOutlet, InstanceSelectorComponent, RouterLink, RouterLinkActive, Button, Dialog, LoadingSpinnerComponent, LoadingSpinnerComponent],
  providers: []
})
export class WorkspacePageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly instanceService = inject(InstanceService);
  private readonly router = inject(Router);
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly instanceName = computed(() => this.instanceService.getActiveInstance()()?.name);
  protected readonly isLoading = this.instanceService.getLoadingState();
  protected readonly isMobileSidebarOpen = signal<boolean>(true);

  protected readonly dataTypes = rxResource({
    request: () => ({instanceId: this.instanceId()}),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  protected exit() {
    this.router.navigate(['/home/workspace']);
    this.instanceService.setActiveInstance(undefined);
  }
}
