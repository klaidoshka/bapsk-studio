import {Component, inject, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../confirmation/confirmation.component";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import Messages from '../../model/messages.model';
import {DataTypePreviewComponent} from '../data-type-preview/data-type-preview.component';
import DataType from '../../model/data-type.model';
import {DataTypeService} from '../../service/data-type.service';
import {DataTypeManagementComponent} from '../data-type-management/data-type-management.component';
import {first, of} from 'rxjs';
import {InstanceService} from '../../service/instance.service';
import {MessageModule} from 'primeng/message';
import {LocalizationService} from '../../service/localization.service';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'data-type-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    DataTypePreviewComponent,
    DataTypeManagementComponent,
    MessageModule
  ],
  templateUrl: './data-type-showcase.component.html',
  styles: ``
})
export class DataTypeShowcaseComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly localizationService = inject(LocalizationService);
  private readonly instanceService = inject(InstanceService);

  confirmationComponent = viewChild.required(ConfirmationComponent);

  dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  instanceId = this.instanceService.getActiveInstanceId();
  managementMenu = viewChild.required(DataTypeManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(DataTypePreviewComponent);

  delete(dataType: DataType) {
    this.confirmationComponent().request(() => {
      this.dataTypeService.delete(dataType.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Data type deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  showManagement(dataType?: DataType) {
    this.managementMenu().show(dataType);
  }

  showPreview(dataType: DataType) {
    this.previewMenu().show(dataType);
  }
}
