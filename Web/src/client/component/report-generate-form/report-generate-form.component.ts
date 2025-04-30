import {Component, inject, signal} from '@angular/core';
import {ReportService} from '../../service/report.service';
import {ReportTemplateService} from '../../service/report-template.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {InstanceService} from '../../service/instance.service';
import {first, map, of} from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {CustomerService} from '../../service/customer.service';
import {SalesmanService} from '../../service/salesman.service';
import Messages from '../../model/messages.model';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {DatePicker} from 'primeng/datepicker';
import {Button} from 'primeng/button';
import {Select} from 'primeng/select';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import {FormInputErrorComponent} from '../form-input-error/form-input-error.component';

@Component({
  selector: 'report-generate-form',
  imports: [
    ReactiveFormsModule,
    NgIf,
    DatePicker,
    Button,
    Select,
    MessagesShowcaseComponent,
    FormInputErrorComponent,
    FormsModule
  ],
  templateUrl: './report-generate-form.component.html',
  styles: ``
})
export class ReportGenerateFormComponent {
  private readonly customerService = inject(CustomerService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly instanceService = inject(InstanceService);
  private readonly reportService = inject(ReportService);
  private readonly reportTemplateService = inject(ReportTemplateService);
  private readonly router = inject(Router);
  private readonly salesmanService = inject(SalesmanService);
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly messages = signal<Messages>({});
  protected readonly selectedType = signal<number>(1);

  protected readonly customers = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.customerService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(customers => customers.map(customer => ({
            id: customer.id,
            label: customer.firstName + ' ' + customer.lastName
          })))
        )
      : of([])
  });

  protected readonly customErrorMessages = {
    reportTypeRequired: () => 'Please fill in all fields.'
  };

  protected readonly reportTemplates = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.reportTemplateService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(templates => templates.map(template => ({
            id: template.id,
            label: template.name
          })))
        )
      : of([])
  });

  protected readonly salesmen = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.salesmanService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(salesmen => salesmen.map(salesman => ({
            id: salesman.id,
            label: salesman.name
          })))
        )
      : of([])
  });

  protected readonly form = this.formBuilder.group({
    from: [new Date(), [Validators.required]],
    dataEntry: this.formBuilder.group({
      templateId: [null as number | null]
    }),
    sale: this.formBuilder.group({
      customerId: [null as number | null],
      salesmanId: [null as number | null]
    }),
    to: [new Date(), [Validators.required]]
  }, {validators: this.validateFilledReportType()});

  protected readonly reportTypes = [
    {label: 'Data Entry', id: 1},
    {label: 'Sale', id: 2}
  ]

  private generateDataEntriesReport() {
    if (this.form.invalid) {
      this.messages.set({error: ['Please fill all required fields']});
      return;
    }

    this.reportService
      .generateDataEntryReports({
        from: this.form.value.from!,
        reportTemplateId: this.form.value.dataEntry!.templateId!,
        to: this.form.value.to!
      })
      .pipe(first())
      .subscribe(reports => this.router.navigate(['/misc/report-preview'], {
        state: {reports}
      }));
  }

  private generateSalesReport() {
    if (this.form.invalid) {
      this.messages.set({error: ['Please fill all required fields']});
      return;
    }

    this.reportService
      .generateSaleReports({
        customerId: this.form.value.sale!.customerId!,
        from: this.form.value.from!,
        salesmanId: this.form.value.sale!.salesmanId!,
        to: this.form.value.to!
      })
      .pipe(first())
      .subscribe(reports => this.router.navigate(['/misc/report-preview'], {
        state: {reports}
      }));
  }

  private validateFilledReportType(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const type = this.selectedType();
      const dataEntryTemplateId = group.get('dataEntry.templateId')?.value;
      const customerId = group.get('sale.customerId')?.value;
      const salesmanId = group.get('sale.salesmanId')?.value;

      if (type === 1 && !!dataEntryTemplateId || type === 2 && !!customerId && !!salesmanId) {
        return null;
      }

      return {reportTypeRequired: true};
    };
  }

  protected generate() {
    switch (this.selectedType()) {
      case 1:
        this.generateDataEntriesReport();
        break;

      case 2:
        this.generateSalesReport();
        break;
    }
  }
}
