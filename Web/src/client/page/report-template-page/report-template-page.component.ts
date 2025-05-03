import {Component, inject, input, signal, viewChild} from '@angular/core';
import {ReportTemplateService} from '../../service/report-template.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import Messages from '../../model/messages.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {first, map, Observable, of} from 'rxjs';
import ReportTemplate from '../../model/report-template.model';
import {Button} from 'primeng/button';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';
import {NumberUtil} from '../../util/number.util';
import {
  ReportTemplatePageHeaderSectionComponent
} from '../../component/report-template-page-header-section/report-template-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'report-template-page',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    ReportTemplatePageHeaderSectionComponent,
    CardComponent,
    AsyncPipe
  ],
  templateUrl: './report-template-page.component.html',
  styles: ``
})
export class ReportTemplatePageComponent {
  private readonly reportTemplateService = inject(ReportTemplateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly canGoBack = input<boolean>();
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly dataTypeId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly templates = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: NumberUtil.parse(this.instanceId())
    }),
    loader: ({request}) => {
      if (request.dataTypeId && request.instanceId) {
        return this.reportTemplateService.getAllByDataTypeId(request.instanceId, request.dataTypeId);
      }

      return request.instanceId
        ? this.reportTemplateService.getAllByInstanceId(request.instanceId)
        : of([])
    }
  });

  private changeMessages(message: string, success: boolean = true) {
    this.messages.set(success ? {success: [message]} : {error: [message]});
  }

  protected delete(template: ReportTemplate) {
    this.confirmationComponent().request(() => {
      this.reportTemplateService
        .delete(NumberUtil.parse(this.instanceId())!, template.id!)
        .pipe(first())
        .subscribe(() => this.changeMessages("Import template deleted successfully"));
    });
  }

  protected getDataTypeName(template: ReportTemplate): Observable<string> {
    return this.reportTemplateService
      .getDataType(NumberUtil.parse(this.instanceId())!, template)
      .pipe(
        first(),
        map(dataType => dataType.name)
      );
  }

  protected manage(template?: ReportTemplate) {
    this.router.navigate(['./' + (template ? `${template.id}/edit` : 'create')], {relativeTo: this.route});
  }

  protected preview(template: ReportTemplate) {
    this.router.navigate([`./${template.id}`], {relativeTo: this.route});
  }
}
