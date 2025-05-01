import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";

@Component({
  selector: 'instance-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './instance-page-header-section.component.html',
  styles: ``
})
export class InstancePageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
