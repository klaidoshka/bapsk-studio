import {Component, inject, signal} from '@angular/core';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {MessagesShowcaseComponent} from '../messages-showcase/messages-showcase.component';
import Messages from '../../model/messages.model';
import {Select} from 'primeng/select';
import {SaleService} from '../../service/sale.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {InstanceService} from '../../service/instance.service';
import {combineLatest, first, map, switchMap} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FloatLabel} from 'primeng/floatlabel';
import {toCustomerFullName} from '../../model/customer.model';
import {VatReturnService} from '../../service/vat-return.service';
import Sale from '../../model/sale.model';
import {MessageHandlingService} from '../../service/message-handling.service';

@Component({
  selector: 'mock-sale-button-form',
  imports: [
    Button,
    Dialog,
    MessagesShowcaseComponent,
    Select,
    ReactiveFormsModule,
    FormsModule,
    FloatLabel
  ],
  templateUrl: './mock-sale-button-form.component.html',
  styles: ``
})
export class MockSaleButtonFormComponent {
  private readonly instanceService = inject(InstanceService);
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly saleService = inject(SaleService);
  private readonly vatReturnService = inject(VatReturnService);
  protected readonly isVisible = signal<boolean>(false);
  protected readonly messages = signal<Messages>({});
  protected readonly selectedSale = signal<Sale | undefined>(undefined);

  protected readonly sales = rxResource({
    loader: () => this.instanceService
      .getAll()
      .pipe(
        switchMap(instances => combineLatest(
          instances.map(instance => this.saleService.getAllByInstanceId(instance.id!))
        )),
        map(sales => sales
          .flatMap(sales => sales)
          .map(sale => ({
            label: `#${sale.id} | C: ${toCustomerFullName(sale.customer)} S: ${sale.salesman.vatPayerCode.value}`,
            sale: sale
          })))
      )
  });

  protected mock() {
    const sale = this.selectedSale();

    if (!sale) {
      this.messages.set({ error: ['Please select a sale.'] });
      return;
    }

    this.vatReturnService
      .mockExport(sale.instanceId!, sale.id)
      .pipe(first())
      .subscribe({
        next: () => this.messages.set({ success: ['Mocked successfully.'] }),
        error: (error) => this.messageHandlingService.consumeHttpErrorResponse(error, this.messages)
      });
  }
}
