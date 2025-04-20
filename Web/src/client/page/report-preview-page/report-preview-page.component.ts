import {Component, ElementRef, inject, viewChildren} from '@angular/core';
import {ReportService} from '../../service/report.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {
  DataTypeEntryFieldDisplayComponent
} from '../../component/data-type-entry-field-display/data-type-entry-field-display.component';
import {Button} from 'primeng/button';
import {Router} from '@angular/router';
import {Reports} from '../../model/report.model';

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

  reports = this.router.lastSuccessfulNavigation?.extras?.state as Reports | undefined;
  reportContainers = viewChildren<ElementRef>('reportContainer');

  export(index: number) {
    const element = this.reportContainers()?.at(index)?.nativeElement;

    if (!element) {
      return;
    }

    this.reportService.export(element);
  }
}
