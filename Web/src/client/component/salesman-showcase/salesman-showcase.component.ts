import {Component, inject, input, signal, viewChild} from '@angular/core';
import Salesman from '../../model/salesman.model';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {SalesmanManagementComponent} from '../salesman-management/salesman-management.component';
import Messages from '../../model/messages.model';
import {SalesmanPreviewComponent} from '../salesman-preview/salesman-preview.component';
import {SalesmanService} from '../../service/salesman.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import {getIsoCountryLabel} from '../../model/iso-country.model';

@Component({
  selector: 'salesman-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    SalesmanManagementComponent,
    SalesmanPreviewComponent
  ],
  templateUrl: './salesman-showcase.component.html',
  styles: ``
})
export class SalesmanShowcaseComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly salesmanService = inject(SalesmanService);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  instanceId = input.required<number>();
  managementMenu = viewChild.required(SalesmanManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(SalesmanPreviewComponent);
  salesmen = input.required<Salesman[]>();

  protected readonly getCountryLabel = getIsoCountryLabel;

  delete(salesman: Salesman) {
    this.confirmationComponent().request(() => {
      this.salesmanService.delete(this.instanceId(), salesman.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Salesman deleted successfully']}),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  showManagement(salesman: Salesman | null) {
    this.managementMenu().show(salesman);
  }

  showPreview(salesman: Salesman) {
    this.previewMenu().show(salesman);
  }
}
