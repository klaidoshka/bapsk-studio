export enum IdentityDocumentType {
  Passport = 1,
  NationalId = 2
}

export const getIdentityDocumentTypeLabel = (type?: IdentityDocumentType | null): string => {
  switch (type) {
    case IdentityDocumentType.Passport:
      return 'Passport';
    case IdentityDocumentType.NationalId:
      return 'National ID';
    default:
      return '';
  }
}
