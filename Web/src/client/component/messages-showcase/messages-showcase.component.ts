import {Component, input} from '@angular/core';
import Messages from '../../model/messages.model';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'messages-showcase',
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './messages-showcase.component.html',
  styles: ``
})
export class MessagesShowcaseComponent {
  messages = input.required<Messages>();

  readonly containsMessage = () => this.messages().error || this.messages().success || this.messages().warning;
}
