import {Component, signal} from '@angular/core';
import Customer from '../../model/customer.model';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {DatePipe, NgIf} from '@angular/common';
import {getIsoCountryLabel} from '../../model/iso-country.model';
import {getIdentityDocumentTypeLabel} from '../../model/identity-document-type.model';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'customer-preview',
  imports: [
    Button,
    Dialog,
    DatePipe,
    TableModule,
    NgIf
  ],
  templateUrl: './customer-preview.component.html',
  styles: ``
})
export class CustomerPreviewComponent {
  protected readonly getCountryName = getIsoCountryLabel;
  protected readonly getIdentityDocumentTypeLabel = getIdentityDocumentTypeLabel;
  protected readonly getIsoCountryLabel = getIsoCountryLabel;

  customer = signal<Customer | null>(null);
  isShown = signal<boolean>(false);

  hide() {
    this.isShown.set(false);
    this.customer.set(null);
  }

  show(customer: Customer | null) {
    this.customer.set(customer);
    this.isShown.set(true);
  }
}
