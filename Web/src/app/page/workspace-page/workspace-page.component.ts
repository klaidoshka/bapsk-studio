import {Component, computed, effect, inject, Signal, signal, untracked} from '@angular/core';
import {
  DataEntryShowcaseComponent
} from '../../component/data-entry-showcase/data-entry-showcase.component';
import {DataTypeService} from '../../service/data-type.service';
import {InstanceService} from '../../service/instance.service';
import DataType from '../../model/data-type.model';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-workspace-page',
  templateUrl: './workspace-page.component.html',
  imports: [DataEntryShowcaseComponent, Message],
  providers: []
})
export class WorkspacePageComponent {
  private dataTypeService = inject(DataTypeService);
  private instanceService = inject(InstanceService);

  $dataType = signal<DataType | null>(null);
  $dataTypes!: Signal<DataType[]>;
  $instanceId!: Signal<number | null>;

  constructor() {
    this.$instanceId = computed(() => this.instanceService.getActiveInstance()()?.id || null);
    this.$dataTypes = this.dataTypeService.getAllAsSignal();

    effect(() => {
      const dataTypes = this.$dataTypes();
      const dataType = untracked(() => this.$dataType());

      if (dataTypes.length > 0 && !dataTypes.find((dt) => dt.id === dataType?.id)) {
        untracked(() => this.$dataType.set(dataTypes[0]));
      } else if (dataTypes.length === 0) {
        untracked(() => this.$dataType.set(null));
      }
    });
  }

  select(dataType: DataType) {
    this.$dataType.set(dataType);
  }
}
