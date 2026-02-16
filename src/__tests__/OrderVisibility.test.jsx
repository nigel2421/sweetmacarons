
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from '../App';
import { onAuthStateChanged } from 'firebase/auth';
import { query, onSnapshot, where } from 'firebase/firestore';
import { checkIsAdmin } from '../admin';

// Mock Firebase
vi.mock('../firebase', () => ({
    auth: {},
    db: {},
}));

vi.mock('firebase/auth', () => ({
    onAuthStateChanged: vi.fn(),
    getAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    query: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()), // Returns an unsubscribe function
    orderBy: vi.fn(),
    where: vi.fn(),
    getFirestore: vi.fn(),
}));

vi.mock('../admin', () => ({
    checkIsAdmin: vi.fn(),
}));

// Mock components that we don't need to test in depth here
vi.mock('../Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('../Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('../CartModal', () => ({ default: () => null }));
vi.mock('../ProductModal', () => ({ default: () => null }));

describe('Order Visibility Logic in App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('fetches only user orders for regular users', async () => {
        const mockUser = { uid: 'user123', email: 'user@example.com' };
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockUser);
            return () => { };
        });
        checkIsAdmin.mockResolvedValue(false);

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(checkIsAdmin).toHaveBeenCalledWith(mockUser);
        });

        // Verify that 'where' was called with the correct user ID
        expect(where).toHaveBeenCalledWith('userId', '==', 'user123');
        expect(query).toHaveBeenCalled();
        expect(onSnapshot).toHaveBeenCalled();
    });

    test('fetches all orders for admin users', async () => {
        const mockAdmin = { uid: 'admin123', email: 'admin@example.com' };
        onAuthStateChanged.mockImplementation((auth, callback) => {
            callback(mockAdmin);
            return () => { };
        });
        checkIsAdmin.mockResolvedValue(true);

        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(checkIsAdmin).toHaveBeenCalledWith(mockAdmin);
        });

        // Verify that 'where' was NOT called for admins
        expect(where).not.toHaveBeenCalled();
        expect(query).toHaveBeenCalled();
        expect(onSnapshot).toHaveBeenCalled();
    });
});
