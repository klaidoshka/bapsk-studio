import {Component, inject, input} from '@angular/core';
import {DatePipe} from "@angular/common";
import {TableModule} from "primeng/table";
import {toUserFullName} from '../../model/user.model';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {InstanceService} from '../../service/instance.service';

@Component({
  selector: 'instance-preview-page',
  imports: [
    DatePipe,
    TableModule
  ],
  templateUrl: './instance-preview-page.component.html',
  styles: ``
})
export class InstancePreviewPageComponent {
  protected readonly toUserFullName = toUserFullName;
  private readonly instanceService = inject(InstanceService);
  protected readonly instanceId = input.required<string>();

  protected readonly instance = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.instanceService.getWithUsersById(request.instanceId)
      : of(undefined)
  });
}
