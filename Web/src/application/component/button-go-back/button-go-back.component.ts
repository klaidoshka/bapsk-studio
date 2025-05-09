import {Component, inject} from '@angular/core';
import {Button} from "primeng/button";
import {Location} from '@angular/common';

@Component({
  selector: 'button-go-back',
  imports: [
    Button
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
