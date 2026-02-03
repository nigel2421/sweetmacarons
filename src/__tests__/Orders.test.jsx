
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Orders from '../pages/Orders';
import { auth, db } from '../firebase';
import { getDocs } from 'firebase/firestore';

// Mock Firebase
vi.mock('../firebase', () => ({
    auth: {
        onAuthStateChanged: vi.fn(),
        currentUser: { email: 'user@example.com', uid: '123' },
        signOut: vi.fn(() => Promise.resolve()),
    },
    db: {},
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
}));

// Mock papaparse
vi.mock('papaparse', () => ({
    default: {
        unparse: vi.fn(() => 'csv,data'),
    },
}));

describe('Orders Component', () => {
    const mockOrders = [
        {
            id: 'LTM-1',
            status: 'pending',
            macaronsTotal: 1200,
            deliveryFee: 400,
            depositAmount: 360,
            balance: 1240,
            cart: [{ name: 'Vanilla', quantity: 1, option: { box: 6 } }],
            createdAt: { toDate: () => new Date('2024-01-01') },
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock behavior for auth
        auth.onAuthStateChanged.mockImplementation((cb) => {
            cb({ email: 'user@example.com', uid: '123' });
            return () => { };
        });
        // Default mock for firestore
        getDocs.mockResolvedValue({
            docs: mockOrders.map((order) => ({
                id: order.id,
                data: () => order,
            })),
        });

        // Mock global window.URL.createObjectURL
        window.URL.createObjectURL = vi.fn();
        // Mock location for tests
        delete window.location;
        window.location = { pathname: '/orders' };
    });

    test('renders order listing for normal user', async () => {
        render(
            <BrowserRouter>
                <Orders />
            </BrowserRouter>
        );

        // Should show loading first
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        // Wait for orders to load
        await waitFor(() => {
            expect(screen.getByText('LTM-1')).toBeInTheDocument();
        });

        expect(screen.getByText(/My Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/Ksh 1,600/i)).toBeInTheDocument();
        expect(screen.getByText(/Ksh 360/i)).toBeInTheDocument();
    });

    test('renders all orders for admin', async () => {
        auth.onAuthStateChanged.mockImplementation((cb) => {
            cb({ email: 'lostresmacarons@gmail.com', uid: 'admin-uid' });
            return () => { };
        });

        render(
            <BrowserRouter>
                <Orders />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('LTM-1')).toBeInTheDocument();
        });

        expect(screen.getByText(/All Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/Download as CSV/i)).toBeInTheDocument();
    });

    test('filters orders based on search term', async () => {
        render(
            <BrowserRouter>
                <Orders />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('LTM-1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText(/Search by Order ID/i);
        fireEvent.change(searchInput, { target: { value: 'NON-EXISTENT' } });

        expect(screen.queryByText('LTM-1')).not.toBeInTheDocument();
        expect(screen.getByText(/No orders found/i)).toBeInTheDocument();
    });

    test('calls logout functionality', async () => {
        const onLogout = vi.fn();
        render(
            <BrowserRouter>
                <Orders onLogout={onLogout} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('LTM-1')).toBeInTheDocument();
        });

        const logoutButton = screen.getByRole('button', { name: /Logout/i });
        fireEvent.click(logoutButton);

        expect(auth.signOut).toHaveBeenCalled();
    });
});
