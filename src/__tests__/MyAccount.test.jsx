
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import MyAccount from '../pages/MyAccount';
import { auth } from '../firebase';

// Mock Firebase
vi.mock('../firebase', () => ({
    auth: {
        currentUser: { email: 'user@example.com' },
        signOut: vi.fn(() => Promise.resolve()),
    },
}));

describe('MyAccount Component', () => {
    test('renders user email correctly', () => {
        render(
            <BrowserRouter>
                <MyAccount />
            </BrowserRouter>
        );

        expect(screen.getByText(/My Account/i)).toBeInTheDocument();
        expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });

    test('calls logout when button is clicked', () => {
        const onLogout = vi.fn();
        render(
            <BrowserRouter>
                <MyAccount onLogout={onLogout} />
            </BrowserRouter>
        );

        const logoutButton = screen.getByRole('button', { name: /Sign Out/i });
        fireEvent.click(logoutButton);

        expect(auth.signOut).toHaveBeenCalled();
    });

    test('shows login message if no user', () => {
        // Mock user as null
        auth.currentUser = null;

        render(
            <BrowserRouter>
                <MyAccount />
            </BrowserRouter>
        );

        expect(screen.getByText(/Please login to view this page/i)).toBeInTheDocument();
    });
});
