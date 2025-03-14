import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CombatTracker from '../CombatTracker';

describe('CombatTracker Component', () => {
  test('renders CombatTracker component', () => {
    render(<CombatTracker />);
    expect(screen.getByText('Combat Tracker')).toBeInTheDocument();
  });

  test('adds a new combatant', () => {
    render(<CombatTracker />);
    fireEvent.change(screen.getByPlaceholderText('Combatant Name'), {
      target: { value: 'Test Combatant' },
    });
    fireEvent.change(screen.getByPlaceholderText('HP'), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText('AC'), {
      target: { value: '15' },
    });
    fireEvent.click(screen.getByText('Add Combatant'));

    expect(screen.getByText('Test Combatant')).toBeInTheDocument();
  });

  test('removes a combatant', () => {
    render(<CombatTracker />);
    fireEvent.change(screen.getByPlaceholderText('Combatant Name'), {
      target: { value: 'Test Combatant' },
    });
    fireEvent.change(screen.getByPlaceholderText('HP'), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText('AC'), {
      target: { value: '15' },
    });
    fireEvent.click(screen.getByText('Add Combatant'));

    fireEvent.click(screen.getByText('Remove'));
    expect(screen.queryByText('Test Combatant')).toBeNull();
  });

  test('updates combatant initiative', () => {
    render(<CombatTracker />);
    fireEvent.change(screen.getByPlaceholderText('Combatant Name'), {
      target: { value: 'Test Combatant' },
    });
    fireEvent.change(screen.getByPlaceholderText('HP'), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByPlaceholderText('AC'), {
      target: { value: '15' },
    });
    fireEvent.click(screen.getByText('Add Combatant'));

    const initiativeInput = screen.getByPlaceholderText('Initiative');
    fireEvent.change(initiativeInput, { target: { value: '20' } });
    expect((initiativeInput as HTMLInputElement).value).toBe('20');
  });
});
