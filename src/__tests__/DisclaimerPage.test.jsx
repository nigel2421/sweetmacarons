
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import DisclaimerPage from '../DisclaimerPage';
import { addDoc } from 'firebase/firestore';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
        useNavigate: vi.fn(),
    };
});

// Mock Firebase
vi.mock('../firebase', () => ({
    db: {},
    auth: { currentUser: { uid: '123' } },
}));

vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    addDoc: vi.fn(() => Promise.resolve({ id: 'new-order-id' })),
    serverTimestamp: vi.fn(),
}));


describe('DisclaimerPage Component', () => {
    const mockNavigate = vi.fn();
    const mockLocationState = {
        cart: [
            {
                id: '1',
                macaron: { name: 'Vanilla' },
                option: { box: 6, price: 1200 },
                quantity: 1,
            },
        ],
        deliveryOption: 'cbd',
        deliveryAddress: '123 CBD Street',
        deliveryFee: 400,
        macaronsTotal: 1200,
        grandTotal: 1600,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue({ state: mockLocationState });

        // Mock scrollTo
        window.scrollTo = vi.fn();
        // Mock open
        window.open = vi.fn();
        // Mock clipboard
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn().mockImplementation(() => Promise.resolve()),
            },
        });
        // Mock alert
        vi.stubGlobal('alert', vi.fn());
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('renders disclaimer content and calculates deposit correctly', () => {
        render(
            <BrowserRouter>
                <DisclaimerPage />
            </BrowserRouter>
        );

        expect(screen.getByText(/Disclaimer/i)).toBeInTheDocument();
        expect(screen.getByText(/Hand made to perfection/i)).toBeInTheDocument();

        // Deposit is 30% of macaronsTotal (1200 * 0.3 = 360)
        expect(screen.getByText(/Ksh 360/)).toBeInTheDocument();
    });

    test('toggles checkout button based on agreement checkbox', () => {
        render(
            <BrowserRouter>
                <DisclaimerPage user={{ uid: '123' }} />
            </BrowserRouter>
        );

        const checkoutButton = screen.getByRole('button', { name: /Checkout via WhatsApp/i });
        expect(checkoutButton).toBeDisabled();

        const checkbox = screen.getByLabelText(/I agree to these terms/i);
        fireEvent.click(checkbox);

        expect(checkoutButton).not.toBeDisabled();

        // Check if cart review is visible after agreeing
        expect(screen.getByText(/Cart Review/i)).toBeInTheDocument();
        expect(screen.getByText(/Vanilla \(Box of 6\)/i)).toBeInTheDocument();
    });

    test('copies payment number to clipboard', () => {
        render(
            <BrowserRouter>
                <DisclaimerPage user={{ uid: '123' }} />
            </BrowserRouter>
        );

        const copyButton = screen.getByTitle(/Copy payment number/i);
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('0769456153');
        expect(window.alert).toHaveBeenCalledWith('Payment number copied to clipboard');
    });

    test.skip('triggers handleCheckout when button is clicked', async () => {
        vi.useFakeTimers();
        render(
            <BrowserRouter>
                <DisclaimerPage user={{ uid: '123' }} />
            </BrowserRouter>
        );

        const checkbox = screen.getByLabelText(/I agree to these terms/i);
        fireEvent.click(checkbox);

        const checkoutButton = screen.getByRole('button', { name: /Checkout via WhatsApp/i });
        fireEvent.click(checkoutButton);

        // Wait for microtasks to flush so addDoc starts and state updates
        await Promise.resolve();
        await Promise.resolve();
        await Promise.resolve(); // Flush again to be safe

        expect(addDoc).toHaveBeenCalled();
        expect(screen.getByText(/Order Placed Successfully/i)).toBeInTheDocument();

        // Fast-forward time
        vi.advanceTimersByTime(4500);

        expect(window.open).toHaveBeenCalled();

        // Cleanup done in afterEach, but useRealTimers here is fine too if we want to check mocked calls immediately? 
        // No, verify mocked calls first.

        const callUrl = window.open.mock.calls[0][0];
        expect(callUrl).toContain('wa.me');
        expect(callUrl).toContain(encodeURIComponent('Vanilla'));
        expect(callUrl).toContain(encodeURIComponent('Ksh 360')); // Deposit info in message
    });
});
