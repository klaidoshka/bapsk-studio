import {Component, effect, input, OnInit, Signal, signal, viewChild} from '@angular/core';
import {Button} from "primeng/button";
import {ConfirmationComponent} from "../confirmation/confirmation.component";
import {MessagesShowcaseComponent} from "../messages-showcase/messages-showcase.component";
import {TableModule} from "primeng/table";
import Messages from '../../model/messages.model';
import {DataEntryPreviewComponent} from '../data-entry-preview/data-entry-preview.component';
import DataEntry from '../../model/data-entry.model';
import {DataEntryService} from '../../service/data-entry.service';
import {
  DataEntryManagementComponent
} from '../data-entry-management/data-entry-management.component';
import {first} from 'rxjs';
import ErrorResponse from '../../model/error-response.model';
import {MessageModule} from 'primeng/message';
import DataType from '../../model/data-type.model';
import {DatePipe} from '@angular/common';

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
export class DataEntryShowcaseComponent implements OnInit {
  confirmationComponent = viewChild.required(ConfirmationComponent);
  dataEntries!: Signal<DataEntry[]>;
  dataType = input.required<DataType>();
  managementMenu = viewChild.required(DataEntryManagementComponent);
  messages = signal<Messages>({});
  previewMenu = viewChild.required(DataEntryPreviewComponent);

  constructor(
    private dataEntryService: DataEntryService
  ) {
    effect(() => {
      this.dataEntries = this.dataEntryService.getAllAsSignal(this.dataType()!!.id);
    });
  }

  ngOnInit() {
    this.dataEntries = this.dataEntryService.getAllAsSignal(this.dataType()!!.id);
  }

  showManagement(dataEntry: DataEntry | null) {
    this.managementMenu().show(dataEntry);
  }

  showPreview(dataType: DataEntry) {
    this.previewMenu().show(dataType);
  }

  delete(dataType: DataEntry) {
    this.confirmationComponent().request(() => {
      this.dataEntryService.delete(dataType.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Instance deleted successfully']}),
        error: (response: ErrorResponse) => this.messages.set({
          error: response.error?.messages || ["Extremely rare error occurred, please try again later."]
        })
      });
    });
  }
}
