import {Component, computed, inject, input, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {DataEntryImportFormComponent} from '../../component/data-entry-import/data-entry-import-form.component';
import {DataEntryTableComponent} from '../../component/data-entry-table/data-entry-table.component';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DataEntryService} from '../../service/data-entry.service';
import {MessageHandlingService} from '../../service/message-handling.service';
import DataEntry, {DataEntryJoined} from '../../model/data-entry.model';
import Messages from '../../model/messages.model';
import {first, of} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {DataTypeService} from '../../service/data-type.service';
import {NumberUtil} from '../../util/number.util';
import {
  DataEntryPageHeaderSectionComponent
} from '../../component/data-entry-page-header-section/data-entry-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';

@Component({
  selector: 'data-entry-page',
  imports: [
    Button,
    ConfirmationComponent,
    DataEntryImportFormComponent,
    DataEntryTableComponent,
    Dialog,
    MessagesShowcaseComponent,
    RouterLink,
    DataEntryPageHeaderSectionComponent,
    CardComponent,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './data-entry-page.component.html',
  styles: ``
})
export class DataEntryPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly dataTypeId = input.required<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));
  protected readonly messages = signal<Messages>({});
  protected readonly showImporting = signal<boolean>(false);

  protected readonly dataEntries = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataEntryService.getAllByDataTypeId(request.instanceId, request.dataTypeId)
      : of(undefined)
  });

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataTypeService.getById(request.instanceId, request.dataTypeId)
      : of(undefined)
  });

  protected delete(dataEntry: DataEntry) {
    this.confirmationComponent().request(() => {
      this.dataEntryService
        .delete(this.instanceIdAsNumber()!, dataEntry.id)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Data entry deleted successfully']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected manage(dataEntry?: DataEntry) {
    this.router.navigate([`./` + (dataEntry ? `${dataEntry.id}/edit` : 'create')], {
      queryParams: {dataTypeId: this.dataTypeId()},
      relativeTo: this.route
    });
  }

  protected onDelete = (entry: DataEntryJoined) => this.delete(entry);
  protected onManage = (entry: DataEntryJoined) => this.manage(entry);
  protected onPreview = (entry: DataEntryJoined) => this.preview(entry);

  protected preview(dataEntry: DataEntryJoined) {
    this.router.navigate([`./` + dataEntry.id], {relativeTo: this.route});
  }
}
