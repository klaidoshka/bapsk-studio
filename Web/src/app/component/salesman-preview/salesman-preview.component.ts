import {Component, input, OnInit, signal} from '@angular/core';
import Salesman from '../../model/salesman.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-salesman-preview',
  imports: [
    Button,
    Dialog
  ],
  templateUrl: './salesman-preview.component.html',
  styles: ``
})
export class SalesmanPreviewComponent implements OnInit {
  salesman = signal<Salesman | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.salesman.set(null);
  }

  readonly show = (salesman: Salesman | null) => {
    this.salesman.set(salesman);
    this.isShown.set(true);
  }
}
