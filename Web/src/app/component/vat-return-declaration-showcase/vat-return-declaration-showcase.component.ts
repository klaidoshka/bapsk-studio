import {Component, input, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import Messages from '../../model/messages.model';
import {LocalizationService} from '../../service/localization.service';
import {first} from 'rxjs';
import VatReturnDeclaration, {
  getSubmitDeclarationStateLabel,
  VatReturnDeclarationSubmitRequest
} from '../../model/vat-return.model';
import {
  VatReturnDeclarationPreviewComponent
} from '../vat-return-declaration-preview/vat-return-declaration-preview.component';
import {VatReturnService} from '../../service/vat-return.service';
import {
  VatReturnDeclarationSubmissionComponent
} from '../vat-return-declaration-submission/vat-return-declaration-submission.component';
import Sale from '../../model/sale.model';

@Component({
  selector: 'app-vat-return-declaration-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    VatReturnDeclarationPreviewComponent,
    VatReturnDeclarationSubmissionComponent
  ],
  templateUrl: './vat-return-declaration-showcase.component.html',
  styles: ``
})
export class VatReturnDeclarationShowcaseComponent {
  protected readonly getSubmitDeclarationStateLabel = getSubmitDeclarationStateLabel;

  confirmationComponent = viewChild.required(ConfirmationComponent);
  declarations = input.required<VatReturnDeclaration[]>();
  instanceId = input.required<number>();
  messages = signal<Messages>({});
  previewMenu = viewChild.required(VatReturnDeclarationPreviewComponent);
  sales = input.required<Sale[]>();
  submissionMenu = viewChild.required(VatReturnDeclarationSubmissionComponent);

  constructor(
    private localizationService: LocalizationService,
    private vatReturnService: VatReturnService
  ) {
  }

  readonly resubmit = (declaration: VatReturnDeclaration) => {
    this.confirmationComponent().request(() => {
      const request: VatReturnDeclarationSubmitRequest = {
        affirmation: true,
        instanceId: this.instanceId(),
        sale: {
          id: declaration.sale.id!,
          customer: {
            id: declaration.sale.customer.id!,
          },
          salesman: {
            id: declaration.sale.salesman.id!,
          }
        }
      };

      this.vatReturnService.submit(request).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['VAT Return Declaration has been resubmitted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  readonly showPreview = (declaration: VatReturnDeclaration) => {
    this.previewMenu().show(declaration);
  }

  readonly showSubmission = () => {
    this.submissionMenu().show();
  }
}
