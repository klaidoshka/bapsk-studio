import {Component, input} from '@angular/core';
import Messages from '../../model/messages.model';

@Component({
  selector: 'app-messages-showcase',
  imports: [],
  templateUrl: './messages-showcase.component.html',
  styles: ``
})
export class MessagesShowcaseComponent {
  messages = input.required<Messages>();
}
