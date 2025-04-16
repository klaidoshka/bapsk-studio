import {Component, signal} from '@angular/core';
import {User} from '../../model/user.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {getUserIsoCountryLabel} from "../../model/iso-country.model";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'user-preview',
  imports: [
    Button,
    Dialog,
    DatePipe
  ],
  templateUrl: './user-preview.component.html',
  styles: ``
})
export class UserPreviewComponent {
  user = signal<User | null>(null);
  isShown = signal<boolean>(false);

  protected readonly getCountryName = getUserIsoCountryLabel;

  hide() {
    this.isShown.set(false);
    this.user.set(null);
  }

  show(user: User | null) {
    this.user.set(user);
    this.isShown.set(true);
  }
}
