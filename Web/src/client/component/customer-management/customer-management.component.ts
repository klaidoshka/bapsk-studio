import {Component, inject, input, OnInit, signal} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import Customer, {
  CustomerCreateRequest,
  CustomerEditRequest,
  CustomerOtherDocument
} from '../../model/customer.model';
import Messages from '../../model/messages.model';
import {CustomerService} from '../../service/customer.service';
import {TextService} from '../../service/text.service';
import {first} from 'rxjs';
import {LocalizationService} from '../../service/localization.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {IdentityDocumentType} from '../../model/identity-document-type.model';
import {DatePicker} from 'primeng/datepicker';
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'customer-management',
  imports: [
    Button,
    Dialog,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    InputText,
    Select,
    DatePicker,
    NgForOf,
    NgIf
  ],
  templateUrl: './customer-management.component.html',
  styles: ``
})
export class CustomerManagementComponent {
  protected readonly IsoCountries = IsoCountries;
  private readonly formBuilder = inject(FormBuilder);
  private readonly customerService = inject(CustomerService);
  private readonly localizationService = inject(LocalizationService);
  private readonly textService = inject(TextService);

  customer = signal<Customer | null>(null);

  form = this.formBuilder.group({
    birthdate: [new Date(), [Validators.required]],
    email: [""],
    firstName: ["", [Validators.required, Validators.maxLength(200)]],
    identityDocument: this.formBuilder.group({
      issuedBy: [getDefaultIsoCountry().code, [Validators.required]],
      number: ["", [Validators.required, Validators.maxLength(50)]],
      type: [IdentityDocumentType.Passport, [Validators.required]],
      value: [null, [Validators.maxLength(50)]]
    }),
    lastName: ["", [Validators.required, Validators.maxLength(200)]],
    otherDocuments: this.formBuilder.array([]),
    residenceCountry: [getDefaultIsoCountry().code, [Validators.required]]
  });

  identityDocumentTypes = [
    {label: 'ID Card', value: IdentityDocumentType.NationalId},
    {label: 'Passport', value: IdentityDocumentType.Passport}
  ]

  instanceId = input.required<number>();
  isShown = signal<boolean>(false);
  messages = signal<Messages>({});

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: CustomerCreateRequest) {
    this.customerService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Customer has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: CustomerEditRequest) {
    this.customerService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Customer has been edited successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  addOtherDocument(document?: CustomerOtherDocument) {
    this.otherDocuments().push(this.formBuilder.group({
      issuedBy: [document?.issuedBy || getDefaultIsoCountry().code, [Validators.required]],
      type: [document?.type || "", [Validators.required, Validators.maxLength(70)]],
      value: [document?.value || "", [Validators.required, Validators.maxLength(70)]]
    }));

    this.form.markAsDirty();
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

    return null;
  }

  getOtherDocumentErrorMessage(index: number, field: string) {
    const control = this.otherDocuments().at(index).get(field);

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

    return null;
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
    this.otherDocuments().clear();
  }

  otherDocuments(): FormArray {
    return this.form.get("otherDocuments") as FormArray;
  }

  removeOtherDocument(index: number) {
    this.otherDocuments().removeAt(index);
    this.form.markAsDirty();
  }

  save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: CustomerCreateRequest = {
      customer: {
        birthdate: this.form.value.birthdate!,
        email: this.form.value.email || undefined,
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        identityDocument: {
          issuedBy: this.form.value.identityDocument!.issuedBy!,
          number: this.form.value.identityDocument!.number!,
          type: this.form.value.identityDocument!.type!,
          value: this.form.value.identityDocument!.value || undefined
        },
        otherDocuments: this.form.value.otherDocuments as any,
        residenceCountry: this.form.value.residenceCountry!
      },
      instanceId: this.instanceId()
    };

    if (this.customer() != null) {
      this.edit({
        ...request,
        customer: {
          ...request.customer,
          id: this.customer()!.id
        }
      });
    } else {
      this.create(request);
    }
  }

  show(customer: Customer | null) {
    this.updateForm(customer);
    this.customer.set(customer);
    this.isShown.set(true);
  }

  private updateForm(customer?: Customer | null) {
    this.form.reset();

    if (customer != null) {
      this.form.patchValue({...customer as any});

      if (customer.otherDocuments.length > 0) {
        customer.otherDocuments.forEach(it => this.addOtherDocument(it));
      }
    }
  }
}
