import {Component, input, OnInit, signal} from '@angular/core';
import Customer from '../../model/customer.model';

@Component({
  selector: 'app-customer-preview',
  imports: [],
  templateUrl: './customer-preview.component.html',
  styles: ``
})
export class CustomerPreviewComponent implements OnInit {
  customer = signal<Customer | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  readonly ngOnInit = () => {
    this.isShown.set(this.isShownInitially());
  }

  readonly hide = () => {
    this.isShown.set(false);
    this.customer.set(null);
  }

  readonly show = (customer: Customer | null) => {
    this.customer.set(customer);
    this.isShown.set(true);
  }
}
