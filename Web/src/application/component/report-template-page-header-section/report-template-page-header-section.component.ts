import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'report-template-page-header-section',
  imports: [
    ButtonGoBackComponent,
    TranslatePipe
  ],
  templateUrl: './report-template-page-header-section.component.html',
  styles: ``
})
export class ReportTemplatePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
