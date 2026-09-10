import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Habits from '../pages/Habits';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../api/client';

const mockHabits = [
  { id: 1, name: 'Read', description: 'Read books', frequency: 'daily', color: '#3b82f6', categoryId: 1, createdAt: '2024-01-01', tags: [{ id: 1, name: 'wellness' }] },
  { id: 2, name: 'Exercise', description: '', frequency: 'weekdays', color: '#ef4444', categoryId: null, createdAt: '2024-01-01', tags: [] },
];

const mockCategories = [{ id: 1, name: 'Health', color: '#10b981', habitCount: 1 }];
const mockTags = [{ id: 1, name: 'wellness' }];

beforeEach(() => {
  vi.clearAllMocks();
  (apiClient.get as any).mockImplementation((url: string) => {
    if (url === '/api/habits') return Promise.resolve({ data: mockHabits });
    if (url === '/api/categories') return Promise.resolve({ data: mockCategories });
    if (url === '/api/tags') return Promise.resolve({ data: mockTags });
    return Promise.resolve({ data: [] });
  });
});

function renderPage() {
  return render(<MemoryRouter><Habits /></MemoryRouter>);
}

describe('Habits page', () => {
  it('renders habits from API', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Read')).toBeInTheDocument();
      expect(screen.getByText('Exercise')).toBeInTheDocument();
    });
  });

  it('opens create modal on button click', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Read')).toBeInTheDocument());
    fireEvent.click(screen.getByText('New Habit'));
    expect(screen.getByText('New Habit')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Walk 8,000 steps')).toBeInTheDocument();
  });

  it('filters habits by search', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Read')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Search habits…'), { target: { value: 'exercise' } });
    expect(screen.queryByText('Read')).not.toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });

  it('shows error state on API failure', async () => {
    (apiClient.get as any).mockRejectedValue(new Error('fail'));
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('Failed to load habits')).toBeInTheDocument();
    });
  });
});