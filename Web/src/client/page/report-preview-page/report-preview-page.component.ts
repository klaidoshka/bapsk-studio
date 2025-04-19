import {Component, ElementRef, inject, viewChildren} from '@angular/core';
import {ReportService} from '../../service/report.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {Button} from 'primeng/button';

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

  reportContainers = viewChildren<ElementRef>('reportContainer');

  reports = rxResource({
    loader: () => this.reportService.generateDataEntryReports({
      from: new Date("2023-01-01"),
      to: new Date("2025-12-31"),
      reportTemplateId: 2
    })
  });

  export(index: number) {
    const element = this.reportContainers()?.at(index)?.nativeElement;

    if (!element) {
      return;
    }

    this.reportService.export(element);
  }
}
