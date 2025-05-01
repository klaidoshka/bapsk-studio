import {Component, inject, signal, viewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {DatePipe} from '@angular/common';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {rxResource} from '@angular/core/rxjs-interop';
import Messages from '../../model/messages.model';
import Instance, {InstanceWithUsers} from '../../model/instance.model';
import {first} from 'rxjs';
import {Router} from '@angular/router';
import {InstanceService} from '../../service/instance.service';

@Component({
  selector: 'instance-page',
  templateUrl: './instance-page.component.html',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    ConfirmDialogModule,
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent
  ],
  providers: [MessageService, ConfirmationService]
})
export class InstancePageComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly instanceService = inject(InstanceService);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instances = rxResource({loader: () => this.instanceService.getAllWithUsers()})
  protected readonly messages = signal<Messages>({});

  protected delete(instance: Instance) {
    this.confirmationComponent().request(() => {
      this.instanceService
        .delete(instance.id!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Instance deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(instance?: Instance) {
    this.router.navigate(['home/instance/' + (instance ? `${instance.id}/edit` : 'create')]);
  }

  protected preview(instance: InstanceWithUsers) {
    this.router.navigate(['home/instance/' + instance.id]);
  }
}
