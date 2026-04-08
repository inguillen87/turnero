import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isDemoTenantStatus, isSuperAdminRole, isWriteMembershipRole, normalizeRole } from './tenant-access-rules.ts';

describe('tenant-access role helpers', () => {
  it('normalizes roles safely', () => {
    assert.strictEqual(normalizeRole(' admin '), 'ADMIN');
    assert.strictEqual(normalizeRole(undefined), '');
  });

  it('detects super admins', () => {
    assert.strictEqual(isSuperAdminRole('SUPER_ADMIN'), true);
    assert.strictEqual(isSuperAdminRole('user'), false);
  });

  it('detects write membership roles', () => {
    assert.strictEqual(isWriteMembershipRole('OWNER'), true);
    assert.strictEqual(isWriteMembershipRole('ADMIN'), true);
    assert.strictEqual(isWriteMembershipRole('TENANT_ADMIN'), true);
    assert.strictEqual(isWriteMembershipRole('STAFF'), false);
  });

  it('detects demo tenant status', () => {
    assert.strictEqual(isDemoTenantStatus('DEMO'), true);
    assert.strictEqual(isDemoTenantStatus('active'), false);
  });
});
