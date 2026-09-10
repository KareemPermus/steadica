import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Tags from '../pages/Tags';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../api/client';

describe('Tags page', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders tags from API', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [{ id: 1, name: 'Fitness' }, { id: 2, name: 'Work' }] });
    render(<Tags />);
    await waitFor(() => { expect(screen.getByText('Fitness')).toBeTruthy(); });
    expect(screen.getByText('Work')).toBeTruthy();
    expect(screen.getByText('2 tags total')).toBeTruthy();
  });

  it('creates a new tag on button click', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [] });
    (apiClient.post as any).mockResolvedValue({ data: { id: 3, name: 'Health' } });
    render(<Tags />);
    await waitFor(() => screen.getByText('No tags found'));
    const input = screen.getByPlaceholderText('New tag name…');
    fireEvent.change(input, { target: { value: 'Health' } });
    fireEvent.click(screen.getByText('Add Tag'));
    await waitFor(() => { expect(screen.getByText('Health')).toBeTruthy(); });
  });

  it('shows empty state when no tags', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [] });
    render(<Tags />);
    await waitFor(() => { expect(screen.getByText('No tags found')).toBeTruthy(); });
  });

  it('filters tags by search', async () => {
    (apiClient.get as any).mockResolvedValue({ data: [{ id: 1, name: 'Fitness' }, { id: 2, name: 'Work' }] });
    render(<Tags />);
    await waitFor(() => screen.getByText('Fitness'));
    fireEvent.change(screen.getByPlaceholderText('Search tags…'), { target: { value: 'fit' } });
    expect(screen.getByText('Fitness')).toBeTruthy();
    expect(screen.queryByText('Work')).toBeNull();
  });
});