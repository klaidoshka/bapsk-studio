import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';

@Component({
  selector: 'data-entry-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './data-entry-page-header-section.component.html',
  styles: ``
})
export class DataEntryPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
