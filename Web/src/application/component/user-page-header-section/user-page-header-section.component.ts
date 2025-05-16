import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from '../button-go-back/button-go-back.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'user-page-header-section',
  imports: [
    ButtonGoBackComponent,
    TranslatePipe
  ],
  templateUrl: './user-page-header-section.component.html',
  styles: ``
})
export class UserPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
