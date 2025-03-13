import Sale from './sale.model';

export default interface VatReturnDeclaration {
  correction: number;
  declaredById?: number;
  id: string;
  instanceId?: number;
  saleId: number;
  state: SubmitDeclarationState;
  submitDate: string;
}

export interface VatReturnDeclarationSubmitRequest {
  affirmation: boolean;
  instanceId: number;
  sale: Sale;
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
