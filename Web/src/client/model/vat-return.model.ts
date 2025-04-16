import {UserIdentity} from './user.model';
import Sale from './sale.model';
import {UnitOfMeasureType} from './unit-of-measure-type.model';

export default interface VatReturnDeclaration {
  correction: number;
  declaredById?: number;
  export?: VatReturnDeclarationExport;
  id: string;
  instanceId?: number;
  isCancelled: boolean;
  payments: VatReturnDeclarationPaymentInfo[];
  qrCodes: string[];
  saleId: number;
  state: SubmitDeclarationState;
  submitDate: Date;
}

export interface VatReturnDeclarationWithSale extends VatReturnDeclaration {
  sale: Sale
}

export interface VatReturnDeclarationWithDeclarer extends VatReturnDeclaration {
  declaredBy?: UserIdentity;
}

export interface VatReturnDeclarationExport {
  assessmentDate: Date;
  conditions: VatReturnDeclarationExportAssessmentCondition[];
  correctionDate?: Date;
  customsOfficeCode: string;
  declarationCorrectionNo: number;
  id: number;
  verificationDate: Date;
  verificationResult: VatReturnDeclarationExportVerificationResult;
  verifiedSoldGoods: VatReturnDeclarationExportVerifiedSoldGoods[];
}

export interface VatReturnDeclarationPaymentInfo {
  amount: number;
  date: Date;
  type: PaymentType;
}

export enum PaymentType {
  Cash = 1,
  Bank = 2,
  Other = 3
}

export const PaymentTypes = [
  { id: PaymentType.Cash, label: 'Cash' },
  { id: PaymentType.Bank, label: 'Bank' },
  { id: PaymentType.Other, label: 'Other' }
]

export const toPaymentTypeLabel = (type: PaymentType): string => {
  return PaymentTypes.find(paymentType => paymentType.id === type)?.label || '';
}

export interface VatReturnDeclarationExportAssessmentCondition {
  code: string;
  description: string;
  isMet: boolean;
}

export interface VatReturnDeclarationExportVerifiedSoldGoods {
  quantity: number;
  quantityVerified: number;
  sequenceNo: number;
  totalAmount: number;
  unitOfMeasure: string;
  unitOfMeasureType: UnitOfMeasureType;
}

export enum VatReturnDeclarationExportVerificationResult {
  A1,
  A4
}

export interface VatReturnDeclarationSubmitRequest {
  affirmation: boolean;
  instanceId: number;
  sale: VatReturnDeclarationSubmitRequestSale;
}

export interface VatReturnDeclarationSubmitRequestSale {
  id: number;
  customer: {
    id: number;
  };
  salesman: {
    id: number;
  };
}

export enum SubmitDeclarationState {
  ACCEPTED_CORRECT,
  ACCEPTED_INCORRECT,
  REJECTED
}

export const toSubmitDeclarationStateLabel = (state?: SubmitDeclarationState | null): string => {
  switch (state) {
    case SubmitDeclarationState.ACCEPTED_CORRECT:
      return 'Accepted (Correct)';
    case SubmitDeclarationState.ACCEPTED_INCORRECT:
      return 'Accepted (Incorrect)';
    case SubmitDeclarationState.REJECTED:
      return 'Rejected';
    default:
      return '';
  }
}

export const toExportResultLabel = (result?: VatReturnDeclarationExportVerificationResult | null): string => {
  switch (result) {
    case VatReturnDeclarationExportVerificationResult.A1:
      return 'A1';
    case VatReturnDeclarationExportVerificationResult.A4:
      return 'A4';
    default:
      return '';
  }
}
