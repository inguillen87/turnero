const WRITE_ROLES = new Set(['OWNER', 'ADMIN', 'TENANT_ADMIN']);

export function normalizeRole(role?: string | null) {
  return (role || '').toUpperCase().trim();
}

export function isSuperAdminRole(role?: string | null) {
  return normalizeRole(role) === 'SUPER_ADMIN';
}

export function isWriteMembershipRole(role?: string | null) {
  return WRITE_ROLES.has(normalizeRole(role));
}

export function isDemoTenantStatus(status?: string | null) {
  return normalizeRole(status) === 'DEMO';
}
