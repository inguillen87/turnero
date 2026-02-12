import { describe, it, mock } from "bun:test";
import assert from "node:assert";

describe("Auth Security Check", () => {
    it("should NOT allow login with hardcoded credentials when DB fails", async () => {
        // Mock implementation to simulate DB failure
        const mockFindUnique = mock(() => {
          throw new Error("DB Connection Error");
        });

        const mockPrisma = {
          user: {
            findUnique: mockFindUnique
          }
        };

        // Set global prisma BEFORE importing authOptions to mock the singleton
        (global as any).prisma = mockPrisma;

        // Dynamic import to ensure global.prisma is picked up
        const { authOptions } = await import("./auth");

        // Arrange
        const credentials = {
            email: "admin@demo.com",
            password: "Demo123!"
        };

        // Act
        // Find credentials provider options
        // @ts-ignore
        const credentialsProvider = authOptions.providers.find((p: any) => p.id === "credentials" || (p.options && p.options.name === "Credentials"));

        if (!credentialsProvider) {
            throw new Error("Credentials provider not found in authOptions");
        }

        // Call authorize directly
        // @ts-ignore
        const user = await credentialsProvider.options.authorize(credentials);

        // Assert
        assert.strictEqual(user, null, "User should be null (login failed) when DB is down");

        // Verify that findUnique was actually called (mock was used)
        assert.strictEqual(mockFindUnique.mock.calls.length, 1, "DB findUnique should have been called");
    });
});
