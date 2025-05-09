import {Component, input} from '@angular/core';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'badge-contrasted',
  imports: [
    Badge
  ],
  templateUrl: './badge-contrasted.component.html',
  styles: ``
})
export class BadgeContrastedComponent {
  readonly value = input.required<string | number>();
}
