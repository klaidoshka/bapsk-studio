import {Component, Signal, signal, viewChild} from '@angular/core';
import {InstanceManagementComponent} from '../instance-management/instance-management.component';
import {ButtonModule} from 'primeng/button';
import Instance from '../../model/instance.model';
import {InstanceService} from '../../service/instance.service';
import {TableModule} from 'primeng/table';
import Messages from '../../model/messages-model';
import {first} from 'rxjs';
import ErrorResponse from '../../model/error-response.model';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {InstancePreviewComponent} from '../instance-preview/instance-preview.component';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'app-instance-showcase',
  imports: [
    InstanceManagementComponent,
    ButtonModule,
    TableModule,
    MessagesShowcaseComponent,
    InstancePreviewComponent,
    ConfirmationComponent
  ],
  templateUrl: './instance-showcase.component.html',
  styles: ``
})
export class InstanceShowcaseComponent {
  confirmationComponent = viewChild.required(ConfirmationComponent);
  instances!: Signal<Instance[]>
  managementMenu = viewChild.required(InstanceManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(InstancePreviewComponent);

  constructor(
    private instanceService: InstanceService
  ) {
    this.instances = this.instanceService.getAllAsSignal();
  }

  showManagement(instance: Instance | null) {
    this.managementMenu().show(instance);
  }

  showPreview(instance: Instance) {
    this.previewMenu().show(instance);
  }

  delete(instance: Instance) {
    this.confirmationComponent().request(() => {
      this.instanceService.delete(instance.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Instance deleted successfully']}),
        error: (response: ErrorResponse) => this.messages.set({error: response.error.messages})
      });
    });
  }
}
