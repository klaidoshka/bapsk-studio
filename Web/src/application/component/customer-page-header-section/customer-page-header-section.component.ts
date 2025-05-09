import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";

@Component({
  selector: 'customer-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './customer-page-header-section.component.html',
  styles: ``
})
export class CustomerPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
