
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Orders from '../pages/Orders';

// Mock the OrderDetailsModal to isolate the Orders component
vi.mock('../pages/OrderDetailsModal', () => ({
    default: vi.fn(({ show, order, onClose, onUpdateStatus }) => {
        if (!show) return null;
        return (
            <div data-testid="order-details-modal">
                <h2>Order Details</h2>
                <p>Order ID: {order.orderId}</p>
                <button onClick={onClose}>Close</button>
                <button onClick={() => onUpdateStatus(order.id, 'shipped')}>Update Status</button>
            </div>
        );
    }),
}));

const mockOrders = [
    { id: '1', orderId: 'LTM-101', status: 'pending', grandTotal: 100, createdAt: { toDate: () => new Date() } },
    { id: '2', orderId: 'LTM-102', status: 'deposit-paid', grandTotal: 150, createdAt: { toDate: () => new Date() } },
    { id: '3', orderId: 'LTM-103', status: 'in-progress', grandTotal: 200, createdAt: { toDate: () => new Date() } },
    { id: '4', orderId: 'LTM-104', status: 'shipped', grandTotal: 250, createdAt: { toDate: () => new Date() } },
    { id: '5', orderId: 'LTM-105', status: 'delivered', grandTotal: 300, createdAt: { toDate: () => new Date() } },
    { id: '6', orderId: 'LTM-106', status: 'order-closed', grandTotal: 350, createdAt: { toDate: () => new Date() } },
    { id: '7', orderId: 'LTM-107', status: 'cancelled', grandTotal: 400, createdAt: { toDate: () => new Date() } },
];


describe('Orders Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders active orders by default', () => {
        render(<Orders orders={mockOrders} />);
        
        // Active orders
        expect(screen.getByText(/Order #LTM-101/)).toBeInTheDocument();
        expect(screen.getByText(/Order #LTM-102/)).toBeInTheDocument();
        expect(screen.getByText(/Order #LTM-103/)).toBeInTheDocument();
        expect(screen.getByText(/Order #LTM-104/)).toBeInTheDocument();
        expect(screen.getByText(/Order #LTM-105/)).toBeInTheDocument();

        // Completed/Historical orders should not be visible
        expect(screen.queryByText(/Order #LTM-106/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Order #LTM-107/)).not.toBeInTheDocument();
    });

    test('switches to completed/historical orders tab and filters correctly', () => {
        render(<Orders orders={mockOrders} />);

        const completedTab = screen.getByRole('button', { name: /Completed\/Historical Orders/i });
        fireEvent.click(completedTab);

        // Completed/Historical orders
        expect(screen.getByText(/Order #LTM-106/)).toBeInTheDocument();
        expect(screen.getByText(/Order #LTM-107/)).toBeInTheDocument();

        // Active orders should not be visible
        expect(screen.queryByText(/Order #LTM-101/)).not.toBeInTheDocument();
    });

    test('opens order details modal when an order card is clicked', async () => {
        render(<Orders orders={mockOrders} />);
        
        const orderCard = screen.getByText(/Order #LTM-101/).closest('.order-card');
        fireEvent.click(orderCard);

        await waitFor(() => {
            expect(screen.getByTestId('order-details-modal')).toBeInTheDocument();
            expect(screen.getByText('Order ID: LTM-101')).toBeInTheDocument();
        });
    });
});
