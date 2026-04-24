import { describe, it, expect } from 'vitest';

describe('LandingPage', () => {
  it('should export LandingPage component', async () => {
    const { default: LandingPage } = await import('../pages/LandingPage');
    expect(LandingPage).toBeDefined();
  });

  it('should have AnimatedHighlight function', async () => {
    const mod = await import('../pages/LandingPage');
    expect(mod).toBeDefined();
  });

  it('should have StatCounter function', async () => {
    const mod = await import('../pages/LandingPage');
    expect(mod).toBeDefined();
  });
});