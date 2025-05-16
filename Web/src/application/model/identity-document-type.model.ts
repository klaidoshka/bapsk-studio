export enum IdentityDocumentType {
  Passport = 1,
  NationalId = 2
}

export const identityDocumentTypes = [
  { label: 'misc.id-type.card', value: IdentityDocumentType.NationalId },
  { label: 'misc.id-type.passport', value: IdentityDocumentType.Passport }
];

export const getIdentityDocumentTypeLabel = (type: IdentityDocumentType): string => {
  return identityDocumentTypes.find(item => item.value === type)!.label;
}
