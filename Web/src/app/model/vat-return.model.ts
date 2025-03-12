export default interface VatReturnDeclaration {
  correction: number;
  declaredById?: number;
  id: string;
  instanceId?: number;
  sale: VatReturnDeclarationSale
  state: SubmitDeclarationState;
  submitDate: string;
}

export interface VatReturnDeclarationSubmitRequest {
  affirmation: boolean;
  instanceId: number;
  sale: VatReturnDeclarationSale;
}

export interface VatReturnDeclarationSale {
  id: number;
  customer: {
    id: number;
  },
  salesman: {
    id: number;
  }
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
