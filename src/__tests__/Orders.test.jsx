
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
        expect(screen.getAllByText(/#LTM-101/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/#LTM-102/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/#LTM-103/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/#LTM-104/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/#LTM-105/)[0]).toBeInTheDocument();

        // Completed/Historical orders should not be visible
        expect(screen.queryByText(/#LTM-106/)).not.toBeInTheDocument();
        expect(screen.queryByText(/#LTM-107/)).not.toBeInTheDocument();
    });

    test('switches to completed/historical orders tab and filters correctly', () => {
        render(<Orders orders={mockOrders} />);

        const completedTab = screen.getByRole('button', { name: /Completed\/Historical Orders/i });
        fireEvent.click(completedTab);

        // Completed/Historical orders
        expect(screen.getAllByText(/#LTM-106/)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/#LTM-107/)[0]).toBeInTheDocument();

        // Active orders should not be visible
        expect(screen.queryByText(/#LTM-101/)).not.toBeInTheDocument();
    });

    test('handles bulk status updates for multiple orders', async () => {
        render(<Orders orders={mockOrders} isAdmin={true} />);
        
        // Select all checkbox
        const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(selectAllCheckbox);
        
        // Verify bulk actions bar appears
        expect(screen.getByText(/5\s+orders selected/i)).toBeInTheDocument();
        
        // Change bulk status
        const bulkSelect = screen.getByDisplayValue("Select Status...");
        fireEvent.change(bulkSelect, { target: { value: 'shipped' } });
        
        // Click apply
        const applyBtn = screen.getByText(/Apply to All/i);
        fireEvent.click(applyBtn);
        
        // Since we're in a test, we verify that it *would* call the update logic or show feedback
        // In this mock, we can just check if the bar is still there or if toast was called if we mock it
    });

    test('opens order details modal when an order is clicked', async () => {
        render(<Orders orders={mockOrders} />);
        
        // Find the "View Details" button for the first order
        const detailsButtons = screen.getAllByText(/View Details/i);
        fireEvent.click(detailsButtons[0]);

        await waitFor(() => {
            expect(screen.getByTestId('order-details-modal')).toBeInTheDocument();
            expect(screen.getByText('Order ID: LTM-101')).toBeInTheDocument();
        });
    });
});
