import {Component, input, OnInit, signal} from '@angular/core';
import {User} from '../../model/user.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {getUserIsoCountryLabel} from "../../model/iso-country.model";
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-user-preview',
  imports: [
    Button,
    Dialog,
    DatePipe
  ],
  templateUrl: './user-preview.component.html',
  styles: ``
})
export class UserPreviewComponent implements OnInit {
  user = signal<User | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.user.set(null);
  }

  readonly show = (user: User | null) => {
    this.user.set(user);
    this.isShown.set(true);
  }

  protected readonly getCountryName = getUserIsoCountryLabel;
}
