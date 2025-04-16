import {Component, inject, input, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../confirmation/confirmation.component";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import Messages from '../../model/messages.model';
import {DataEntryPreviewComponent} from '../data-entry-preview/data-entry-preview.component';
import DataEntry, {DataEntryJoined} from '../../model/data-entry.model';
import {DataEntryService} from '../../service/data-entry.service';
import {DataEntryManagementComponent} from '../data-entry-management/data-entry-management.component';
import {first} from 'rxjs';
import {MessageModule} from 'primeng/message';
import DataType from '../../model/data-type.model';
import {LocalizationService} from '../../service/localization.service';
import {DataEntryImportFormComponent} from '../data-entry-import/data-entry-import-form.component';
import {Dialog} from 'primeng/dialog';
import {RouterLink} from '@angular/router';
import {DataEntryTableComponent} from '../data-entry-table/data-entry-table.component';

@Component({
  selector: 'data-entry-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    DataEntryPreviewComponent,
    DataEntryManagementComponent,
    MessageModule,
    DataEntryImportFormComponent,
    Dialog,
    RouterLink,
    DataEntryTableComponent
  ],
  templateUrl: './data-entry-showcase.component.html',
  styles: ``
})
export class DataEntryShowcaseComponent {
  private readonly dataEntryService = inject(DataEntryService);
  private readonly localizationService = inject(LocalizationService);

  confirmationComponent = viewChild.required(ConfirmationComponent);
  dataEntries = input.required<DataEntryJoined[]>();
  dataType = input.required<DataType>();
  managementMenu = viewChild.required(DataEntryManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(DataEntryPreviewComponent);
  showImporting = signal<boolean>(false);

  delete(dataEntry: DataEntry) {
    this.confirmationComponent().request(() => {
      this.dataEntryService.delete(dataEntry.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({ success: ['Data entry deleted successfully'] }),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }

  manage(dataEntry?: DataEntry) {
    this.managementMenu().show(dataEntry);
  }

  onDelete = (entry: DataEntryJoined) => this.delete(entry);

  onManage = (entry: DataEntryJoined) => this.manage(entry);

  onPreview = (entry: DataEntryJoined) => this.preview(entry);

  preview(dataEntry: DataEntryJoined) {
    this.previewMenu().show(this.dataType(), dataEntry);
  }
}
