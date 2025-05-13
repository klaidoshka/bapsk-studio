import {Component, inject, input, signal, viewChild} from '@angular/core';
import {MessageHandlingService} from '../../service/message-handling.service';
import {SaleService} from '../../service/sale.service';
import {ConfirmationComponent} from '../../component/confirmation/confirmation.component';
import {toCustomerFullName} from '../../model/customer.model';
import Messages from '../../model/messages.model';
import Sale, {SaleWithVatReturnDeclaration, SoldGood} from '../../model/sale.model';
import {first, map, of} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {MessagesShowcaseComponent} from '../../component/messages-showcase/messages-showcase.component';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {NumberUtil} from '../../util/number.util';
import {SalePageHeaderSectionComponent} from '../../component/sale-page-header-section/sale-page-header-section.component';
import {CardComponent} from '../../component/card/card.component';
import {SubmitDeclarationState} from '../../model/vat-return.model';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'sale-page',
  imports: [
    MessagesShowcaseComponent,
    ConfirmationComponent,
    Button,
    TableModule,
    CurrencyPipe,
    DatePipe,
    SalePageHeaderSectionComponent,
    CardComponent,
    Badge
  ],
  templateUrl: './sale-page.component.html',
  styles: ``
})
export class SalePageComponent {
  private readonly messageHandlingService = inject(MessageHandlingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly saleService = inject(SaleService);
  protected readonly SubmitDeclarationState = SubmitDeclarationState;
  protected readonly confirmationComponent = viewChild.required(ConfirmationComponent);
  protected readonly instanceId = input.required<string>();
  protected readonly messages = signal<Messages>({});

  protected readonly sales = rxResource({
    request: () => ({instanceId: NumberUtil.parse(this.instanceId())}),
    loader: ({request}) => request.instanceId
      ? this.saleService
        .getAllWithVatDeclarationByInstanceId(request.instanceId)
        .pipe(
          map(sales => sales.map(sale => ({
            ...sale,
            customer: {...sale.customer, fullName: toCustomerFullName(sale.customer)},
            vatReturnDeclarationStatus: this.getVatDeclarationStatus(sale)
          })))
        )
      : of(undefined)
  });

  protected delete(sale: Sale) {
    this.confirmationComponent().request(() => {
      this.saleService
        .delete(NumberUtil.parse(this.instanceId())!, sale.id)
        .pipe(first())
        .subscribe({
          next: () => this.messages.set({success: ['Sale deleted successfully']}),
          error: (response) => this.messageHandlingService.consumeHttpErrorResponse(response, this.messages)
        });
    });
  }

  protected getTotalPrice(soldGoods: SoldGood[]): number {
    return soldGoods.reduce((total, soldGood) => total + soldGood.totalAmount, 0);
  }

  protected getTotalVAT(soldGoods: SoldGood[]): number {
    return soldGoods.reduce((total, soldGood) => total + soldGood.vatAmount, 0);
  }

  protected getVatDeclarationStatus(sale: SaleWithVatReturnDeclaration) {
    if (!sale.vatReturnDeclaration) {
      return {value: 'Not Submitted', severity: 'contrast' };
    } else if (sale.vatReturnDeclaration.isCancelled) {
      return {value: 'Cancelled', severity: 'danger' };
    } else if (sale.vatReturnDeclaration.state === SubmitDeclarationState.REJECTED) {
      return {value: 'Rejected', severity: 'warn' };
    } else if (sale.vatReturnDeclaration.export) {
      return {value: 'Exported', severity: 'info' };
    } else {
      return {value: 'Accepted', severity: 'success' };
    }
  }

  protected manage(sale?: Sale) {
    this.router.navigate(['./' + (sale ? `${sale.id}/edit` : 'create')], {relativeTo: this.route});
  }

  protected preview(sale: SaleWithVatReturnDeclaration) {
    this.router.navigate(['./' + sale.id], {relativeTo: this.route});
  }

  protected vatReturnDeclaration(sale: SaleWithVatReturnDeclaration) {
    this.router.navigate(['./' + sale.id + '/vat-return-declaration'], {relativeTo: this.route});
  }
}
