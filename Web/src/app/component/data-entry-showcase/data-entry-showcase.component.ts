import {Component, input, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../confirmation/confirmation.component";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import Messages from '../../model/messages.model';
import {DataEntryPreviewComponent} from '../data-entry-preview/data-entry-preview.component';
import DataEntry, {DataEntryWithUsers} from '../../model/data-entry.model';
import {DataEntryService} from '../../service/data-entry.service';
import {DataEntryManagementComponent} from '../data-entry-management/data-entry-management.component';
import {first} from 'rxjs';
import {MessageModule} from 'primeng/message';
import DataType from '../../model/data-type.model';
import {DatePipe} from '@angular/common';
import {LocalizationService} from '../../service/localization.service';
import {toUserIdentityFullName} from '../../model/user.model';

@Component({
  selector: 'app-data-entry-showcase',
  imports: [
    Button,
    ConfirmationComponent,
    MessagesShowcaseComponent,
    TableModule,
    DataEntryPreviewComponent,
    DataEntryManagementComponent,
    MessageModule,
    DatePipe
  ],
  templateUrl: './data-entry-showcase.component.html',
  styles: ``
})
export class DataEntryShowcaseComponent {
  protected readonly toUserIdentityFullName = toUserIdentityFullName;

  confirmationComponent = viewChild.required(ConfirmationComponent);
  dataEntries = input.required<DataEntryWithUsers[]>();
  dataType = input.required<DataType>();
  managementMenu = viewChild.required(DataEntryManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(DataEntryPreviewComponent);

  constructor(
    private dataEntryService: DataEntryService,
    private localizationService: LocalizationService
  ) {
  }

  readonly showManagement = (dataEntry: DataEntry | null) => {
    this.managementMenu().show(dataEntry);
  }

  readonly showPreview = (dataEntry: DataEntryWithUsers) => {
    this.previewMenu().show(dataEntry);
  }

  readonly delete = (dataEntry: DataEntry) => {
    this.confirmationComponent().request(() => {
      this.dataEntryService.delete(dataEntry.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Data entry deleted successfully']}),
        error: (response) => this.localizationService.resolveHttpErrorResponseTo(response, this.messages)
      });
    });
  }
}
