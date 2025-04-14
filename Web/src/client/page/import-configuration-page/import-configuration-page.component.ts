import {Component, inject, signal, viewChild} from '@angular/core';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {ImportConfigurationJoined} from '../../model/import-configuration.model';
import {InstanceService} from '../../service/instance.service';
import {Button} from 'primeng/button';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import Messages from '../../model/messages.model';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';

@Component({
  selector: 'import-configuration-page',
  imports: [
    Button,
    MessagesShowcaseComponent,
    TableModule,
    ConfirmationComponent
  ],
  templateUrl: './import-configuration-page.component.html',
  styles: ``
})
export class ImportConfigurationPageComponent {
  private importConfigurationService = inject(ImportConfigurationService);
  private instanceService = inject(InstanceService);
  private router = inject(Router);

  configurations = rxResource({
    request: () => ({
      instanceId: this.instanceId() === undefined ? undefined : +this.instanceId()!
    }),
    loader: ({request}) => request.instanceId
      ? this.importConfigurationService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  confirmationComponent = viewChild.required(ConfirmationComponent);
  instanceId = this.instanceService.getActiveInstanceId();
  messages = signal<Messages>({});

  private readonly changeMessages = (message: string, success: boolean = true) => {
    this.messages.set(success ? {success: [message]} : {error: [message]});
  }

  readonly delete = (configuration: ImportConfigurationJoined) => {
    this.confirmationComponent()
      .request(() => {
        this.importConfigurationService.delete(configuration.id!)
          .subscribe(() => this.changeMessages("Import configuration deleted successfully"));
      });
  }

  readonly manage = (configuration?: ImportConfigurationJoined) => this.router.navigate(
    ['home/import-configuration/' + (configuration ? `${configuration.id}/edit` : 'create')]
  );

  readonly preview = (configuration: ImportConfigurationJoined) => this.router.navigate([`home/import-configuration/${configuration.id}`]);
}
