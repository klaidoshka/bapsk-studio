import {Component, input} from '@angular/core';
import Messages from '../../model/messages.model';
import {NgClass, NgIf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'messages-showcase',
  imports: [
    NgClass,
    NgIf,
    TranslatePipe
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
