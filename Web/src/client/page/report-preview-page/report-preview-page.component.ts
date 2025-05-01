import {Component, computed, ElementRef, inject, input, viewChildren} from '@angular/core';
import {ReportService} from '../../service/report.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';
import {Reports} from '../../model/report.model';
import {NumberUtil} from '../../util/number.util';

@Component({
  selector: 'report-preview-page',
  imports: [
    NgForOf,
    NgIf,
    TableModule,
    DataTypeEntryFieldDisplayComponent,
    Button,
    NgClass
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
}
