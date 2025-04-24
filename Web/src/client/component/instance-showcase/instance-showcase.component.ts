import {Component, inject, signal, viewChild} from '@angular/core';
import {InstanceManagementComponent} from '../instance-management/instance-management.component';
import {ButtonModule} from 'primeng/button';
import {InstanceWithUsers} from '../../model/instance.model';
import {InstanceService} from '../../service/instance.service';
import {TableModule} from 'primeng/table';
import Messages from '../../model/messages.model';
import {first} from 'rxjs';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {InstancePreviewComponent} from '../instance-preview/instance-preview.component';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {DatePipe} from '@angular/common';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'instance-showcase',
  imports: [
    InstanceManagementComponent,
    ButtonModule,
    TableModule,
    MessagesShowcaseComponent,
    InstancePreviewComponent,
    ConfirmationComponent,
    DatePipe
  ],
  templateUrl: './instance-showcase.component.html',
  styles: ``
})
export class InstanceShowcaseComponent {
  private readonly instanceService = inject(InstanceService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  instances = rxResource({ loader: () => this.instanceService.getAllWithUsers() })
  managementMenu = viewChild.required(InstanceManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(InstancePreviewComponent);

  delete(instance: InstanceWithUsers) {
    this.confirmationComponent().request(() => {
      this.instanceService.delete(instance.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({ success: ['Instance deleted successfully'] }),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  showManagement(instance?: InstanceWithUsers) {
    this.managementMenu().show(instance);
  }

  showPreview(instance: InstanceWithUsers) {
    this.previewMenu().show(instance);
  }
}
