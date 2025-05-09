import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';

@Component({
  selector: 'data-type-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './data-type-page-header-section.component.html',
  styles: ``
})
export class DataTypePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
