import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'instance-page-header-section',
  imports: [
    ButtonGoBackComponent,
    TranslatePipe
  ],
  templateUrl: './instance-page-header-section.component.html',
  styles: ``
})
export class InstancePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
