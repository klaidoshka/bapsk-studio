import {Component, inject, input} from '@angular/core';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'confirmation',
  imports: [
    ConfirmDialog
  ],
  templateUrl: './confirmation.component.html',
  styles: ``
})
export class ConfirmationComponent {
  private readonly confirmationService = inject(ConfirmationService);
  readonly key = input.required<string>();
  readonly header = input<string>("Are you sure about this action?");

  request(accept: () => void, reject: () => void = () => {}) {
    this.confirmationService.confirm({
      key: this.key(),
      accept: () => accept(),
      reject: () => reject()
    });
  }
}
