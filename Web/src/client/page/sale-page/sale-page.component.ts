import {Component, inject, input, signal, viewChild} from '@angular/core';
import {ErrorMessageResolverService} from '../../service/error-message-resolver.service';
import {SaleService} from '../../service/sale.service';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {toCustomerFullName} from '../../model/customer.model';
import Messages from '../../model/messages.model';
import Sale, {SaleWithVatReturnDeclaration, SoldGood} from '../../model/sale.model';
import {first, of} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {
  MessagesShowcaseComponent
} from '../../component/messages-showcase/messages-showcase.component';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {NumberUtil} from '../../util/number.util';

@Component({
  selector: 'sale-page',
  imports: [
    MessagesShowcaseComponent,
    ConfirmationComponent,
    Button,
    TableModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './sale-page.component.html',
  styles: ``
})
export class SalePageComponent {
  private readonly errorMessageResolverService = inject(ErrorMessageResolverService);
  private readonly router = inject(Router);
  private readonly saleService = inject(SaleService);
  protected readonly toCustomerFullName = toCustomerFullName;
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly sales = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.saleService.getAllWithVatDeclarationByInstanceId(request.instanceId)
      : of(undefined)
  });

  protected delete(sale: Sale) {
    this.confirmationComponent().request(() => {
      this.saleService
        .delete(NumberUtil.parse(this.instanceId())!, sale.id)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Sale deleted successfully']}),
          error: (response) => this.errorMessageResolverService.resolveHttpErrorResponseTo(response, this.messages)
        });
    });
  }

  protected getTotalPrice(soldGoods: SoldGood[]): number {
    return soldGoods.reduce((total, soldGood) => total + soldGood.totalAmount, 0);
  }

  protected manage(sale?: Sale) {
    this.router.navigate(['/home/workspace/sale/' + (sale ? `${sale.id}/edit` : 'create')]);
  }

  protected preview(sale: SaleWithVatReturnDeclaration) {
    this.router.navigate(['/home/workspace/sale/' + sale.id]);
  }

  protected vatReturnDeclaration(sale: SaleWithVatReturnDeclaration) {
    this.router.navigate(['/home/workspace/sale/' + sale.id + '/vat-return-declaration']);
  }
}
