import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";

@Component({
  selector: 'sale-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './sale-page-header-section.component.html',
  styles: ``
})
export class SalePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
