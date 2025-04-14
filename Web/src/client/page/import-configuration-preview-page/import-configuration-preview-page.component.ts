import {Component, inject, input} from '@angular/core';
import {ImportConfigurationService} from '../../service/import-configuration.service';
import {ImportConfigurationField} from '../../model/import-configuration.model';
import {TableModule} from 'primeng/table';
import {Card} from 'primeng/card';
import {NgIf} from '@angular/common';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'import-configuration-preview-page',
  imports: [
    TableModule,
    Card,
    NgIf,
    DataTypeEntryFieldDisplayComponent
  ],
  templateUrl: './import-configuration-preview-page.component.html',
  styles: ``
})
export class ImportConfigurationPreviewPageComponent {
  private importConfigurationService = inject(ImportConfigurationService);

  configuration = rxResource({
    request: () => ({
      configurationId: +this.configurationId()
    }),
    loader: ({request}) => this.importConfigurationService.getById(request.configurationId)
  });

  configurationId = input.required<string>();

  readonly resolveDataTypeField = (field: ImportConfigurationField) => {
    return this.configuration
      .value()!.dataType.fields
      .find((dataTypeField) => dataTypeField.id === field.dataTypeFieldId)!;
  }
}
