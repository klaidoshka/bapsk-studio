import {Component, computed, Signal, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../confirmation/confirmation.component";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import Messages from '../../model/messages.model';
import {DataTypePreviewComponent} from '../data-type-preview/data-type-preview.component';
import DataType from '../../model/data-type.model';
import {DataTypeService} from '../../service/data-type.service';
import {DataTypeManagementComponent} from '../data-type-management/data-type-management.component';
import {first} from 'rxjs';
import ErrorResponse from '../../model/error-response.model';
import {InstanceService} from '../../service/instance.service';
import {MessageModule} from 'primeng/message';

@Component({
  selector: 'app-data-type-showcase',
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
  dataTypes!: Signal<DataType[]>;
  confirmationComponent = viewChild.required(ConfirmationComponent);
  instanceId!: Signal<number | null>;
  managementMenu = viewChild.required(DataTypeManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(DataTypePreviewComponent);

  constructor(
    private dataTypeService: DataTypeService,
    private instanceService: InstanceService
  ) {
    this.instanceId = this.instanceService.getActiveInstanceId();

    this.dataTypes = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? this.dataTypeService.getAsSignal(instanceId)() : [];
    })
  }

  showManagement(dataType: DataType | null) {
    this.managementMenu().show(dataType);
  }

  showPreview(dataType: DataType) {
    this.previewMenu().show(dataType);
  }

  delete(dataType: DataType) {
    this.confirmationComponent().request(() => {
      this.dataTypeService.delete(dataType.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Instance deleted successfully']}),
        error: (response: ErrorResponse) => this.messages.set({
          error: response.error?.messages || ["Extremely rare error occurred, please try again later."]
        })
      });
    });
  }
}
