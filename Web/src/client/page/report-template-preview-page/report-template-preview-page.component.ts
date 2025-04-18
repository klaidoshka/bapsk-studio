import {Component, inject, input} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {ReportTemplateService} from '../../service/report-template.service';
import {Card} from 'primeng/card';
import {NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {getDataTypesCount} from '../../model/report-template.model';

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

  configuration = rxResource({
    request: () => ({
      templateId: +this.templateId()
    }),
    loader: ({ request }) => this.reportTemplateService.getById(request.templateId)
  });

  templateId = input.required<string>();

  protected readonly getDataTypesCount = getDataTypesCount;
}
