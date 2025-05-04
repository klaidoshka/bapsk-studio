import {Component, inject, input} from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {TableModule} from "primeng/table";
import {toUserFullName} from '../../model/user.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {map, Observable, of, startWith, switchMap} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {InstanceService} from '../../service/instance.service';
import {
  InstancePageHeaderSectionComponent
} from '../../component/instance-page-header-section/instance-page-header-section.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';
import {instanceUserPermissions} from '../../constant/instance-user.permissions';
import {
  BadgeContrastedComponent
} from '../../component/badge-contrasted/badge-contrasted.component';
import {DataTypeService} from '../../service/data-type.service';
import {DataEntryService} from '../../service/data-entry.service';

@Component({
  selector: 'instance-preview-page',
  imports: [
    DatePipe,
    TableModule,
    InstancePageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent,
    BadgeContrastedComponent,
    AsyncPipe
  ],
  templateUrl: './instance-preview-page.component.html',
  styles: ``
})
export class InstancePreviewPageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  private readonly dataEntryService = inject(DataEntryService);
  private readonly instanceService = inject(InstanceService);
  protected readonly toUserFullName = toUserFullName;
  protected readonly instanceId = input.required<string>();
  protected readonly permissionsCount = instanceUserPermissions.length;

  protected readonly instance = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.instanceService.getWithUsersById(request.instanceId)
      : of(undefined)
  });

  protected getDataEntriesCreated(userId: number): Observable<number> {
    const instanceId = NumberUtil.parse(this.instanceId())!;

    return this.dataTypeService
      .getAllByInstanceId(instanceId)
      .pipe(
        map(dataTypes => dataTypes.map(dataType => dataType.id)),
        switchMap(dataTypeIds => this.dataEntryService
          .getAllByDataTypeIds(instanceId, dataTypeIds)
          .pipe(
            map(dataEntriesMap => Array
              .from(dataEntriesMap.values())
              .flatMap(it => it)
            ),
            map(dataEntries => dataEntries.filter(dataEntry => dataEntry.createdById === userId).length)
          )
        ),
        startWith(0)
      );
  }

  protected getPermissionsCount(instanceUserId: number): number {
    const instanceUser = this.instance.value()!.users.find(user => user.id === instanceUserId);

    if (instanceUser && instanceUser.userId === this.instance.value()!.createdById) {
      return this.permissionsCount;
    }

    return instanceUser ? instanceUser.permissions.length : 0;
  }
}
