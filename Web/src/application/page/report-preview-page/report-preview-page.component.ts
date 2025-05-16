import {Component, computed, ElementRef, inject, input, viewChildren} from '@angular/core';
import {ReportService} from '../../service/report.service';
import {NgClass, NgForOf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';
import {ReportEntry, Reports} from '../../model/report.model';
import {NumberUtil} from '../../util/number.util';
import {CardComponent} from '../../component/card/card.component';
import {FieldTypeUtil} from '../../util/field-type.util';
import {FieldType} from '../../model/data-type-field.model';
import {TranslatePipe} from '@ngx-translate/core';

interface ReportEntryModified extends ReportEntry {
  [key: string]: any;
}

@Component({
  selector: 'report-preview-page',
  imports: [
    NgForOf,
    TableModule,
    DataTypeEntryFieldDisplayComponent,
    Button,
    NgClass,
    CardComponent,
    TranslatePipe
  ],
  templateUrl: './report-preview-page.component.html',
  styles: ``
})
export class ReportPreviewPageComponent {
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);
  protected readonly FieldType = FieldType;
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));
  protected readonly reports = this.router.lastSuccessfulNavigation?.extras?.state as Reports | undefined;
  protected readonly reportContainers = viewChildren<ElementRef>('reportContainer');

  protected getType(entries: ReportEntry[], fieldIndex: number): FieldType {
    let type: FieldType = FieldType.Text;

    for (const entry of entries) {
      const field = entry.fields.at(fieldIndex);

      if (field?.value != null) {
        type = field.type;
        break;
      }
    }

    return type;
  }

  protected readonly reportsModified = this.reports?.reports?.map(report => ({
    ...report,
    entries: report.entries.map(entry => {
      const entryModified: ReportEntryModified = {
        ...entry,
        fields: entry.fields.map(field => ({
          ...field,
          value: field.value
        }))
      };

      entryModified.fields.forEach((field, index) => {
        // [!] Not handling FieldType.Reference, because value comes resolved as string from the backend
        entryModified[`field_${index}`] = FieldTypeUtil.toDisplayValue(field.value, field.type, undefined);
      });

      return entryModified;
    })
  })) ?? [];

  protected export(index: number, type: 'pdf' | 'csv') {
    if (type === 'pdf') {
      const element = this.reportContainers()?.at(index)?.nativeElement;

      if (!element) {
        return;
      }

      this.reportService.exportToPdf(element);
    } else if (type === 'csv') {
      const values = this.reports?.reports?.at(index)?.entries;

      if (!values) {
        return;
      }

      this.reportService.exportToCsv(values);
    }
  }
}
