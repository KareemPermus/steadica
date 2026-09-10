import { describe, it, expect } from 'vitest';
import { apiClient } from '../api/client';

describe('apiClient', () => {
  it('has empty string baseURL by default', () => {
    expect(apiClient.defaults.baseURL).toBe('');
  });

  it('has content-type json header', () => {
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
  });
});