import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'data-entry-page-header-section',
  imports: [
    ButtonGoBackComponent,
    TranslatePipe
  ],
  templateUrl: './data-entry-page-header-section.component.html',
  styles: ``
})
export class DataEntryPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
