import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';

@Component({
  selector: 'report-template-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './report-template-page-header-section.component.html',
  styles: ``
})
export class ReportTemplatePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
