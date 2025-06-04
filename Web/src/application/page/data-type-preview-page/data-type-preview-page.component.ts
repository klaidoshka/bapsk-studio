import {Component, computed, inject, input} from '@angular/core';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {TableModule} from 'primeng/table';
import DataTypeField, {FieldType, toFieldTypeLabel} from '../../model/data-type-field.model';
import {DataTypeService} from '../../service/data-type.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {of} from 'rxjs';
import {NumberUtil} from '../../util/number.util';
import {
  DataTypePageHeaderSectionComponent
} from '../../component/data-type-page-header-section/data-type-page-header-section.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {CardComponent} from '../../component/card/card.component';
import {Badge} from 'primeng/badge';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'data-type-preview-page',
  imports: [
    DataTypeEntryFieldDisplayComponent,
    TableModule,
    DataTypePageHeaderSectionComponent,
    LoadingSpinnerComponent,
    FailedToLoadPleaseReloadComponent,
    CardComponent,
    Badge,
    TranslatePipe
  ],
  templateUrl: './data-type-preview-page.component.html',
  styles: ``
})
export class DataTypePreviewPageComponent {
  private readonly dataTypeService = inject(DataTypeService);
  protected readonly FieldType = FieldType;
  protected readonly toFieldTypeLabel = toFieldTypeLabel;
  protected readonly dataTypeId = input<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));

  protected readonly dataType = rxResource({
    request: () => ({
      dataTypeId: NumberUtil.parse(this.dataTypeId()),
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({ request }) => request.dataTypeId && request.instanceId
      ? this.dataTypeService.getById(request.instanceId, request.dataTypeId)
      : of(undefined)
  });

  protected readonly dataTypes = rxResource({
    request: () => ({
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({ request }) => request.instanceId
      ? this.dataTypeService.getAllByInstanceId(request.instanceId)
      : of([])
  });

  protected getDisplayFieldName(): string {
    const displayFieldId = this.dataType.value()?.displayFieldId;

    return this.dataType.value()?.fields?.find(it => it.id === displayFieldId)?.name || 'Id';
  }

  protected getReferencedDataTypeName(field: DataTypeField): string | undefined {
    return this.dataTypes.value()?.find(it => it.id === field.referenceId)?.name;
  }

  protected hasReferenceField(): boolean {
    return this.dataType.value()?.fields?.some(it => it.type === FieldType.Reference) ?? false;
  }
}
