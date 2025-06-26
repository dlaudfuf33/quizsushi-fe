export enum AdminRole {
  ROOT = "ROOT",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  VIEWER = "VIEWER",
}
export function hasRole(userRole: AdminRole, targetRole: AdminRole): boolean {
  return userRole === targetRole;
}
