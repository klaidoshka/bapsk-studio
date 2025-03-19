import {UserIdentity} from './user.model';

export default interface VatReturnDeclaration {
  correction: number;
  declaredById?: number;
  id: string;
  instanceId?: number;
  qrCodes: string[];
  saleId: number;
  state: SubmitDeclarationState;
  submitDate: string;
}

export interface VatReturnDeclarationWithDeclarer extends VatReturnDeclaration {
  declaredBy?: UserIdentity;
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
