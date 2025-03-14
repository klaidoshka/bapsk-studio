import {Component, input, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import Messages from '../../model/messages.model';
import {LocalizationService} from '../../service/localization.service';
import {TextService} from '../../service/text.service';
import {first} from 'rxjs';
import {VatReturnService} from '../../service/vat-return.service';
import {Checkbox} from 'primeng/checkbox';
import {SaleWithVatReturnDeclaration} from '../../model/sale.model';

@Component({
  selector: 'app-vat-return-declaration-submission',
  imports: [
    Button,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Checkbox
  ],
  templateUrl: './vat-return-declaration-submission.component.html',
  styles: ``
})
export class VatReturnDeclarationSubmissionComponent implements OnInit {
  form!: FormGroup;
  instanceId = input.required<number>();
  isShownInitially = input<boolean>(false);
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});
  sale = input.required<SaleWithVatReturnDeclaration>();

  constructor(
    private formBuilder: FormBuilder,
    private localizationService: LocalizationService,
    private textService: TextService,
    private vatReturnService: VatReturnService
  ) {
    this.form = this.formBuilder.group({
      affirmation: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  private readonly onSuccess = (message: string) => {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  readonly getErrorMessage = (field: string): string | null => {
    const control = this.form.get(field);

    if (!control || !control.touched || !control.invalid) return "";

    const name = this.textService.capitalize(field);

    if (control.errors?.["required"]) {
      return `${name} is required.`;
    }

    return null;
  }

  readonly reset = () => {
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    this.vatReturnService.submit({
      affirmation: this.form.value.affirmation,
      instanceId: this.instanceId(),
      sale: {
        ...this.sale(),
        date: this.sale().date.toISOString() as any
      }
    }).pipe(first()).subscribe({
      next: () => this.onSuccess("Declaration for sale's VAT return has been submitted successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }
}
