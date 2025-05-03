import {Component, inject, input, signal} from '@angular/core';
import {Button} from "primeng/button";
import {DatePicker} from "primeng/datepicker";
import {FormInputErrorComponent} from "../../component/form-input-error/form-input-error.component";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {
  MessagesShowcaseComponent
} from "../../component/messages-showcase/messages-showcase.component";
import {Select} from "primeng/select";
import {UnitOfMeasureType} from '../../model/unit-of-measure-type.model';
import {MessageHandlingService} from '../../service/message-handling.service';
import {SaleService} from '../../service/sale.service';
import Messages from '../../model/messages.model';
import Sale, {SaleCreateRequest, SaleEditRequest, SoldGood} from '../../model/sale.model';
import {first, map, of, tap} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {rxResource} from '@angular/core/rxjs-interop';
import {SaleReceiptType, saleReceiptTypes} from './sale-receipt-type.model';
import {
  defaultStandardMeasurement,
  measurementUnits,
  StandardMeasurements
} from './standard-measurement.model';
import {CustomerService} from '../../service/customer.service';
import {SalesmanService} from '../../service/salesman.service';
import {
  SalePageHeaderSectionComponent
} from "../../component/sale-page-header-section/sale-page-header-section.component";
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

@Component({
  selector: 'sale-management-page',
  imports: [
    Button,
    DatePicker,
    FormInputErrorComponent,
    FormsModule,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select,
    SalePageHeaderSectionComponent,
    CardComponent,
    FloatLabel,
    IconField,
    InputIcon,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './sale-management-page.component.html',
  styles: ``
})
export class SaleManagementPageComponent {
  private readonly customerService = inject(CustomerService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly saleService = inject(SaleService);
  private readonly salesmanService = inject(SalesmanService);
  protected readonly SaleReceiptType = SaleReceiptType;
  protected readonly UnitOfMeasureType = UnitOfMeasureType;
  protected readonly standardMeasurements = StandardMeasurements;
  protected readonly saleReceiptTypes = saleReceiptTypes;
  protected readonly measurementUnits = measurementUnits;
  protected readonly saleId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});
  protected readonly selectedSaleReceiptType = signal<SaleReceiptType>(SaleReceiptType.Invoice);

  protected readonly customersLabeled = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.customerService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(customers => customers.map(customer => ({
            label: `${customer.firstName} ${customer.lastName} (ID ${customer.identityDocument.number})`,
            value: customer.id
          })))
        )
      : of(undefined)
  });

  protected readonly sale = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      saleId: NumberUtil.parse(this.saleId())
    }),
    loader: ({request}) => request.instanceId && request.saleId
      ? this.saleService
        .getById(request.instanceId, request.saleId)
        .pipe(
          tap(sale => this.patchFormValues(sale))
        )
      : of(undefined)
  });

  protected readonly salesmenLabeled = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.salesmanService
        .getAllByInstanceId(request.instanceId)
        .pipe(map(salesmen => salesmen.map(salesman => ({
          label: `${salesman.name} (${salesman.vatPayerCode.value})`,
          value: salesman.id
        }))))
      : of(undefined)
  });

  protected readonly form = this.formBuilder.group({
    cashRegister: this.formBuilder.group({
      cashRegisterNo: ["", [Validators.maxLength(50)]],
      receiptNo: ["", [Validators.maxLength(70)]]
    }),
    customerId: [-1, [Validators.required]],
    date: [new Date(), [Validators.required]],
    invoiceNo: ["", [Validators.maxLength(70)]],
    salesmanId: [-1, [Validators.required]],
    soldGoods: this.formBuilder.array([this.createSoldGood()])
  });

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        severity: 'success',
        closable: true
      });
      if (this.saleId()) {
        this.router.navigate(['../'], {relativeTo: this.route});
      } else {
        this.router.navigate(['../', id], {relativeTo: this.route});
      }
    } else {
      this.messages.set({error: [message]});
    }
  }

  private create(request: SaleCreateRequest) {
    this.saleService
      .create(request)
      .pipe(first())
      .subscribe({
        next: (value) => this.consumeResult("Sale has been created successfully.", value.id),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private createSoldGood(soldGood?: SoldGood) {
    return this.formBuilder.group({
      description: [soldGood?.description || "", [Validators.required, Validators.maxLength(500)]],
      id: [soldGood?.id || null],
      quantity: [soldGood?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitOfMeasure: [soldGood?.unitOfMeasure || defaultStandardMeasurement, [Validators.required, Validators.maxLength(50)]],
      unitOfMeasureType: [soldGood?.unitOfMeasureType || UnitOfMeasureType.UnitOfMeasureCode, [Validators.required]],
      unitPrice: [soldGood != null ? NumberUtil.round(soldGood.taxableAmount / soldGood.quantity, 2) : 0, [Validators.required, Validators.min(0)]],
      vatRate: [soldGood?.vatRate || 21, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  private edit(request: SaleEditRequest) {
    this.saleService
      .edit(request)
      .pipe(first())
      .subscribe({
        next: () => this.consumeResult("Sale has been edited successfully."),
        error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
      });
  }

  private patchFormValues(sale: Sale) {
    this.form.reset();
    this.form.controls.soldGoods.clear();

    this.selectedSaleReceiptType.set(
      sale.invoiceNo?.trim()?.length
        ? SaleReceiptType.Invoice
        : SaleReceiptType.CashRegister
    );

    this.form.patchValue({
      ...sale,
      customerId: sale.customer.id,
      salesmanId: sale.salesman.id
    });

    sale.soldGoods.forEach((soldGood) => {
      this.addSoldGood(soldGood);
    });

    this.form.controls.soldGoods.markAsPristine();
  }

  protected addSoldGood(soldGood?: SoldGood | null) {
    this.form.controls.soldGoods.push(this.createSoldGood(soldGood || undefined));
    this.form.controls.soldGoods.markAsDirty();
  }

  protected clearMeasurement(index: number, type: UnitOfMeasureType) {
    if (type == UnitOfMeasureType.UnitOfMeasureCode) {
      this.form.controls.soldGoods.at(index)
        .get("unitOfMeasure")
        ?.setValue(defaultStandardMeasurement);
    } else {
      this.form.controls.soldGoods.at(index).get("unitOfMeasure")?.setValue(null);
    }
  }

  protected getMeasurementUnit(index: number): UnitOfMeasureType {
    return this.form.controls.soldGoods
      .at(index)
      .get("unitOfMeasureType")?.value || UnitOfMeasureType.UnitOfMeasureCode;
  }

  protected removeSoldGood(index: number) {
    this.form.controls.soldGoods.removeAt(index);
    this.form.controls.soldGoods.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: SaleEditRequest = {
      sale: {
        cashRegister: this.form.value.cashRegister as any,
        customerId: this.form.value.customerId!,
        date: this.form.value.date!,
        invoiceNo: this.form.value.invoiceNo || undefined,
        id: this.sale.value()?.id,
        salesmanId: this.form.value.salesmanId!,
        soldGoods: this.form.value.soldGoods?.map((soldGood: any) => ({
          ...soldGood,
          quantity: +soldGood.quantity,
          unitPrice: +soldGood.unitPrice,
          vatRate: +soldGood.vatRate
        })) || []
      },
      instanceId: NumberUtil.parse(this.instanceId())!
    };

    if (this.sale.value()) {
      this.edit(request);
    } else {
      this.create(request);
    }
  }
}
