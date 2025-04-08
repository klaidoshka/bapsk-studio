import {UserIdentity} from './user.model';
import Sale from './sale.model';
import {UnitOfMeasureType} from './unit-of-measure-type.model';

export default interface VatReturnDeclaration {
  correction: number;
  declaredById?: number;
  export?: VatReturnDeclarationExport;
  id: string;
  instanceId?: number;
  isCanceled: boolean;
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

export interface VatReturnDeclarationExportAssessmentCondition {
  code: string;
  description: string;
  isMet: boolean;
  totalAmountVerified: number;
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

export const getSubmitDeclarationStateLabel = (state?: SubmitDeclarationState | null): string => {
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
