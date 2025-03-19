import {Component, input, OnInit, signal} from '@angular/core';
import Sale from '../../model/sale.model';
import {Button} from 'primeng/button';
import {DatePipe, NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {RoundPipe} from '../../pipe/round.pipe';

@Component({
  selector: 'app-sale-preview',
  imports: [
    Button,
    DatePipe,
    Dialog,
    TableModule,
    NgIf,
    RoundPipe
  ],
  templateUrl: './sale-preview.component.html',
  styles: ``
})
export class SalePreviewComponent implements OnInit {
  sale = signal<Sale | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.sale.set(null);
  }

  readonly show = (sale: Sale | null) => {
    this.sale.set(sale);
    this.isShown.set(true);
  }
}
