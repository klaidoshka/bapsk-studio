import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import Messages from '../../model/messages.model';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {VatReturnService} from '../../service/vat-return.service';
import {Checkbox} from 'primeng/checkbox';
import Sale from '../../model/sale.model';
import {first} from 'rxjs';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'vat-return-declaration-submission',
  imports: [
    Button,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Checkbox,
    ConfirmationComponent
  ],
  templateUrl: './vat-return-declaration-submission.component.html',
  styles: ``
})
export class VatReturnDeclarationSubmissionComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly vatReturnService = inject(VatReturnService);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly messages = signal<Messages>({});
  readonly hasDeclaration = input.required<boolean>();
  readonly instanceId = input.required<number>();
  readonly sale = input.required<Sale>();

  protected readonly form = this.formBuilder.group({
    affirmation: [false, [Validators.requiredTrue]]
  });

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const sale = this.sale();

    if (this.hasDeclaration()) {
      this.confirmationComponent().request(() => this.submit(sale));
      return;
    }

    this.submit(sale);
  }

  private submit(sale: Sale) {
    this.vatReturnService
      .submit({
        affirmation: this.form.value.affirmation!,
        instanceId: this.instanceId(),
        sale: {
          id: sale.id,
          customer: {
            id: sale.customer.id!
          },
          salesman: {
            id: sale.salesman.id!
          }
        }
      })
      .pipe(first())
      .subscribe({
        next: () => this.onSuccess("Declaration for sale's VAT return has been submitted successfully."),
        error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }
}
