import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Analytics from '../pages/Analytics';

vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

import { apiClient } from '../api/client';

const mockProgress = {
  daily: [{ date: '2024-01-01', completionRate: 80 }],
  byHabit: [{ habitId: 1, habitName: 'Meditate', completionRate: 75, currentStreak: 5, longestStreak: 10 }],
  byCategory: [{ categoryId: 1, categoryName: 'Health', completionRate: 90 }],
};

const mockDashboard = {
  totalHabits: 6,
  todayCompleted: 3,
  todayTotal: 6,
  overallCompletionRate: 87,
  topStreaks: [{ habitId: 1, habitName: 'Meditate', currentStreak: 14 }],
};

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats and charts on success', async () => {
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url.includes('progress')) return Promise.resolve({ data: mockProgress });
      return Promise.resolve({ data: mockDashboard });
    });

    render(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText('Insights')).toBeTruthy();
      expect(screen.getByText('87%')).toBeTruthy();
      expect(screen.getByText('14 days')).toBeTruthy();
      expect(screen.getByText('Meditate')).toBeTruthy();
    });
  });

  it('shows error on fetch failure', async () => {
    (apiClient.get as any).mockRejectedValue(new Error('fail'));

    render(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load analytics')).toBeTruthy();
    });
  });
});