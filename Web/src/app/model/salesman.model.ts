import {IsoCountryCode} from './iso-country.model';

export default interface Salesman {
  id?: number;
  name: string;
  vatPayerCode: SalesmanVatPayerCode;
}

export interface SalesmanCreateRequest {
  instanceId: number;
  salesman: Salesman;
}

export interface SalesmanEditRequest {
  salesman: Salesman;
}

export interface SalesmanVatPayerCode {
  issuedBy: IsoCountryCode;
  value: string;
}
