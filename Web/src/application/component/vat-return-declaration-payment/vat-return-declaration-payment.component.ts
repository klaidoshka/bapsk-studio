import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {VatReturnService} from '../../service/vat-return.service';
import {MessageHandlingService} from '../../service/message-handling.service';
import Messages from '../../model/messages.model';
import {PaymentType, PaymentTypes} from '../../model/vat-return.model';
import {first} from 'rxjs';
import {MessageService} from 'primeng/api';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {ConfirmationComponent} from '../confirmation/confirmation.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputNumber} from 'primeng/inputnumber';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'vat-return-declaration-payment',
  imports: [
    Button,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    DatePicker,
    Select,
    ConfirmationComponent,
    FloatLabel,
    IconField,
    InputIcon,
    InputNumber,
    FormInputErrorComponent,
    TranslatePipe
  ],
  templateUrl: './vat-return-declaration-payment.component.html',
  styles: ``
})
export class VatReturnDeclarationPaymentComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly vatReturnService = inject(VatReturnService);

  protected readonly confirmation = viewChild.required(ConfirmationComponent);
  protected readonly messages = signal<Messages>({});
  readonly instanceId = input.required<number>();
  readonly saleId = input.required<number>();

  protected readonly types = PaymentTypes.map(type => ({
    ...type,
    label: this.translateService.instant(type.label)
  }));

  protected readonly form = this.formBuilder.group({
    payments: this.formBuilder.array([this.createFormPaymentInfo()])
  });

  private createFormPaymentInfo() {
    return this.formBuilder.group({
      amount: [0, [Validators.required, Validators.min(0.01)]],
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
      this.messages.set({error: ['error.fill-all-fields']});
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
            summary: this.translateService.instant('action.sale.summary'),
            detail: this.translateService.instant('action.sale.payment-submitted'),
            severity: 'success'
          }),
          error: response => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }
}
