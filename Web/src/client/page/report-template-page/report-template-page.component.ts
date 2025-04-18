import {Component, inject, signal, viewChild} from '@angular/core';
import {ReportTemplateService} from '../../service/report-template.service';
import {InstanceService} from '../../service/instance.service';
import {Router} from '@angular/router';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import Messages from '../../model/messages.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';
import ReportTemplate, {getDataTypesCount} from '../../model/report-template.model';
import {Button} from 'primeng/button';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'report-template-page',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule
  ],
  templateUrl: './report-template-page.component.html',
  styles: ``
})
export class ReportTemplatePageComponent {
  private reportTemplateService = inject(ReportTemplateService);
  private instanceService = inject(InstanceService);
  private router = inject(Router);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  messages = signal<Messages>({});

  templates = rxResource({
    request: () => ({
      instanceId: this.instanceId() === undefined ? undefined : +this.instanceId()!
    }),
    loader: ({ request }) => request.instanceId
      ? this.reportTemplateService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  instanceId = this.instanceService.getActiveInstanceId();

  protected readonly getDataTypesCount = getDataTypesCount;

  private changeMessages(message: string, success: boolean = true) {
    this.messages.set(success ? { success: [message] } : { error: [message] });
  }

  delete(template: ReportTemplate) {
    this.confirmationComponent().request(() => {
      this.reportTemplateService.delete(template.id!).subscribe(() =>
        this.changeMessages("Import template deleted successfully")
      );
    });
  }

  manage(template?: ReportTemplate) {
    this.router.navigate(
      ['home/report-template/' + (template ? `${template.id}/edit` : 'create')]
    );
  }

  preview(template: ReportTemplate) {
    this.router.navigate([`home/report-template/${template.id}`]);
  }
}
