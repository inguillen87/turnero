// Placeholder for Auth (NextAuth or other)
// In a real app, this would integrate with next-auth/react session
// For now, we mock a session if DEMO_MODE is set

export async function getSession() {
  if (process.env.DEMO_MODE === '1') {
    return {
      user: {
        id: 'demo-user-id',
        email: 'admin@demo.com',
        globalRole: 'USER', // 'SUPER_ADMIN' for SA testing
      }
    };
  }
  return null;
}
