import {Component, inject, input, signal} from '@angular/core';
import {Button} from "primeng/button";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import Messages from '../../model/messages.model';
import {LocalizationService} from '../../service/localization.service';
import {TextService} from '../../service/text.service';
import {VatReturnService} from '../../service/vat-return.service';
import {Checkbox} from 'primeng/checkbox';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';

@Component({
  selector: 'vat-return-declaration-submission',
  imports: [
    Button,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Checkbox
  ],
  templateUrl: './vat-return-declaration-submission.component.html',
  styles: ``
})
export class VatReturnDeclarationSubmissionComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly localizationService = inject(LocalizationService);
  private readonly textService = inject(TextService);
  private readonly vatReturnService = inject(VatReturnService);

  form = this.formBuilder.group({
    affirmation: [false, [Validators.requiredTrue]]
  });

  instanceId = input.required<number>();
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});
  sale = input.required<SaleWithVatReturnDeclaration>();

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  getErrorMessage(field: string): string | null {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    const name = this.textService.capitalize(field);

    if (control.errors?.["required"]) {
      return `${name} is required.`;
    }

    return null;
  }

  reset() {
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const sale = this.sale();

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
      .subscribe({
        next: () => this.onSuccess("Declaration for sale's VAT return has been submitted successfully."),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
  }
}
