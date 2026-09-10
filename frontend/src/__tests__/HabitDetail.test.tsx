import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HabitDetail from '../pages/HabitDetail';
import apiClient from '../api/client';

vi.mock('../api/client', () => ({
  default: { get: vi.fn() },
}));

const mockHabit = {
  id: 1, name: 'Read', description: 'Read books', frequency: 'daily',
  color: '#10b981', categoryId: 1, createdAt: '2024-01-01T00:00:00Z',
  currentStreak: 5, longestStreak: 14, tags: [{ id: 1, name: 'wellness' }],
};

const mockCheckins = [
  { id: 1, habitId: 1, date: '2024-06-09', completed: true, note: 'Good', habitName: 'Read' },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/habits/1']}>
      <Routes><Route path="/habits/:id" element={<HabitDetail />} /></Routes>
    </MemoryRouter>
  );
}

describe('HabitDetail', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('renders habit details on success', async () => {
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url.includes('/api/habits/')) return Promise.resolve({ data: mockHabit });
      return Promise.resolve({ data: mockCheckins });
    });
    renderPage();
    await waitFor(() => expect(screen.getByText('Read')).toBeTruthy());
    expect(screen.getByText('wellness')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('shows error state on failure', async () => {
    (apiClient.get as any).mockRejectedValue(new Error('fail'));
    renderPage();
    await waitFor(() => expect(screen.getByText('Failed to load habit details.')).toBeTruthy());
  });
});