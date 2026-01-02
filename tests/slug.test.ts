import { describe, expect, it } from 'vitest';
import { isValidSlug } from '../lib/slug';

describe('slug validation', () => {
  it('accepts lowercase hyphenated slugs', () => {
    expect(isValidSlug('demo-restaurant')).toBe(true);
  });

  it('rejects uppercase or spaces', () => {
    expect(isValidSlug('Demo Restaurant')).toBe(false);
    expect(isValidSlug('demo_restaurant')).toBe(false);
  });
});
