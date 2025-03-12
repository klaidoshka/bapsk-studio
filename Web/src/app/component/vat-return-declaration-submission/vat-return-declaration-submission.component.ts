import {Component, computed, input, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {Dialog} from "primeng/dialog";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import Messages from '../../model/messages.model';
import Sale from '../../model/sale.model';
import {LocalizationService} from '../../service/localization.service';
import {TextService} from '../../service/text.service';
import {first} from 'rxjs';
import {VatReturnDeclarationSubmitRequest} from '../../model/vat-return.model';
import {VatReturnService} from '../../service/vat-return.service';
import {Checkbox} from 'primeng/checkbox';

@Component({
  selector: 'app-vat-return-declaration-submission',
  imports: [
    Button,
    Dialog,
    MessagesShowcaseComponent,
    NgIf,
    ReactiveFormsModule,
    Select,
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
  sales = input.required<Sale[]>();
  salesLabeled = computed(() => this.sales().map(sale => ({
    label: `${sale.date.toLocaleDateString()} (ID: ${sale.id}) | ${sale.customer.firstName} ${sale.customer.lastName} - ${sale.salesman.name} | ${sale.soldGoods.length} goods`,
    value: sale
  })));

  constructor(
    private formBuilder: FormBuilder,
    private localizationService: LocalizationService,
    private textService: TextService,
    private vatReturnService: VatReturnService
  ) {
    this.form = this.formBuilder.group({
      affirmation: [false, [Validators.requiredTrue]],
      sale: [null, [Validators.required]]
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

  readonly hide = () => {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: VatReturnDeclarationSubmitRequest = {
      affirmation: this.form.value.affirmation,
      instanceId: this.instanceId(),
      sale: this.form.value.sale
    };

    this.vatReturnService.submit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Sale has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  readonly show = () => {
    this.form.reset();
    this.isShown.set(true);
  }
}
