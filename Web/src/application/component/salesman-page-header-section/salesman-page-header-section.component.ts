import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'salesman-page-header-section',
  imports: [
    ButtonGoBackComponent,
    TranslatePipe
  ],
  templateUrl: './salesman-page-header-section.component.html',
  styles: ``
})
export class SalesmanPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
