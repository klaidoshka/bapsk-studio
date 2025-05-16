import {Component, inject, input} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {ReportTemplateService} from '../../service/report-template.service';
import {TableModule} from 'primeng/table';
import {NumberUtil} from '../../util/number.util';
import {first, map, Observable, of} from 'rxjs';
import {
  ReportTemplatePageHeaderSectionComponent
} from '../../component/report-template-page-header-section/report-template-page-header-section.component';
import ReportTemplate from '../../model/report-template.model';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';
import {AsyncPipe} from '@angular/common';
import {Badge} from 'primeng/badge';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'report-template-preview-page',
  imports: [
    TableModule,
    ReportTemplatePageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent,
    AsyncPipe,
    Badge,
    TranslatePipe
  ],
  templateUrl: './report-template-preview-page.component.html',
  styles: ``
})
export class ReportTemplatePreviewPageComponent {
  private reportTemplateService = inject(ReportTemplateService);
  protected readonly instanceId = input.required<string>();
  protected readonly templateId = input.required<string>();

  protected readonly template = rxResource({
    request: () => ({
      instanceId: NumberUtil.parse(this.instanceId()),
      templateId: NumberUtil.parse(this.templateId())
    }),
    loader: ({request}) => request.instanceId && request.templateId
      ? this.reportTemplateService.getById(request.instanceId, request.templateId)
      : of(undefined)
  });

  protected getDataTypeName(template: ReportTemplate): Observable<string> {
    return this.reportTemplateService
      .getDataType(NumberUtil.parse(this.instanceId())!, template)
      .pipe(
        first(),
        map(dataType => dataType.name)
      );
  }
}
