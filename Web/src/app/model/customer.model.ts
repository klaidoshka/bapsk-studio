import {IdentityDocumentType} from './identity-document-type.model';
import {IsoCountryCode} from './iso-country.model';

export default interface Customer {
  birthdate: Date;
  firstName: string;
  id?: number;
  identityDocument: CustomerIdentityDocument;
  lastName: string;
}

export interface CustomerIdentityDocument {
  issuedBy: IsoCountryCode;
  number: string;
  type: IdentityDocumentType;
  value?: string;
}

export interface CustomerCreateRequest {
  customer: Customer;
  instanceId: number;
}

export interface CustomerEditRequest {
  customer: Customer;
  instanceId: number;
}

export const toCustomerFullName = (customer?: Customer | null): string => {
  if (customer == null) {
    return '';
  }

  return `${customer.firstName} ${customer.lastName}`;
}
