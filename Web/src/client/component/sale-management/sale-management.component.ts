import {Component, computed, inject, input, signal} from '@angular/core';
import Sale, {SaleCreateRequest, SaleEditRequest, SoldGood} from '../../model/sale.model';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import Messages from '../../model/messages.model';
import {SaleService} from '../../service/sale.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {TextService} from '../../service/text.service';
import {first} from 'rxjs';
import Salesman from '../../model/salesman.model';
import Customer from '../../model/customer.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {InputText} from 'primeng/inputtext';
import {DatePicker} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {SaleReceiptType} from './sale-receipt-type.model';
import {NgForOf, NgIf} from '@angular/common';
import {UnitOfMeasureType} from '../../model/unit-of-measure-type.model';
import {defaultStandardMeasurement, StandardMeasurements} from './standard-measurement.model';
import {NumberUtil} from '../../util/number.util';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'sale-management',
  imports: [
    Button,
    Dialog,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    InputText,
    DatePicker,
    Select,
    FormsModule,
    NgIf,
    NgForOf,
    FormInputErrorComponent
  ],
  templateUrl: './sale-management.component.html',
  styles: ``
})
export class SaleManagementComponent {
  protected readonly SaleReceiptType = SaleReceiptType;
  protected readonly UnitOfMeasureType = UnitOfMeasureType;
  private readonly formBuilder = inject(FormBuilder);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly saleService = inject(SaleService);
  private readonly textService = inject(TextService);

  customers = input.required<Customer[]>();

  customersLabeled = computed(() => this.customers().map((customer) => ({
    label: `${customer.firstName} ${customer.lastName} (${customer.identityDocument.number})`,
    value: customer.id
  })));

  form = this.formBuilder.group({
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

  instanceId = input.required<number>();
  isShown = signal<boolean>(false);

  measurementUnits = [
    {label: 'Code (Standard)', value: UnitOfMeasureType.UnitOfMeasureCode},
    {label: 'Other', value: UnitOfMeasureType.UnitOfMeasureOther}
  ]

  messages = signal<Messages>({});
  sale = signal<Sale | null>(null);
  salesmen = input.required<Salesman[]>();

  salesmenLabeled = computed(() => this.salesmen().map((salesman) => ({
    label: `${salesman.name} (${salesman.vatPayerCode.value})`,
    value: salesman.id
  })));

  saleReceiptTypes = [
    {label: 'Invoice', value: SaleReceiptType.Invoice},
    {label: 'Receipt', value: SaleReceiptType.CashRegister}
  ]

  selectedSaleReceiptType = signal<SaleReceiptType>(SaleReceiptType.Invoice);
  standardMeasurements = StandardMeasurements

  private onSuccess(message: string) {
    this.messages.set({success: [message]});
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private create(request: SaleCreateRequest) {
    this.saleService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Sale has been created successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
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
    this.saleService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Sale has been edited successfully."),
      error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private updateForm(sale?: Sale | null) {
    this.form.reset();
    this.soldGoods().clear();

    if (sale != null) {
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

      this.soldGoods().markAsPristine();
    } else {
      this.selectedSaleReceiptType.set(SaleReceiptType.Invoice);
    }
  }

  addSoldGood(soldGood?: SoldGood | null) {
    this.soldGoods().push(this.createSoldGood(soldGood || undefined));
    this.soldGoods().markAsDirty();
  }

  clearMeasurement(index: number, type: UnitOfMeasureType) {
    if (type == UnitOfMeasureType.UnitOfMeasureCode) {
      this.soldGoods().at(index).get("unitOfMeasure")?.setValue(defaultStandardMeasurement);
    } else {
      this.soldGoods().at(index).get("unitOfMeasure")?.setValue(null);
    }
  }

  getMeasurementUnit(index: number): UnitOfMeasureType {
    return this.soldGoods()
      .at(index)
      .get("unitOfMeasureType")?.value || UnitOfMeasureType.UnitOfMeasureCode;
  }

  hide() {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  removeSoldGood(index: number) {
    this.soldGoods().removeAt(index);
    this.soldGoods().markAsDirty();
  }

  save() {
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
        id: this.sale()?.id,
        salesmanId: this.form.value.salesmanId!,
        soldGoods: this.form.value.soldGoods?.map((soldGood: any) => ({
          ...soldGood,
          quantity: +soldGood.quantity,
          unitPrice: +soldGood.unitPrice,
          vatRate: +soldGood.vatRate
        })) || []
      },
      instanceId: this.instanceId()
    };

    if (this.sale() != null) {
      this.edit(request);
    } else {
      this.create(request);
    }
  }

  show(sale: Sale | null) {
    this.updateForm(sale);
    this.sale.set(sale);
    this.isShown.set(true);
  }

  soldGoods() {
    return this.form.controls.soldGoods;
  }
}
