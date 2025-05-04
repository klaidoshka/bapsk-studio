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
import {SortEvent} from 'primeng/api';
import {FieldType} from '../../model/data-type-field.model';

@Component({
  selector: 'report-preview-page',
  imports: [
    NgForOf,
    TableModule,
    DataTypeEntryFieldDisplayComponent,
    Button,
    NgClass,
    CardComponent
  ],
  templateUrl: './report-preview-page.component.html',
  styles: ``
})
export class ReportPreviewPageComponent {
  private readonly reportService = inject(ReportService);
  private readonly router = inject(Router);
  protected readonly instanceId = input.required<string>();
  protected readonly instanceIdAsNumber = computed(() => NumberUtil.parse(this.instanceId()));
  protected readonly reports = this.router.lastSuccessfulNavigation?.extras?.state as Reports | undefined;
  protected readonly reportContainers = viewChildren<ElementRef>('reportContainer');

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

  onSort(event: SortEvent) {
    event.data?.sort((a: ReportEntry, b: ReportEntry) => {
      if (!event.multiSortMeta || event.multiSortMeta.length === 0) {
        return 0;
      }

      for (const meta of event.multiSortMeta) {
        const field = meta.field;
        const order = meta.order;
        const fieldA = a.fields.find((_, index) => index.toString() === field);
        const fieldB = b.fields.find((_, index) => index.toString() === field);

        if (fieldA == null && fieldB != null) {
          return -order;
        }

        if (fieldA != null && fieldB == null) {
          return order;
        }

        if (fieldA == null && fieldB == null) {
          continue;
        }

        const fieldType = fieldA!.type;
        let comparisonResult = 0;

        switch (fieldType) {
          case FieldType.Currency:
          case FieldType.Number:
            comparisonResult = (Number(fieldA!.value) - Number(fieldB!.value)) * order;
            break;
          case FieldType.Date:
            comparisonResult = (new Date(fieldA!.value).getTime() - new Date(fieldB!.value).getTime()) * order;
            break;
          default:
            comparisonResult = fieldA!.value.toString()
              .localeCompare(fieldB!.value.toString()) * order;
        }

        if (comparisonResult !== 0) {
          return comparisonResult;
        }
      }

      return 0;
    });
  }
}
