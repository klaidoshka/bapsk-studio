import {Component, input, OnInit, signal} from '@angular/core';
import Sale from '../../model/sale.model';
import {Button} from 'primeng/button';
import {CurrencyPipe, DatePipe, NgIf} from '@angular/common';
import {Dialog} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {RoundPipe} from '../../pipe/round.pipe';

@Component({
  selector: 'sale-preview',
  imports: [
    Button,
    DatePipe,
    Dialog,
    TableModule,
    NgIf,
    RoundPipe,
    CurrencyPipe
  ],
  templateUrl: './sale-preview.component.html',
  styles: ``
})
export class SalePreviewComponent {
  sale = signal<Sale | null>(null);
  isShown = signal<boolean>(false);

  hide() {
    this.isShown.set(false);
    this.sale.set(null);
  }

  show(sale: Sale | null) {
    this.sale.set(sale);
    this.isShown.set(true);
  }
}
