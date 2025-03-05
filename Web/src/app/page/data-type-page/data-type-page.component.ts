import {Component} from '@angular/core';
import {
  DataTypeShowcaseComponent
} from '../../component/data-type-showcase/data-type-showcase.component';

@Component({
  selector: 'app-data-type-page',
  templateUrl: './data-type-page.component.html',
  imports: [DataTypeShowcaseComponent],
  providers: []
})
export class DataTypePageComponent {
}
