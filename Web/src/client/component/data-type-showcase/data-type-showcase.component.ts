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
import {InstanceService} from '../../service/instance.service';
import {MessageModule} from 'primeng/message';
import {LocalizationService} from '../../service/localization.service';

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
  dataTypes!: Signal<DataType[]>;
  confirmationComponent = viewChild.required(ConfirmationComponent);
  instanceId!: Signal<number | undefined>;
  managementMenu = viewChild.required(DataTypeManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(DataTypePreviewComponent);

  constructor(
    private dataTypeService: DataTypeService,
    private localizationService: LocalizationService,
    private instanceService: InstanceService
  ) {
    this.instanceId = this.instanceService.getActiveInstanceId();

    this.dataTypes = computed(() => {
      const instanceId = this.instanceId();
      return instanceId != null ? this.dataTypeService.getAsSignal(instanceId)() : [];
    })
  }

  readonly delete = (dataType: DataType) => {
    this.confirmationComponent().request(() => {
      this.dataTypeService.delete(dataType.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Data type deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  readonly showManagement = (dataType?: DataType) => {
    this.managementMenu().show(dataType);
  }

  readonly showPreview = (dataType: DataType) => {
    this.previewMenu().show(dataType);
  }
}
