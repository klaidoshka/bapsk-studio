//
// public CashRegister? CashRegister { get; set; }
// public Customer.Customer Customer { get; set; } = new();
// public DateTime Date { get; set; } = DateTime.UtcNow;
// public int? Id { get; set; }
// public string? InvoiceNo { get; set; }
// public Salesman.Salesman Salesman { get; set; } = new();
// public IEnumerable<SoldGood> SoldGoods { get; set; } = new List<SoldGood>();

import Salesman from './salesman.model';
import Customer from './customer.model';
import {UnitOfMeasureType} from './unit-of-measure-type.model';

export default interface Sale {
  cashRegister?: CashRegister;
  customer: Customer;
  date: Date;
  id?: number;
  invoiceNo?: string;
  salesman: Salesman;
  soldGoods: SoldGood[];
}

export interface SaleCreateEdit {
  cashRegister?: CashRegister;
  customerId: number;
  date: Date;
  id?: number;
  invoiceNo?: string;
  salesmanId: number;
  soldGoods: SoldGood[];
}

export interface SaleCreateRequest {
  instanceId: number;
  sale: SaleCreateEdit;
}

export interface SaleEditRequest {
  sale: SaleCreateEdit;
}

export interface CashRegister {
  cashRegisterNo: string;
  receiptNo: string;
}

export interface SoldGood {
  description: string;
  id?: number;
  quantity: number;
  sequenceNo: string;
  taxableAmount: number;
  totalAmount: number;
  unitOfMeasure: string;
  unitOfMeasureType: UnitOfMeasureType;
  vatAmount: number;
  vatRate: number;
}
