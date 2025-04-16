import {Component, inject, input, signal} from '@angular/core';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../../model/salesman.model';
import {AbstractControl, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import Messages from '../../model/messages.model';
import {SalesmanService} from '../../service/salesman.service';
import {LocalizationService} from '../../service/localization.service';
import {TextService} from '../../service/text.service';
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {first} from 'rxjs';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {Select} from 'primeng/select';

@Component({
  selector: 'salesman-management',
  imports: [
    Button,
    Dialog,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './salesman-management.component.html',
  styles: ``
})
export class SalesmanManagementComponent {
  protected readonly IsoCountries = IsoCountries;
  private readonly formBuilder = inject(FormBuilder);
  private readonly localizationService = inject(LocalizationService);
  private readonly salesmanService = inject(SalesmanService);
  private readonly textService = inject(TextService);

  salesman = signal<Salesman | null>(null);

  form = this.formBuilder.group({
    name: ["", [Validators.required, Validators.maxLength(300)]],
    vatPayerCode: this.formBuilder.group({
      issuedBy: [getDefaultIsoCountry().code, [Validators.required]],
      value: ["", [Validators.required, Validators.pattern("^[0-9]{9,12}$")]]
    })
  });

  instanceId = input.required<number>();
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: SalesmanCreateRequest) {
    this.salesmanService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Salesman has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: SalesmanEditRequest) {
    this.salesmanService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Salesman has been edited successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  getErrorMessage(field: string): string | null {
    const parts = field.split(".");
    let control: AbstractControl<any, any> | null = null;

    for (const part of parts) {
      control = control ? control.get(part) : this.form.get(part);
    }

    if (!control || !control.touched || !control.invalid) {
      return "";
    }

    const name = this.textService.capitalize(field);

    if (control.errors?.["required"]) {
      return `${name} is required.`;
    }

    if (control.errors?.["maxlength"]) {
      return `${name} must be at most ${control.errors["maxlength"].requiredLength} characters long.`;
    }

    if (control.errors?.["pattern"]) {
      return `${name} must be a 9 or 12 digits number.`;
    }

    return null;
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request = {
      salesman: {
        name: this.form.value.name!,
        vatPayerCode: {
          issuedBy: this.form.value.vatPayerCode!.issuedBy!,
          value: this.form.value.vatPayerCode!.value!
        }
      },
      instanceId: this.instanceId()
    };

    if (this.salesman() != null) {
      this.edit({
        ...request,
        salesman: {
          ...request.salesman as any,
          id: this.salesman()!.id
        }
      });
    } else {
      this.create(request);
    }
  }

  show(salesman: Salesman | null) {
    this.updateForm(salesman);
    this.salesman.set(salesman);
    this.isShown.set(true);
  }

  private updateForm(salesman?: Salesman | null) {
    this.form.reset();

    if (salesman != null) {
      this.form.patchValue({...salesman as any});
    }
  }
}
