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
  readonly messages = input.required<Messages>();

  protected containsMessage() {
    return this.messages().error || this.messages().success || this.messages().warning;
  }
}
