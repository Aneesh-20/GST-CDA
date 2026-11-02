// TaxMate - Role-Based Access Control & Tenant Boundary Enforcement

export type AppRole = 'OWNER' | 'CA' | 'KIOSK_OPERATOR' | 'ADMIN' | 'VIEWER';

export interface RolePermissions {
  canEditInvoices: boolean;
  canViewReports: boolean;
  canPrepareDrafts: boolean;
  canAuthorizeFiling: boolean;
  canManageIntegrations: boolean;
  canManageTeam: boolean;
  canAccessVault: boolean;
}

export const ROLE_PERMISSIONS: Record<AppRole, RolePermissions> = {
  OWNER: {
    canEditInvoices: true,
    canViewReports: true,
    canPrepareDrafts: true,
    canAuthorizeFiling: true,
    canManageIntegrations: true,
    canManageTeam: true,
    canAccessVault: true,
  },
  CA: {
    canEditInvoices: true,
    canViewReports: true,
    canPrepareDrafts: true,
    canAuthorizeFiling: false, // Requires explicit Owner authorization
    canManageIntegrations: false,
    canManageTeam: false,
    canAccessVault: true,
  },
  KIOSK_OPERATOR: {
    canEditInvoices: true,
    canViewReports: true,
    canPrepareDrafts: true,
    canAuthorizeFiling: false, // Restricted
    canManageIntegrations: false,
    canManageTeam: false,
    canAccessVault: false, // Restricted for privacy
  },
  ADMIN: {
    canEditInvoices: false,
    canViewReports: true,
    canPrepareDrafts: false,
    canAuthorizeFiling: false,
    canManageIntegrations: true,
    canManageTeam: true,
    canAccessVault: false,
  },
  VIEWER: {
    canEditInvoices: false,
    canViewReports: true,
    canPrepareDrafts: false,
    canAuthorizeFiling: false,
    canManageIntegrations: false,
    canManageTeam: false,
    canAccessVault: false,
  },
};

export function hasPermission(role: AppRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

