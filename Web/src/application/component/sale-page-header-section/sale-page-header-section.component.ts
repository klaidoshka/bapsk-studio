import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'sale-page-header-section',
  imports: [
    ButtonGoBackComponent,
    TranslatePipe
  ],
  templateUrl: './sale-page-header-section.component.html',
  styles: ``
})
export class SalePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
