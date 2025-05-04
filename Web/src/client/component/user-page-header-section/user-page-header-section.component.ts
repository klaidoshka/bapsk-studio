import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';

@Component({
  selector: 'user-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './user-page-header-section.component.html',
  styles: ``
})
export class UserPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
