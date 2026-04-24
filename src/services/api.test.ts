import { describe, it, expect } from 'vitest';

describe('API Service', () => {
  it('should export default api', async () => {
    const { default: api } = await import('../services/api');
    expect(api).toBeDefined();
  });

  it('should export verifyToken function', async () => {
    const { verifyToken } = await import('../services/api');
    expect(verifyToken).toBeDefined();
    expect(typeof verifyToken).toBe('function');
  });

  it('should export getMe function', async () => {
    const { getMe } = await import('../services/api');
    expect(getMe).toBeDefined();
    expect(typeof getMe).toBe('function');
  });

  it('should export getAllUsers function', async () => {
    const { getAllUsers } = await import('../services/api');
    expect(getAllUsers).toBeDefined();
    expect(typeof getAllUsers).toBe('function');
  });

  it('should export getSimulations function', async () => {
    const { getSimulations } = await import('../services/api');
    expect(getSimulations).toBeDefined();
    expect(typeof getSimulations).toBe('function');
  });
});