import {Component, inject, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {Message} from 'primeng/message';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {Router, RouterLink} from '@angular/router';
import {TableModule} from 'primeng/table';
import {DataTypeService} from '../../service/data-type.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {InstanceService} from '../../service/instance.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';
import Messages from '../../model/messages.model';
import DataType from '../../model/data-type.model';

@Component({
  selector: 'data-type-page',
  templateUrl: './data-type-page.component.html',
  imports: [Button, ConfirmationComponent, Message, MessagesShowcaseComponent, RouterLink, TableModule],
  providers: []
})
export class DataTypePageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly instanceService = inject(InstanceService);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly messages = signal<Messages>({});

  protected delete(dataType: DataType) {
    this.confirmationComponent().request(() => {
      this.dataTypeService
        .delete(this.instanceId()!, dataType.id)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Data type deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(dataType?: DataType) {
    this.router.navigate(
      ['home/workspace/data-type/' + (dataType ? `${dataType.id}/edit` : 'create')]
    );
  }

  protected preview(dataType: DataType) {
    this.router.navigate(['home/workspace/data-type/' + dataType.id]);
  }
}
