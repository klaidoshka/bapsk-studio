export enum Role {
  Admin = 1,
  User = 2
}

export const roles = [
  { label: "misc.user.role.admin", value: Role.Admin },
  { label: "misc.user.role.user", value: Role.User }
]

export interface RoleInfo {
  label: string;
  severity: "info" | "danger";
  value: Role;
}

export const toRoleInfo = (role: Role): RoleInfo => {
  const label = roles.find((r) => r.value === role)?.label ?? roles.find(r => r.value === Role.User)!.label!;
  const severity = role === Role.Admin ? "danger" : "info";

  return {
    label,
    severity,
    value: role
  }
}
