import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {Location} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'button-go-back',
  imports: [
    Button,
    TranslatePipe
  ],
  templateUrl: './button-go-back.component.html',
  styles: ``
})
export class ButtonGoBackComponent {
  private readonly location = inject(Location);

  protected goBack() {
    this.location.back();
  }
}
