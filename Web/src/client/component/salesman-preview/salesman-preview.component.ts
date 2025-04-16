import {Component, input, OnInit, signal} from '@angular/core';
import Salesman from '../../model/salesman.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {getIsoCountryLabel} from '../../model/iso-country.model';

@Component({
  selector: 'salesman-preview',
  imports: [
    Button,
    Dialog
  ],
  templateUrl: './salesman-preview.component.html',
  styles: ``
})
export class SalesmanPreviewComponent {
  salesman = signal<Salesman | null>(null);
  isShown = signal<boolean>(false);

  protected readonly getIsoCountryLabel = getIsoCountryLabel;

  hide() {
    this.isShown.set(false);
    this.salesman.set(null);
  }

  show(salesman: Salesman | null) {
    this.salesman.set(salesman);
    this.isShown.set(true);
  }
}
