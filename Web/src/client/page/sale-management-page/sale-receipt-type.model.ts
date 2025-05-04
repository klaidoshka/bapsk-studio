export enum SaleReceiptType {
  CashRegister,
  Invoice
}

export const saleReceiptTypes = [
  {label: 'Invoice', value: SaleReceiptType.Invoice},
  {label: 'Receipt', value: SaleReceiptType.CashRegister}
]
