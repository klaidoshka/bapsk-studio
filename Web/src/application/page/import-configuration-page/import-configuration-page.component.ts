import {Component, inject, input, signal, viewChild} from '@angular/core';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {ImportConfigurationJoined} from '../../model/import-configuration.model';
import {Button} from 'primeng/button';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import Messages from '../../model/messages.model';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {ActivatedRoute, Router} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';
import {MessageHandlingService} from '../../service/message-handling.service';
import {NumberUtil} from '../../util/number.util';
import {
  ImportConfigurationPageHeaderSectionComponent
} from "../../component/import-configuration-page-header-section/import-configuration-page-header-section.component";
import {CardComponent} from '../../component/card/card.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'import-configuration-page',
  imports: [
    Button,
    MessagesShowcaseComponent,
    TableModule,
    ConfirmationComponent,
    ImportConfigurationPageHeaderSectionComponent,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './import-configuration-page.component.html',
  styles: ``
})
export class ImportConfigurationPageComponent {
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly importConfigurationService = inject(ImportConfigurationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly canGoBack = input<boolean>();
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly dataTypeId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly configurations = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
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

  protected delete(configuration: ImportConfigurationJoined) {
    this.confirmationComponent().request(() => {
      this.importConfigurationService
        .delete(NumberUtil.parse(this.instanceId())!, configuration.id!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['action.import-configuration.deleted']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected manage(configuration?: ImportConfigurationJoined) {
    this.router.navigate(['./' + (configuration ? `${configuration.id}/edit` : 'create')], {relativeTo: this.route});
  }

  protected preview(configuration: ImportConfigurationJoined) {
    this.router.navigate([`./${configuration.id}`], {relativeTo: this.route});
  }
}
