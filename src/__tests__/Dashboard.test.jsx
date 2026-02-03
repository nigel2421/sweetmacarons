
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Dashboard from '../pages/Dashboard';

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
    default: () => <div data-testid="date-picker" />
}));

describe('Dashboard Component', () => {
    const mockOrders = [
        {
            id: '1',
            status: 'delivered',
            macaronsTotal: 1200,
            deliveryFee: 400,
            cart: [{ name: 'Vanilla', quantity: 2 }],
            createdAt: { toDate: () => new Date('2024-01-01') }
        },
        {
            id: '2',
            status: 'pending',
            macaronsTotal: 2200,
            deliveryFee: 0,
            cart: [{ name: 'Chocolate', quantity: 1 }, { name: 'Vanilla', quantity: 1 }],
            createdAt: { toDate: () => new Date() } // Today
        }
    ];

    test('calculates and displays stats correctly', () => {
        render(<Dashboard orders={mockOrders} />);

        // Total Orders
        expect(screen.getByText('Total Orders')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();

        // Total Revenue (only delivered) -> 1200 + 400 = 1600
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText(/Ksh 1,600/)).toBeInTheDocument();

        // Pending Revenue (status !== delivered) -> 2200 + 0 = 2200
        expect(screen.getByText('Pending Revenue')).toBeInTheDocument();
        expect(screen.getByText(/Ksh 2,200/)).toBeInTheDocument();
    });

    test('displays top 3 macarons correctly', () => {
        render(<Dashboard orders={mockOrders} />);

        expect(screen.getByText('Top 3 Macarons')).toBeInTheDocument();
        // Vanilla has 2 (order 1) + 1 (order 2) = 3
        // Chocolate has 1
        expect(screen.getByText('Vanilla')).toBeInTheDocument();
        expect(screen.getByText('Chocolate')).toBeInTheDocument();
    });

    test('filters orders by today', () => {
        render(<Dashboard orders={mockOrders} />);

        const todayButton = screen.getByText('Today');
        fireEvent.click(todayButton);

        // Only order 2 is today
        expect(screen.getByText('Total Orders')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('filters orders by all time', () => {
        render(<Dashboard orders={mockOrders} />);

        const allTimeButton = screen.getByText('All Time');
        fireEvent.click(allTimeButton);

        expect(screen.getByText('2')).toBeInTheDocument();
    });
});
