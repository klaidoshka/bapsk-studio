import {Component, inject, input, signal} from '@angular/core';
import {Button} from "primeng/button";
import {FormInputErrorComponent} from "../../component/form-input-error/form-input-error.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {MessagesShowcaseComponent} from "../../component/messages-showcase/messages-showcase.component";
import {Select} from "primeng/select";
import {getDefaultIsoCountry, IsoCountries} from '../../model/iso-country.model';
import {MessageHandlingService} from '../../service/message-handling.service';
import {SalesmanService} from '../../service/salesman.service';
import Salesman, {SalesmanCreateRequest, SalesmanEditRequest} from '../../model/salesman.model';
import Messages from '../../model/messages.model';
import {first, of, tap} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {NumberUtil} from '../../util/number.util';
import {
  SalesmanPageHeaderSectionComponent
} from '../../component/salesman-page-header-section/salesman-page-header-section.component';
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
  selector: 'salesman-management-page',
  imports: [
    Button,
    FormInputErrorComponent,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select,
    SalesmanPageHeaderSectionComponent,
    CardComponent,
    FloatLabel,
    IconField,
    InputIcon,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    TranslatePipe
  ],
  templateUrl: './salesman-management-page.component.html',
  styles: ``
})
export class SalesmanManagementPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly salesmanService = inject(SalesmanService);
  private readonly translateService = inject(TranslateService);
  protected readonly IsoCountries = IsoCountries;
  protected readonly salesmanId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly salesman = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      salesmanId: NumberUtil.parse(this.salesmanId())
    }),
    loader: ({request}) => request.instanceId && request.salesmanId
      ? this.salesmanService
        .getById(request.instanceId, request.salesmanId)
        .pipe(tap(salesman => this.patchFormValues(salesman)))
      : of(undefined)
  });

  protected readonly form = this.formBuilder.group({
    name: ["", [Validators.required, Validators.maxLength(300)]],
    vatPayerCode: this.formBuilder.group({
      issuedBy: [getDefaultIsoCountry().code, [Validators.required]],
      value: ["", [Validators.required, Validators.pattern("^[0-9]{9,12}$")]]
    })
  });

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        summary: this.translateService.instant('action.salesman.summary'),
        severity: 'success',
        closable: true
      });
      if (this.salesmanId()) {
        this.router.navigate(['../'], {relativeTo: this.route});
      } else {
        this.router.navigate(['../', id], {relativeTo: this.route});
      }
    } else {
      this.messages.set({error: [message]});
    }
  }

  private create(request: SalesmanCreateRequest) {
    this.salesmanService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult(this.translateService.instant("action.salesman.created"), value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private edit(request: SalesmanEditRequest) {
    this.salesmanService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.consumeResult(this.translateService.instant("action.salesman.edited")),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
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
      this.messages.set({error: ["error.fill-all-fields."]});
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
      instanceId: NumberUtil.parse(this.instanceId())!
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
