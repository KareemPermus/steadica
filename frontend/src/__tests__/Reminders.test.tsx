import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Reminders from '../pages/Reminders';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../api/client';

const mockReminders = [
  { id: 1, habitId: 1, habitName: 'Meditate', time: '08:00', days: 'Mon,Wed,Fri', enabled: true },
  { id: 2, habitId: 2, habitName: 'Read', time: '21:00', days: 'Mon,Tue', enabled: false },
];
const mockHabits = [
  { id: 1, name: 'Meditate', frequency: 'daily', createdAt: '2024-01-01' },
  { id: 2, name: 'Read', frequency: 'daily', createdAt: '2024-01-01' },
];

beforeEach(() => {
  vi.clearAllMocks();
  (apiClient.get as any).mockImplementation((url: string) => {
    if (url === '/api/reminders') return Promise.resolve({ data: mockReminders });
    if (url === '/api/habits') return Promise.resolve({ data: mockHabits });
    return Promise.resolve({ data: [] });
  });
});

describe('Reminders', () => {
  it('renders reminders list', async () => {
    render(<Reminders />);
    await waitFor(() => {
      expect(screen.getByText('Meditate')).toBeTruthy();
      expect(screen.getByText('Read')).toBeTruthy();
    });
    expect(screen.getByText('2 reminders configured')).toBeTruthy();
  });

  it('opens create modal on button click', async () => {
    render(<Reminders />);
    await waitFor(() => screen.getByText('New Reminder'));
    fireEvent.click(screen.getByText('New Reminder'));
    expect(screen.getByText('Create')).toBeTruthy();
  });

  it('shows empty state when no reminders', async () => {
    (apiClient.get as any).mockImplementation((url: string) => {
      if (url === '/api/reminders') return Promise.resolve({ data: [] });
      if (url === '/api/habits') return Promise.resolve({ data: mockHabits });
      return Promise.resolve({ data: [] });
    });
    render(<Reminders />);
    await waitFor(() => {
      expect(screen.getByText(/No reminders yet/)).toBeTruthy();
    });
  });

  it('calls delete API when trash icon clicked', async () => {
    (apiClient.delete as any).mockResolvedValue({ data: { message: 'deleted' } });
    render(<Reminders />);
    await waitFor(() => screen.getByText('Meditate'));
    const deleteButtons = document.querySelectorAll('[class*="iconBtn"]');
    // Every card has edit + delete = 2 icon buttons each, delete is second
    fireEvent.click(deleteButtons[1]);
    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/api/reminders/1');
    });
  });
});