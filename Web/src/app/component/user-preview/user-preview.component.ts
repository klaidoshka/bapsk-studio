import {Component, input, OnInit, signal} from '@angular/core';
import {User} from '../../model/user.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {getCountryName} from "../../model/iso-country.model";

@Component({
  selector: 'app-user-preview',
  imports: [
    Button,
    Dialog
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

  hide() {
    this.isShown.set(false);
    this.user.set(null);
  }

  show(instance: User | null) {
    this.user.set(instance);
    this.isShown.set(true);
  }

  protected readonly getCountryName = getCountryName;
}
