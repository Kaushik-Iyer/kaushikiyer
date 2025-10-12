// src/lib/auth.ts - Simple authentication utility
export function checkAuth(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  return password === adminPassword;
}

export function hashPassword(password: string): string {
  // Simple hash for session storage (not secure for production, use bcrypt in real apps)
  return Buffer.from(password).toString('base64');
}

export function verifySession(sessionHash: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123';
  const expectedHash = hashPassword(adminPassword);
  return sessionHash === expectedHash;
}
