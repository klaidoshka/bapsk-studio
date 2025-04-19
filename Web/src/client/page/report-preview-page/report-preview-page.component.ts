import {Component, inject} from '@angular/core';
import {ReportService} from '../../service/report.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';

@Component({
  selector: 'report-preview-page',
  imports: [
    NgForOf,
    NgIf,
    TableModule,
    DataTypeEntryFieldDisplayComponent
  ],
  templateUrl: './report-preview-page.component.html',
  styles: ``
})
export class ReportPreviewPageComponent {
  private readonly reportService = inject(ReportService);

  reports = rxResource({
    loader: () => this.reportService.generateDataEntryReports({
      from: new Date("2023-01-01"),
      to: new Date("2025-12-31"),
      reportTemplateId: 2
    })
  });
}
