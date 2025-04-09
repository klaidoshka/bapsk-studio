import {Component, input} from '@angular/core';
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
  key = input.required<string>();
  header = input<string>("Are you sure about this action?");

  constructor(
    private confirmationService: ConfirmationService
  ) {
  }

  request(
    accept: () => void,
    reject: () => void = () => {
    }
  ) {
    this.confirmationService.confirm({
      key: this.key(),
      accept: () => accept(),
      reject: () => reject()
    });
  }
}
