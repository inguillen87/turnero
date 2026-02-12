import { describe, it } from "node:test";
import assert from "node:assert";
import { registerSchema } from "./auth.ts";

describe("Registration Validation Schema", () => {
  it("should validate a correct registration payload", () => {
    const validPayload = {
      tenantName: "Clínica Test",
      slug: "clinica-test",
      email: "test@example.com",
      password: "password123",
    };
    const result = registerSchema.safeParse(validPayload);
    assert.strictEqual(result.success, true);
  });

  it("should fail if tenantName is too short", () => {
    const invalidPayload = {
      tenantName: "Cl",
      slug: "clinica-test",
      email: "test@example.com",
      password: "password123",
    };
    const result = registerSchema.safeParse(invalidPayload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(issue => issue.path.includes("tenantName")));
    }
  });

  it("should fail if slug is invalid", () => {
    const invalidPayload = {
      tenantName: "Clínica Test",
      slug: "Clínica Test", // Invalid chars (spaces, uppercase, accents)
      email: "test@example.com",
      password: "password123",
    };
    const result = registerSchema.safeParse(invalidPayload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(issue => issue.path.includes("slug")));
    }
  });

  it("should fail if email is invalid", () => {
    const invalidPayload = {
      tenantName: "Clínica Test",
      slug: "clinica-test",
      email: "invalid-email",
      password: "password123",
    };
    const result = registerSchema.safeParse(invalidPayload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(issue => issue.path.includes("email")));
    }
  });

  it("should fail if password is too short", () => {
    const invalidPayload = {
      tenantName: "Clínica Test",
      slug: "clinica-test",
      email: "test@example.com",
      password: "short",
    };
    const result = registerSchema.safeParse(invalidPayload);
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some(issue => issue.path.includes("password")));
    }
  });
});
