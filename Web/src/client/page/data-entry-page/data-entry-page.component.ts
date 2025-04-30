import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {
  DataEntryImportFormComponent
} from '../../component/data-entry-import/data-entry-import-form.component';
import {DataEntryTableComponent} from '../../component/data-entry-table/data-entry-table.component';
import {Dialog} from 'primeng/dialog';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {Router, RouterLink} from '@angular/router';
import {DataEntryService} from '../../service/data-entry.service';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import DataEntry, {DataEntryJoined} from '../../model/data-entry.model';
import Messages from '../../model/messages.model';
import {first, of} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {DataTypeService} from '../../service/data-type.service';
import {NumberUtil} from '../../util/number.util';
import {InstanceService} from '../../service/instance.service';

@Component({
  selector: 'data-entry-page',
  imports: [
    Button,
    ConfirmationComponent,
    DataEntryImportFormComponent,
    DataEntryTableComponent,
    Dialog,
    MessagesShowcaseComponent,
    RouterLink
  ],
  templateUrl: './data-entry-page.component.html',
  styles: ``
})
export class DataEntryPageComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly instanceService = inject(InstanceService);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly dataTypeId = input.required<string>();
  protected readonly instanceId = this.instanceService.getActiveInstanceId();
  protected readonly messages = signal<Messages>({});
  protected readonly showImporting = signal<boolean>(false);

  protected readonly dataEntries = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataEntryService.getAllByDataTypeId(request.instanceId, request.dataTypeId)
      : of([])
  });

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: this.instanceId()
    }),
    loader: ({request}) => request.dataTypeId && request.instanceId
      ? this.dataTypeService.getById(request.instanceId, request.dataTypeId)
      : of(undefined)
  });

  protected delete(dataEntry: DataEntry) {
    this.confirmationComponent().request(() => {
      this.dataEntryService
        .delete(this.instanceId()!, dataEntry.id)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Data entry deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected manage(dataEntry?: DataEntry) {
    this.router.navigate(
      ['home/workspace/data-entry/' + (dataEntry ? `${dataEntry}/edit` : 'create')]
    );
  }

  protected onDelete = (entry: DataEntryJoined) => this.delete(entry);
  protected onManage = (entry: DataEntryJoined) => this.manage(entry);
  protected onPreview = (entry: DataEntryJoined) => this.preview(entry);

  protected preview(dataEntry: DataEntryJoined) {
    this.router.navigate(['home/workspace/data-entry/' + dataEntry.id]);
  }
}
