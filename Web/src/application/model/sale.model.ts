import Salesman from './salesman.model';
import Customer from './customer.model';
import {UnitOfMeasureType} from './unit-of-measure-type.model';
import {VatReturnDeclarationWithDeclarer} from './vat-return.model';

export default interface Sale {
  cashRegister?: CashRegister;
  customer: Customer;
  date: Date;
  id: number;
  instanceId?: number;
  invoiceNo?: string;
  salesman: Salesman;
  soldGoods: SoldGood[];
}

export interface SaleWithVatReturnDeclaration extends Sale {
  vatReturnDeclaration?: VatReturnDeclarationWithDeclarer;
}

export interface SaleCreateEdit {
  cashRegister?: CashRegister;
  customerId: number;
  date: Date;
  id?: number;
  invoiceNo?: string;
  salesmanId: number;
  soldGoods: SoldGoodCreateEdit[];
}

export interface SaleCreateRequest {
  instanceId: number;
  sale: SaleCreateEdit;
}

export interface SaleEditRequest {
  instanceId: number;
  sale: SaleCreateEdit;
}

export interface CashRegister {
  cashRegisterNo: string;
  receiptNo: string;
}

export interface SoldGood {
  description: string;
  id: number;
  quantity: number;
  sequenceNo: number;
  taxableAmount: number;
  totalAmount: number;
  unitOfMeasure: string;
  unitOfMeasureType: UnitOfMeasureType;
  vatAmount: number;
  vatRate: number;
}

export interface SoldGoodCreateEdit {
  description: string;
  id?: number;
  quantity: number;
  unitOfMeasure: string;
  unitOfMeasureType: UnitOfMeasureType;
  unitPrice: number;
  vatRate: number;
}
