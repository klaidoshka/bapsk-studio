import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {VatReturnService} from '../../service/vat-return.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import Messages from '../../model/messages.model';
import {PaymentType, PaymentTypes} from '../../model/vat-return.model';
import {first} from 'rxjs';
import {MessageService} from 'primeng/api';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {NgForOf, NgIf} from '@angular/common';
import {DatePicker} from 'primeng/datepicker';
import {InputNumber} from 'primeng/inputnumber';
import {Select} from 'primeng/select';
import {ConfirmationComponent} from '../confirmation/confirmation.component';

@Component({
  selector: 'vat-return-declaration-payment',
  imports: [
    Button,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    NgForOf,
    DatePicker,
    InputNumber,
    Select,
    NgIf,
    ConfirmationComponent
  ],
  templateUrl: './vat-return-declaration-payment.component.html',
  styles: ``
})
export class VatReturnDeclarationPaymentComponent {
  protected readonly types = PaymentTypes;
  private readonly formBuilder = inject(FormBuilder);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly messageService = inject(MessageService);
  private readonly vatReturnService = inject(VatReturnService);
  protected readonly confirmation = viewChild.required(ConfirmationComponent);
  protected readonly messages = signal<Messages>({});
  readonly instanceId = input.required<number>();
  readonly saleId = input.required<number>();

  protected readonly form = this.formBuilder.group({
    payments: this.formBuilder.array([this.createFormPaymentInfo()])
  })

  private createFormPaymentInfo() {
    return this.formBuilder.group({
      amount: [0, [Validators.required]],
      date: [new Date(), [Validators.required]],
      type: [PaymentType.Bank, [Validators.required]]
    });
  }

  protected addFormPaymentInfo() {
    this.getFormPayments().push(this.createFormPaymentInfo());
  }

  protected getFormPayments() {
    return this.form.controls.payments;
  }

  protected removePaymentInfo(index: number) {
    if (this.getFormPayments().length > 1) {
      this.getFormPayments().removeAt(index);
    }
  }

  protected submit() {
    if (this.form.invalid) {
      this.messages.set({error: ['Please fill in all required fields']});
      return;
    }

    const payments = this
      .getFormPayments().controls
      .map(control => ({
        amount: control.get('amount')!.value!,
        date: control.get('date')!.value!,
        type: control.get('type')!.value!
      }));

    this.confirmation().request(() => {
      this.vatReturnService
        .submitPayments(this.instanceId(), this.saleId(), payments)
        .pipe(first())
        .subscribe({
          next: () => this.messageService.add({
            key: 'root',
            summary: 'Payment Successful',
            detail: 'You have successfully submitted the payment info.',
            severity: 'success'
          }),
          error: response => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }
}
