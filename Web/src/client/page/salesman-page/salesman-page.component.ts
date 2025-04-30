import {Component, inject, signal, viewChild} from '@angular/core';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {SalesmanService} from '../../service/salesman.service';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import Messages from '../../model/messages.model';
import Salesman from '../../model/salesman.model';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {first, of} from 'rxjs';
import {Router} from '@angular/router';
import {InstanceService} from '../../service/instance.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';

@Component({
  selector: 'salesman-page',
  imports: [
    Button,
    TableModule,
    ConfirmationComponent,
    MessagesShowcaseComponent
  ],
  templateUrl: './salesman-page.component.html',
  styles: ``
})
export class SalesmanPageComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly instanceService = inject(InstanceService);
  private readonly router = inject(Router);
  private readonly salesmanService = inject(SalesmanService);
  protected readonly getCountryLabel = getIsoCountryLabel;
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly messages = signal<Messages>({});

  protected readonly salesmen = rxResource({
    request: () => ({instanceId: this.instanceId()}),
    loader: ({request}) => request.instanceId
      ? this.salesmanService.getAllByInstanceId(request.instanceId)
      : of(undefined)
  });

  protected delete(salesman: Salesman) {
    this.confirmationComponent().request(() => {
      this.salesmanService
        .delete(this.instanceId()!, salesman.id!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Salesman deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(salesman?: Salesman) {
    this.router.navigate(['/home/workspace/salesman/' + (salesman ? `${salesman.id}/edit` : 'create')]);
  }

  protected preview(salesman: Salesman) {
    this.router.navigate(['/home/workspace/salesman/' + salesman.id]);
  }
}
