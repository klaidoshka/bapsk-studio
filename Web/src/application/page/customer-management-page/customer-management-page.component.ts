import {Component, inject, input, signal} from '@angular/core';
import {Button} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {FormInputErrorComponent} from "../../component/form-input-error/form-input-error.component";
import {InputText} from "primeng/inputtext";
import {MessagesShowcaseComponent} from "../../component/messages-showcase/messages-showcase.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {CustomerService} from '../../service/customer.service';
import {MessageHandlingService} from '../../service/message-handling.service';
import Customer, {CustomerCreateRequest, CustomerEditRequest, CustomerOtherDocument} from '../../model/customer.model';
import {IdentityDocumentType, identityDocumentTypes} from '../../model/identity-document-type.model';
import Messages from '../../model/messages.model';
import {first, of, tap} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {
  CustomerPageHeaderSectionComponent
} from '../../component/customer-page-header-section/customer-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'customer-management-page',
  imports: [
    Button,
    DatePicker,
    FormInputErrorComponent,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select,
    CustomerPageHeaderSectionComponent,
    CardComponent,
    FloatLabel,
    IconField,
    InputIcon,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    TranslatePipe
  ],
  templateUrl: './customer-management-page.component.html',
  styles: ``
})
export class CustomerManagementPageComponent {
  private readonly customerService = inject(CustomerService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  protected readonly IsoCountries = IsoCountries;
  protected readonly customerId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});
  protected readonly form = this.createForm();

  protected readonly identityDocumentTypes = identityDocumentTypes.map(type => ({
    ...type,
    label: this.translateService.instant(type.label)
  }));

  protected readonly customer = rxResource({
    request: () => ({
      customerId: NumberUtil.parse(this.customerId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.customerId && request.instanceId
      ? this.customerService
        .getById(request.instanceId, request.customerId)
        .pipe(tap(customer => this.updateForm(customer)))
      : of(undefined)
  });

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        summary: this.translateService.instant('action.customer.summary'),
        severity: 'success',
        closable: true
      });
      if (this.customerId()) {
        this.router.navigate(['../'], {relativeTo: this.route});
      } else {
        this.router.navigate(['../', id], {relativeTo: this.route});
      }
    } else {
      this.messages.set({error: [message]});
    }
  }

  private create(request: CustomerCreateRequest) {
    this.customerService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult(this.translateService.instant("action.customer.created"), value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private createForm() {
    const form = this.formBuilder.group({
      birthdate: [new Date(), [Validators.required]],
      email: [""],
      firstName: ["", [Validators.required, Validators.maxLength(200)]],
      identityDocument: this.formBuilder.group({
        issuedBy: [getDefaultIsoCountry().code, [Validators.required]],
        number: ["", [Validators.required, Validators.maxLength(50)]],
        type: [IdentityDocumentType.Passport, [Validators.required]],
        value: [null as string | null, [Validators.maxLength(50)]]
      }),
      lastName: ["", [Validators.required, Validators.maxLength(200)]],
      otherDocuments: this.formBuilder.array([
        this.formBuilder.group({
          issuedBy: [getDefaultIsoCountry().code, [Validators.required]],
          type: ["", [Validators.required, Validators.maxLength(70)]],
          value: ["", [Validators.required, Validators.maxLength(70)]]
        })
      ]),
      residenceCountry: [getDefaultIsoCountry().code, [Validators.required]]
    });

    form.controls.otherDocuments.clear();

    return form;
  }

  private edit(request: CustomerEditRequest) {
    this.customerService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.consumeResult(this.translateService.instant("action.customer.edited")),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private updateForm(customer: Customer) {
    this.form.reset();
    this.form.patchValue({...customer});
    customer.otherDocuments.forEach(document => this.addOtherDocument(document));
    this.form.markAsPristine();
  }

  protected addOtherDocument(document?: CustomerOtherDocument) {
    this.form.controls.otherDocuments.push(this.formBuilder.group({
      issuedBy: [document?.issuedBy || getDefaultIsoCountry().code, [Validators.required]],
      type: [document?.type || "", [Validators.required, Validators.maxLength(70)]],
      value: [document?.value || "", [Validators.required, Validators.maxLength(70)]]
    }));
    this.form.markAsDirty();
  }

  protected removeOtherDocument(index: number) {
    this.form.controls.otherDocuments.removeAt(index);
    this.form.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["error.fill-all-fields."]});
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
      instanceId: NumberUtil.parse(this.instanceId())!
    };

    if (this.customer.value()) {
      this.edit({
        ...request,
        customer: {
          ...request.customer,
          id: this.customer.value()!.id
        }
      });
    } else {
      this.create(request);
    }
  }
}
