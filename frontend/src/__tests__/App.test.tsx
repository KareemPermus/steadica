import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the app shell with brand name', () => {
    render(<App />);
    expect(screen.getAllByText('Steadica').length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /habits/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /analytics/i })).toBeTruthy();
  });
});