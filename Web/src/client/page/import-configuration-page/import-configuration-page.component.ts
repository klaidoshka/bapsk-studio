import {Component, inject, input, signal, viewChild} from '@angular/core';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {ImportConfigurationJoined} from '../../model/import-configuration.model';
import {Button} from 'primeng/button';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import Messages from '../../model/messages.model';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {NumberUtil} from '../../util/number.util';

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
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly dataTypeId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly configurations = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => {
      if (!request.instanceId) {
        return of([]);
      }

      if (request.dataTypeId) {
        return this.importConfigurationService.getAllByDataTypeId(request.instanceId, request.dataTypeId);
      }

      return this.importConfigurationService.getAllByInstanceId(request.instanceId);
    }
  });

  private changeMessages(message: string, success: boolean = true) {
    this.messages.set(success ? {success: [message]} : {error: [message]});
  }

  protected delete(configuration: ImportConfigurationJoined) {
    this.confirmationComponent().request(() => {
      this.importConfigurationService
        .delete(NumberUtil.parse(this.instanceId())!, configuration.id!)
        .pipe(first())
        .subscribe({
          next: () => this.changeMessages("Import configuration deleted successfully"),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(configuration?: ImportConfigurationJoined) {
    this.router.navigate(
      ['home/workspace/import-configuration/' + (configuration ? `${configuration.id}/edit` : 'create')]
    );
  }

  protected preview(configuration: ImportConfigurationJoined) {
    this.router.navigate([`home/workspace/import-configuration/${configuration.id}`]);
  }
}
