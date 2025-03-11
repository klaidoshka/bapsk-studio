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
import {MessageModule} from 'primeng/message';
import DataType from '../../model/data-type.model';
import {DatePipe} from '@angular/common';
import {ErrorResolverService} from '../../service/error-resolver.service';

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
    private dataEntryService: DataEntryService,
    private errorResolverService: ErrorResolverService
  ) {
    effect(() => {
      this.dataEntries = this.dataEntryService.getAsSignal(this.dataType()!!.id);
    });
  }

  readonly ngOnInit = () => {
    this.dataEntries = this.dataEntryService.getAsSignal(this.dataType()!!.id);
  }

  readonly showManagement = (dataEntry: DataEntry | null) => {
    this.managementMenu().show(dataEntry);
  }

  readonly showPreview = (dataEntry: DataEntry) => {
    this.previewMenu().show(dataEntry);
  }

  readonly delete = (dataEntry: DataEntry) => {
    this.confirmationComponent().request(() => {
      this.dataEntryService.delete(dataEntry.id!!).pipe(first()).subscribe({
        next: () => this.messages.set({success: ['Data entry deleted successfully']}),
        error: (response) => this.errorResolverService.resolveHttpResponseTo(response, this.messages)
      });
    });
  }
}
