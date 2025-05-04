import {Component, inject, signal, viewChild} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableModule} from 'primeng/table';
import {FormsModule} from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {Button} from 'primeng/button';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {AsyncPipe, DatePipe} from '@angular/common';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {MessageHandlingService} from '../../service/message-handling.service';
import {rxResource} from '@angular/core/rxjs-interop';
import Messages from '../../model/messages.model';
import Instance, {InstanceWithUsers} from '../../model/instance.model';
import {first, map, Observable, startWith, switchMap} from 'rxjs';
import {Router} from '@angular/router';
import {InstanceService} from '../../service/instance.service';
import {DataEntryService} from '../../service/data-entry.service';
import {DataTypeService} from '../../service/data-type.service';
import {toUserFullName, User} from '../../model/user.model';
import {
  InstancePageHeaderSectionComponent
} from '../../component/instance-page-header-section/instance-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';

@Component({
  selector: 'instance-page',
  templateUrl: './instance-page.component.html',
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    ConfirmDialogModule,
    Button,
    ConfirmationComponent,
    DatePipe,
    MessagesShowcaseComponent,
    AsyncPipe,
    InstancePageHeaderSectionComponent,
    CardComponent
  ],
  providers: [MessageService, ConfirmationService]
})
export class InstancePageComponent {
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly dataEntryService = inject(DataEntryService);
  private readonly dataTypeService = inject(DataTypeService);
  private readonly instanceService = inject(InstanceService);
  private readonly router = inject(Router);
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly messages = signal<Messages>({});

  protected readonly instances = rxResource({
    loader: () => this.instanceService
      .getAllWithUsers()
      .pipe(
        map(instances => instances.map(instance => ({
          ...instance,
          ownerName: toUserFullName(this.getOwner(instance))
        })))
      )
  })

  protected delete(instance: Instance) {
    this.confirmationComponent().request(() => {
      this.instanceService
        .delete(instance.id!)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Instance deleted successfully']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected getLastActivity(instance: Instance): Observable<Date> {
    return this.dataTypeService
      .getAllByInstanceId(instance.id!)
      .pipe(
        switchMap(dataTypes => this.dataEntryService
          .getAllByDataTypeIds(instance.id!, dataTypes.map(dataType => dataType.id))
          .pipe(
            map(dataEntriesMap => Array
              .from(dataEntriesMap.values())
              .flatMap(it => it)
            ),
            map(dataEntries => dataEntries
              .map(dataEntry => dataEntry.modifiedAt)
              .reduce((a, b) => a > b ? a : b, new Date(0))
            )
          )),
        startWith(instance.createdAt),
        first()
      );
  }

  protected getOwner(instance: InstanceWithUsers): User {
    return instance.users.find(user => user.userId === instance.createdById)!.user;
  }

  protected manage(instance?: Instance) {
    this.router.navigate(['home/instance/' + (instance ? `${instance.id}/edit` : 'create')]);
  }

  protected preview(instance: InstanceWithUsers) {
    this.router.navigate(['home/instance/' + instance.id]);
  }

  protected readonly toUserFullName = toUserFullName;
}
