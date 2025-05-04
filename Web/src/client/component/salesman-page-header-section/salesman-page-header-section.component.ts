import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";

@Component({
  selector: 'salesman-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './salesman-page-header-section.component.html',
  styles: ``
})
export class SalesmanPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
