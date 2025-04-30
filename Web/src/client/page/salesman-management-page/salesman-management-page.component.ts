import {Component, inject, input, signal} from '@angular/core';
import {Button} from "primeng/button";
import {FormInputErrorComponent} from "../../component/form-input-error/form-input-error.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {
  MessagesShowcaseComponent
} from "../../component/messages-showcase/messages-showcase.component";
import {Select} from "primeng/select";
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {SalesmanService} from '../../service/salesman.service';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../../model/salesman.model';
import Messages from '../../model/messages.model';
import {first, of, tap} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {InstanceService} from '../../service/instance.service';

@Component({
  selector: 'salesman-management-page',
  imports: [
    Button,
    FormInputErrorComponent,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select
  ],
  templateUrl: './salesman-management-page.component.html',
  styles: ``
})
export class SalesmanManagementPageComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);
  private readonly salesmanService = inject(SalesmanService);
  protected readonly IsoCountries = IsoCountries;
  protected readonly salesmanId = input<string>();
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly messages = signal<Messages>({});

  protected readonly salesman = rxResource({
    request: () => ({
      instanceId: this.instanceId(),
      salesmanId: NumberUtil.parse(this.salesmanId())
    }),
    loader: ({request}) => request.instanceId && request.salesmanId
      ? this.salesmanService
        .getById(request.instanceId, request.salesmanId)
        .pipe(
          first(),
          tap(salesman => this.patchFormValues(salesman))
        )
      : of(undefined)
  });

  protected readonly form = this.formBuilder.group({
    name: ["", [Validators.required, Validators.maxLength(300)]],
    vatPayerCode: this.formBuilder.group({
      issuedBy: [getDefaultIsoCountry().code, [Validators.required]],
      value: ["", [Validators.required, Validators.pattern("^[0-9]{9,12}$")]]
    })
  });

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: SalesmanCreateRequest) {
    this.salesmanService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Salesman has been created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private edit(request: SalesmanEditRequest) {
    this.salesmanService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Salesman has been edited successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private patchFormValues(salesman: Salesman) {
    this.form.reset();
    this.form.patchValue({
      name: salesman.name,
      vatPayerCode: {
        issuedBy: salesman.vatPayerCode.issuedBy,
        value: salesman.vatPayerCode.value
      }
    });
  }

  protected save() {
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
      instanceId: this.instanceId()!
    };

    if (this.salesman.value()) {
      this.edit({
        ...request,
        salesman: {
          ...request.salesman,
          id: this.salesman.value()!.id
        }
      });
    } else {
      this.create(request);
    }
  }
}
