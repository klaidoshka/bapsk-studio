import {Component, computed, input, OnInit, signal} from '@angular/core';
import Sale, {SaleCreateRequest, SaleEditRequest, SoldGood} from '../../model/sale.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import Messages from '../../model/messages.model';
import {SaleService} from '../../service/sale.service';
import {LocalizationService} from '../../service/localization.service';
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

@Component({
  selector: 'app-sale-management',
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
    NgForOf
  ],
  templateUrl: './sale-management.component.html',
  styles: ``
})
export class SaleManagementComponent implements OnInit {
  protected readonly SaleReceiptType = SaleReceiptType;
  protected readonly UnitOfMeasureType = UnitOfMeasureType;
  customers = input.required<Customer[]>();
  customersLabeled = computed(() => this.customers().map((customer) => ({
    label: `${customer.firstName} ${customer.lastName} (${customer.identityDocument.number})`,
    value: customer.id
  })));
  form!: FormGroup;
  instanceId = input.required<number>();
  isShownInitially = input<boolean>(false);
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

  constructor(
    private formBuilder: FormBuilder,
    private saleService: SaleService,
    private localizationService: LocalizationService,
    private textService: TextService
  ) {
    this.form = this.formBuilder.group({
      cashRegister: this.formBuilder.group({
        cashRegisterNo: [null, [Validators.maxLength(50)]],
        receiptNo: [null, [Validators.maxLength(70)]]
      }),
      customerId: [null, [Validators.required]],
      date: [new Date(), [Validators.required]],
      invoiceNo: [null, [Validators.maxLength(70)]],
      salesmanId: [null, [Validators.required]],
      soldGoods: this.formBuilder.array([])
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

  private readonly create = (request: SaleCreateRequest) => {
    this.saleService.create(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Sale has been created successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly edit = (request: SaleEditRequest) => {
    this.saleService.edit(request).pipe(first()).subscribe({
      next: () => this.onSuccess("Sale has been edited successfully."),
      error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
    });
  }

  private readonly updateForm = (sale?: Sale | null) => {
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

  readonly addSoldGood = (soldGood?: SoldGood | null) => {
    this.soldGoods().push(this.formBuilder.group({
      description: [soldGood?.description || "...", [Validators.required, Validators.maxLength(500)]],
      id: [soldGood?.id || null],
      quantity: [soldGood?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitOfMeasure: [soldGood?.unitOfMeasure || null, [Validators.required, Validators.maxLength(50)]],
      unitOfMeasureType: [soldGood?.unitOfMeasureType || UnitOfMeasureType.UnitOfMeasureCode, [Validators.required]],
      unitPrice: [soldGood != null ? NumberUtil.round(soldGood.taxableAmount / soldGood.quantity, 2) : 0, [Validators.required, Validators.min(0)]],
      vatRate: [soldGood?.vatRate || 21, [Validators.required, Validators.min(0), Validators.max(100)]]
    }));
    this.soldGoods().markAsDirty();
  }

  readonly clearMeasurement = (index: number, type: UnitOfMeasureType) => {
    if (type == UnitOfMeasureType.UnitOfMeasureCode) {
      this.soldGoods().at(index).get("unitOfMeasure")?.setValue(defaultStandardMeasurement);
    } else {
      this.soldGoods().at(index).get("unitOfMeasure")?.setValue(null);
    }
  }

  readonly getErrorMessage = (field: string): string | null => {
    const parts = field.split(".");
    let control: AbstractControl<any, any> | null = null;

    for (const part of parts) {
      control = control ? control.get(part) : this.form.get(part);
    }

    if (!control || !control.touched || !control.invalid) return "";

    const name = this.textService.capitalize(field);

    if (control.errors?.["required"]) {
      return `${name} is required.`;
    }

    if (control.errors?.["maxlength"]) {
      return `${name} must be at most ${control.errors["maxlength"].requiredLength} characters long.`;
    }

    return null;
  }

  readonly getMeasurementUnit = (index: number): UnitOfMeasureType => {
    return this.soldGoods().at(index).get("unitOfMeasureType")?.value || UnitOfMeasureType.UnitOfMeasureCode;
  }

  readonly getSoldGoodErrorMessage = (index: number, field: string): string | null => {
    const control = this.soldGoods().at(index).get(field);

    if (!control || !control.touched || !control.invalid) return "";

    const name = this.textService.capitalize(field);

    if (control.errors?.["required"]) {
      return `${name} is required.`;
    }

    if (control.errors?.["maxlength"]) {
      return `${name} must be at most ${control.errors["maxlength"].requiredLength} characters long.`;
    }

    if (control.errors?.["min"]) {
      return `${name} must be at least ${control.errors["min"].min}.`;
    }

    if (control.errors?.["max"]) {
      return `${name} must be at most ${control.errors["max"].max}.`;
    }

    if (control.errors?.["pattern"]) {
      return `${name} must be 4 digits.`;
    }

    return null;
  }

  readonly hide = () => {
    this.messages.set({});
    this.isShown.set(false);
    this.form.reset();
  }

  readonly removeSoldGood = (index: number) => {
    this.soldGoods().removeAt(index);
    this.soldGoods().markAsDirty();
  }

  readonly save = () => {
    if (!this.form.valid) {
      this.messages.set({error: ["Please fill out the form."]});
      return;
    }

    const request: SaleEditRequest = {
      sale: {
        cashRegister: this.form.value.cashRegister,
        customerId: this.form.value.customerId,
        date: this.form.value.date,
        invoiceNo: this.form.value.invoiceNo,
        id: this.sale()?.id,
        salesmanId: this.form.value.salesmanId,
        soldGoods: this.form.value.soldGoods.map((soldGood: any) => ({
          ...soldGood,
          quantity: +soldGood.quantity,
          unitPrice: +soldGood.unitPrice,
          vatRate: +soldGood.vatRate
        }))
      },
      instanceId: this.instanceId()
    };

    if (this.sale() != null) {
      this.edit(request);
    } else {
      this.create(request);
    }
  }

  readonly show = (sale: Sale | null) => {
    this.updateForm(sale);
    this.sale.set(sale);
    this.isShown.set(true);
  }

  readonly soldGoods = () => this.form.controls["soldGoods"] as FormArray;
}
