export enum Role {
  Admin = 1,
  User = 2
}

export const roles = [
  { label: "Admin", value: Role.Admin },
  { label: "User", value: Role.User }
]

export const toRoleLabel = (role: Role): string => {
  return roles.find((r) => r.value === role)?.label ?? '';
}
