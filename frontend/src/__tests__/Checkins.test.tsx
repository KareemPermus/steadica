import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Checkins from '../pages/Checkins';
import apiClient from '../api/client';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

const mockCheckins = [
  { id: 1, habitId: 1, habitName: 'Meditate', date: '2024-06-09', completed: true, note: 'Great session' },
  { id: 2, habitId: 2, habitName: 'Exercise', date: '2024-06-09', completed: false, note: '' },
];

const mockHabits = [
  { id: 1, name: 'Meditate', frequency: 'daily', createdAt: '2024-01-01' },
  { id: 2, name: 'Exercise', frequency: 'daily', createdAt: '2024-01-01' },
];

beforeEach(() => {
  vi.clearAllMocks();
  (apiClient.get as any).mockImplementation((url: string) => {
    if (url === '/api/checkins') return Promise.resolve({ data: mockCheckins });
    if (url === '/api/habits') return Promise.resolve({ data: mockHabits });
    return Promise.resolve({ data: [] });
  });
  (apiClient.put as any).mockResolvedValue({ data: {} });
});

function renderPage() {
  return render(<MemoryRouter><Checkins /></MemoryRouter>);
}

describe('Checkins page', () => {
  it('renders check-ins after loading', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Meditate')).toBeInTheDocument());
    expect(screen.getByText('Exercise')).toBeInTheDocument();
    expect(screen.getByText('1 of 2 completed')).toBeInTheDocument();
  });

  it('toggles a checkin on button click', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Exercise')).toBeInTheDocument());
    const pendingButtons = screen.getAllByText('Pending');
    fireEvent.click(pendingButtons[0].closest('.checkinRow')?.querySelector('button')!);
    await waitFor(() => expect(apiClient.put).toHaveBeenCalledWith('/api/checkins/2', { completed: true, note: '' }));
  });

  it('shows error state on fetch failure', async () => {
    (apiClient.get as any).mockRejectedValueOnce(new Error('fail'));
    renderPage();
    await waitFor(() => expect(screen.getByText('Failed to load check-ins')).toBeInTheDocument());
  });

  it('filters by search text', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText('Meditate')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Search habits or notes…'), { target: { value: 'Exercise' } });
    expect(screen.queryByText('Meditate')).not.toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });
});