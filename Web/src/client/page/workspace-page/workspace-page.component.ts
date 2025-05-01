import {Component, inject, input} from '@angular/core';
import {DataTypeService} from '../../service/data-type.service';
import DataType from '../../model/data-type.model';
import {NgIf} from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';
import {RouterOutlet} from '@angular/router';
import {
  InstanceSelectorComponent
} from '../../component/instance-selector/instance-selector.component';
import {NumberUtil} from '../../util/number.util';

@Component({
  selector: 'workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [NgIf, DropdownModule, FormsModule, RouterOutlet, InstanceSelectorComponent],
  providers: []
})
export class WorkspacePageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  protected readonly instanceId = input<string>();

  dataTypes = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  selectDataType(dataType: DataType) {
    // TODO: Update query params
  }
}
