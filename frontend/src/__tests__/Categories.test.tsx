import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Categories from '../pages/Categories';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../api/client';

const mockCategories = [
  { id: 1, name: 'Health', color: '#10b981', habitCount: 3 },
  { id: 2, name: 'Learning', color: '#3b82f6', habitCount: 5 },
];

describe('Categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.get as any).mockResolvedValue({ data: mockCategories });
  });

  it('renders categories from API', async () => {
    render(<Categories />);
    await waitFor(() => {
      expect(screen.getByText('Health')).toBeTruthy();
      expect(screen.getByText('Learning')).toBeTruthy();
    });
    expect(screen.getByText('3 habits')).toBeTruthy();
  });

  it('opens create modal and submits', async () => {
    (apiClient.post as any).mockResolvedValue({ data: { id: 3, name: 'Work', color: '#f59e0b' } });
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Health')).toBeTruthy());

    fireEvent.click(screen.getByText('New Category'));
    expect(screen.getByText('New Category', { selector: 'h3' })).toBeTruthy();

    const input = screen.getByPlaceholderText('e.g. Health & Fitness');
    fireEvent.change(input, { target: { value: 'Work' } });
    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/categories', { name: 'Work', color: '#10b981' });
    });
  });

  it('filters categories by search', async () => {
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('Health')).toBeTruthy());

    fireEvent.change(screen.getByPlaceholderText('Search categories…'), { target: { value: 'learn' } });
    expect(screen.queryByText('Health')).toBeNull();
    expect(screen.getByText('Learning')).toBeTruthy();
  });

  it('shows empty state when no categories', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [] });
    render(<Categories />);
    await waitFor(() => expect(screen.getByText('No categories found')).toBeTruthy());
  });
});