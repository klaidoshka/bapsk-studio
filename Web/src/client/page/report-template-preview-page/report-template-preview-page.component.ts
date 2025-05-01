import {Component, inject, input} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {ReportTemplateService} from '../../service/report-template.service';
import {Card} from 'primeng/card';
import {NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {getDataTypesCount} from '../../model/report-template.model';
import {NumberUtil} from '../../util/number.util';
import {of} from 'rxjs';

@Component({
  selector: 'report-template-preview-page',
  imports: [
    Card,
    NgIf,
    TableModule
  ],
  templateUrl: './report-template-preview-page.component.html',
  styles: ``
})
export class ReportTemplatePreviewPageComponent {
  private reportTemplateService = inject(ReportTemplateService);
  protected readonly getDataTypesCount = getDataTypesCount;
  protected readonly instanceId = input.required<string>();
  protected readonly templateId = input.required<string>();

  protected readonly configuration = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      templateId: NumberUtil.parse(this.templateId())
    }),
    loader: ({request}) => request.instanceId && request.templateId
      ? this.reportTemplateService.getById(request.instanceId, request.templateId)
      : of(undefined)
  });
}
