import {Component, computed, inject, input} from '@angular/core';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {ImportConfigurationField} from '../../model/import-configuration.model';
import {TableModule} from 'primeng/table';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {rxResource} from '@angular/core/rxjs-interop';
import {FieldType} from '../../model/data-type-field.model';
import {DateUtil} from '../../util/date.util';
import {NumberUtil} from '../../util/number.util';
import {of} from 'rxjs';
import {
  ImportConfigurationPageHeaderSectionComponent
} from "../../component/import-configuration-page-header-section/import-configuration-page-header-section.component";
import {
  FailedToLoadPleaseReloadComponent
} from '../../component/failed-to-load-please-reload/failed-to-load-please-reload.component';
import {LoadingSpinnerComponent} from '../../component/loading-spinner/loading-spinner.component';
import {CardComponent} from '../../component/card/card.component';

@Component({
  selector: 'import-configuration-preview-page',
  imports: [
    TableModule,
    DataTypeEntryFieldDisplayComponent,
    ImportConfigurationPageHeaderSectionComponent,
    FailedToLoadPleaseReloadComponent,
    LoadingSpinnerComponent,
    CardComponent
  ],
  templateUrl: './import-configuration-preview-page.component.html',
  styles: ``
})
export class ImportConfigurationPreviewPageComponent {
  private readonly importConfigurationService = inject(ImportConfigurationService);
  protected readonly configurationId = input.required<string>();
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));

  protected readonly configuration = rxResource({
    request: () => ({
      configurationId: NumberUtil.parse(this.configurationId()),
      instanceId: this.instanceIdAsNumber()
    }),
    loader: ({request}) => request.configurationId && request.instanceId
      ? this.importConfigurationService.getById(request.instanceId, request.configurationId)
      : of(undefined)
  });

  protected getExampleCSV() {
    const fields = this.configuration
      .value()!.fields
      .sort((a, b) => a.order > b.order ? 1 : -1)
      .map(field => {
        const dataTypeField = this.resolveDataTypeField(field);
        return {
          field: field,
          dataTypeField: dataTypeField
        };
      });

    const header = fields
      .map(value => value.dataTypeField.name)
      .join(",");

    const values = fields
      .map(value => value.dataTypeField.type === FieldType.Date && value.field.defaultValue
        ? DateUtil.toString(value.field.defaultValue)
        : value.field.defaultValue
      )
      .join(",");

    return {
      header,
      values
    };
  }

  protected resolveDataTypeField(field: ImportConfigurationField) {
    return this.configuration.value()!.dataType.fields.find(dataTypeField =>
      dataTypeField.id === field.dataTypeFieldId
    )!;
  }
}
