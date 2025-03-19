import {Component, input, OnInit, signal} from '@angular/core';
import Customer from '../../model/customer.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {DatePipe, NgIf} from '@angular/common';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {PrimeTemplate} from 'primeng/api';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-customer-preview',
  imports: [
    Button,
    Dialog,
    DatePipe,
    PrimeTemplate,
    TableModule,
    NgIf
  ],
  templateUrl: './customer-preview.component.html',
  styles: ``
})
export class CustomerPreviewComponent implements OnInit {
  customer = signal<Customer | null>(null);
  isShown = signal<boolean>(false);
  isShownInitially = input<boolean>(false);

  ngOnInit() {
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

  protected readonly getCountryName = getIsoCountryLabel;
  protected readonly getIdentityDocumentTypeLabel = getIdentityDocumentTypeLabel;
}
