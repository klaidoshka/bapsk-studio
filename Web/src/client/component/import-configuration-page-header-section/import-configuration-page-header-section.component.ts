import {Component, input} from '@angular/core';
import {ButtonGoBackComponent} from "../button-go-back/button-go-back.component";

@Component({
  selector: 'import-configuration-page-header-section',
  imports: [
    ButtonGoBackComponent
  ],
  templateUrl: './import-configuration-page-header-section.component.html',
  styles: ``
})
export class ImportConfigurationPageHeaderSectionComponent {
  readonly canGoBack = input<boolean>();
}
