import {Component, input} from '@angular/core';
import Messages from '../../model/messages.model';
import {Message} from 'primeng/message';

@Component({
  selector: 'app-messages-showcase',
  imports: [
    Message
  ],
  templateUrl: './messages-showcase.component.html',
  styles: ``
})
export class MessagesShowcaseComponent {
  messages = input.required<Messages>();
}
