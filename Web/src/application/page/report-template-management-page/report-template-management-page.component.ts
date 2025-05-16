import {Component, inject, input, signal} from '@angular/core';
import {DataTypeService} from '../../service/data-type.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MessageHandlingService} from '../../service/message-handling.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, map, of, switchMap, tap} from 'rxjs';
import Messages from '../../model/messages.model';
import DataTypeField from '../../model/data-type-field.model';
import ReportTemplate, {ReportTemplateEditRequest} from '../../model/report-template.model';
import {ReportTemplateService} from '../../service/report-template.service';
import {Button} from 'primeng/button';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {InputText} from 'primeng/inputtext';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {Select} from 'primeng/select';
import {TableModule} from 'primeng/table';
import DataType from '../../model/data-type.model';
import {NumberUtil} from '../../util/number.util';
import {
  ReportTemplatePageHeaderSectionComponent
} from '../../component/report-template-page-header-section/report-template-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {FloatLabel} from 'primeng/floatlabel';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';
import {Badge} from 'primeng/badge';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'report-template-management-page',
  imports: [
    Button,
    FormInputErrorComponent,
    InputText,
    MessagesShowcaseComponent,
    ReactiveFormsModule,
    Select,
    TableModule,
    ReportTemplatePageHeaderSectionComponent,
    CardComponent,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    FloatLabel,
    IconField,
    InputIcon,
    Badge,
    TranslatePipe
  ],
  templateUrl: './report-template-management-page.component.html',
  styles: ``
})
export class ReportTemplateManagementPageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly reportTemplateService = inject(ReportTemplateService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);
  protected readonly form = this.createForm();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});
  protected readonly templateId = input<string>();

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({ request }) => request.instanceId
      ? this.reportTemplateService
        .getAllByInstanceId(request.instanceId)
        .pipe(
          map(templates => templates.flatMap(template => template.fields.map(f => f.dataTypeId))),
          map(dataTypeIds => Array.from(new Set(dataTypeIds))),
          switchMap(dataTypeIds => this.dataTypeService
              .getAllByInstanceId(request.instanceId!)
              .pipe(
                map(dataTypes => dataTypes.filter(dataType => !dataTypeIds.includes(dataType.id))),
                tap(dataTypes => this.consumeLoadedDataTypes(dataTypes))
              )
          )
        )
      : of([])
  });

  protected readonly template = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      templateId: NumberUtil.parse(this.templateId())
    }),
    loader: ({ request }) => request.instanceId && request.templateId
      ? this.reportTemplateService
        .getById(request.instanceId, request.templateId)
        .pipe(tap(template => this.patchFormValues(template)))
      : of(undefined)
  });

  private consumeLoadedDataTypes(dataTypes: DataType[]) {
    if (dataTypes.length > 0) {
      this.changeFormFields(dataTypes[0]);
    }
  }

  private consumeResult(message: string, id?: string | number, success: boolean = true) {
    if (success) {
      this.messageService.add({
        key: 'root',
        detail: message,
        summary: this.translateService.instant('action.report-template.summary'),
        severity: 'success',
        closable: true
      });
      if (this.templateId()) {
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        this.router.navigate(['../', id], { relativeTo: this.route });
      }
    } else {
      this.messages.set({ error: [message] });
    }
  }

  protected createForm(template?: ReportTemplate) {
    const form = this.formBuilder.group({
      fields: this.formBuilder.array([this.createFormField()], [Validators.required]),
      id: [template?.id],
      name: [template?.name, [Validators.required]]
    });
    form.controls.fields.clear();
    return form;
  }

  private createFormField(field?: DataTypeField) {
    return this.formBuilder.group({
      id: [field?.id, [Validators.required]],
      name: [field?.name, [Validators.required]]
    });
  }

  private patchFormValues(template: ReportTemplate) {
    this.form.reset();
    this.form.patchValue({
      id: template.id,
      name: template.name
    });
    this.form.controls.fields.clear();
    template.fields.forEach(field => this.form.controls.fields.push(this.createFormField(field)));
  }

  protected changeFormFields(dataType?: DataType) {
    const fields = this.form.controls.fields!;
    fields.clear();
    dataType?.fields?.forEach(field => {
      fields.push(this.createFormField(field));
    });
    this.form.markAsDirty();
  }

  protected save() {
    if (!this.form.valid) {
      this.messages.set({ error: ["error.fill-all-fields."] });
      return;
    }

    const request: ReportTemplateEditRequest = {
      instanceId: NumberUtil.parse(this.instanceId())!,
      reportTemplate: {
        fields: this.form.value.fields!.map(field => field.id!),
        id: this.form.value.id || 0,
        name: this.form.value.name!
      }
    };

    if (this.templateId()) {
      this.reportTemplateService
        .edit(request)
        .pipe(first())
        .subscribe({
          next: () => this.consumeResult(this.translateService.instant("action.report-template.edited")),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    } else {
      this.reportTemplateService
        .create({ ...request })
        .pipe(first())
        .subscribe({
          next: (value) => this.consumeResult(this.translateService.instant("action.report-template.created"), value.id),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    }
  }
}
