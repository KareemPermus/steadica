import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Dashboard from '../pages/Dashboard';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

import apiClient from '../api/client';

const mockStats = {
  totalHabits: 3,
  todayCompleted: 1,
  todayTotal: 3,
  overallCompletionRate: 80,
  topStreaks: [{ habitId: 1, habitName: 'Read', currentStreak: 5 }],
};

const mockHabits = [
  { id: 1, name: 'Read', description: '', frequency: 'Daily', color: '#10b981', categoryId: 1, createdAt: '2024-01-01', tags: [] },
];

const mockCheckins = [
  { id: 1, habitId: 1, habitName: 'Read', date: '2024-06-09', completed: false, note: '' },
];

const mockProgress = {
  daily: [{ date: '2024-06-09', completionRate: 50 }],
  byHabit: [],
  byCategory: [],
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url.includes('analytics/dashboard')) return Promise.resolve({ data: mockStats });
      if (url.includes('analytics/progress')) return Promise.resolve({ data: mockProgress });
      if (url.includes('habits')) return Promise.resolve({ data: mockHabits });
      if (url.includes('checkins')) return Promise.resolve({ data: mockCheckins });
      return Promise.resolve({ data: {} });
    });
  });

  it('renders dashboard stats after loading', async () => {
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Good morning')).toBeTruthy();
    });
    expect(screen.getByText('5 days')).toBeTruthy();
  });

  it('renders today habits and allows toggle', async () => {
    (apiClient.put as any).mockResolvedValue({ data: { ...mockCheckins[0], completed: true } });
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url.includes('analytics/dashboard')) return Promise.resolve({ data: mockStats });
      if (url.includes('analytics/progress')) return Promise.resolve({ data: mockProgress });
      if (url.includes('habits')) return Promise.resolve({ data: mockHabits });
      if (url.includes('checkins')) return Promise.resolve({ data: mockCheckins });
      return Promise.resolve({ data: {} });
    });

    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Read')).toBeTruthy());

    const toggleBtn = screen.getByLabelText('Mark done');
    await userEvent.click(toggleBtn);
    expect(apiClient.put).toHaveBeenCalled();
  });

  it('shows error state on API failure', async () => {
    (apiClient.get as any).mockRejectedValue(new Error('fail'));
    render(<Dashboard />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load dashboard data')).toBeTruthy();
    });
  });
});