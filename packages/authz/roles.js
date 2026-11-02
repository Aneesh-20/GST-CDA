// GST CDA - Role-Based Access Control & Tenant Boundary Enforcement (Compiled JS)
export const ROLE_PERMISSIONS = {
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

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}
