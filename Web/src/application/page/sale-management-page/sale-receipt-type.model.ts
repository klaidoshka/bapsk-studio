export enum SaleReceiptType {
  CashRegister,
  Invoice
}

export const saleReceiptTypes = [
  {label: 'page.sale.receipt-type.invoice', value: SaleReceiptType.Invoice},
  {label: 'page.sale.receipt-type.receipt', value: SaleReceiptType.CashRegister}
]
