import {Component, effect, inject, input, signal} from '@angular/core';
import {DataTypeService} from '../../service/data-type.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, of} from 'rxjs';
import Messages from '../../model/messages.model';
import DataTypeField from '../../model/data-type-field.model';
import {ReportTemplateEditRequest} from '../../model/report-template.model';
import {ReportTemplateService} from '../../service/report-template.service';
import {Button} from 'primeng/button';
import {FormInputErrorComponent} from '../../component/form-input-error/form-input-error.component';
import {InputText} from 'primeng/inputtext';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {NgIf} from '@angular/common';
import {Select} from 'primeng/select';
import {TableModule} from 'primeng/table';
import DataType from '../../model/data-type.model';
import {NumberUtil} from '../../util/number.util';

@Component({
  selector: 'report-template-management-page',
  imports: [
    Button,
    FormInputErrorComponent,
    InputText,
    MessagesShowcaseComponent,
    NgIf,
    ReactiveFormsModule,
    Select,
    TableModule
  ],
  templateUrl: './report-template-management-page.component.html',
  styles: ``
})
export class ReportTemplateManagementPageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly reportTemplateService = inject(ReportTemplateService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});
  protected readonly templateId = input<string>();

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  protected readonly template = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      templateId: NumberUtil.parse(this.templateId())
    }),
    loader: ({request}) => request.instanceId && request.templateId
      ? this.reportTemplateService.getById(request.instanceId, request.templateId)
      : of(undefined)
  });

  protected readonly form = this.formBuilder.group({
    fields: this.formBuilder.array([this.createFormField()], [Validators.required]),
    id: [this.template.value()?.id],
    name: [this.template.value()?.name, [Validators.required]]
  });

  constructor() {
    const effectRef = effect(() => {
      const template = this.template.value();

      if (!template) {
        return;
      }

      this.form.patchValue({
        fields: template.fields.map(field => ({
          id: field.id,
          name: field.name
        })),
        id: template.id,
        name: template.name
      });

      effectRef.destroy();
    });
  }

  private createFormField(field?: DataTypeField) {
    return this.formBuilder.group({
      id: [field?.id, [Validators.required]],
      name: [field?.name, [Validators.required]]
    });
  }

  private changeMessages(message: string, success: boolean = true) {
    this.messages.set(success ? {success: [message]} : {error: [message]});
  }

  protected changeFormFields(dataType?: DataType) {
    const fields = this.form.controls.fields!;

    fields.clear();

    dataType?.fields?.forEach(field => {
      fields.push(this.createFormField(field));
    });
  }

  protected save() {
    if (!this.form.valid) {
      this.changeMessages("Please fill out the form.", false);
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
          next: () => this.changeMessages("Report template edited successfully."),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    } else {
      this.reportTemplateService
        .create({...request})
        .pipe(first())
        .subscribe({
          next: () => this.changeMessages("Report template created successfully."),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    }
  }
}
