
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Dashboard from '../pages/Dashboard';

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
    default: () => <div data-testid="date-picker" />
}));

// Mock Charts
vi.mock('../components/Charts', () => ({
    RevenueChart: () => <div data-testid="revenue-chart" />,
    OrderVolumeChart: () => <div data-testid="order-volume-chart" />,
    StatusPieChart: () => <div data-testid="status-pie-chart" />
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    Link: ({ children, to }) => <a href={to}>{children}</a>
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
        const totalOrdersCard = screen.getByText('Total Orders').closest('.stat-card');
        expect(within(totalOrdersCard).getByText('2')).toBeInTheDocument();

        // Settled Revenue (only delivered) -> 1200 + 400 = 1600
        const settledCard = screen.getByText('Settled Revenue').closest('.stat-card');
        expect(within(settledCard).getByText(/Ksh 1,600/)).toBeInTheDocument();

        // Pending Revenue (status !== delivered) -> 2200 + 0 = 2200
        const pendingCard = screen.getByText('Pending Revenue').closest('.stat-card');
        expect(within(pendingCard).getByText(/Ksh 2,200/)).toBeInTheDocument();
    });

    test('displays top 3 macarons correctly', () => {
        render(<Dashboard orders={mockOrders} />);

        expect(screen.getByText('Top 3 Flavors')).toBeInTheDocument();
        // Vanilla has 2 (order 1) + 1 (order 2) = 3
        // Chocolate has 1
        expect(screen.getByText(/Vanilla/)).toBeInTheDocument();
        expect(screen.getByText(/Chocolate/)).toBeInTheDocument();
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

    test('renders back to account link', () => {
        render(<Dashboard orders={mockOrders} />);
        const backLink = screen.getByText(/Back to Account/i);
        expect(backLink).toBeInTheDocument();
        expect(backLink.closest('a')).toHaveAttribute('href', '/my-account');
    });

    test('renders all chart containers', () => {
        render(<Dashboard orders={mockOrders} />);
        expect(screen.getByTestId('revenue-chart')).toBeInTheDocument();
        expect(screen.getByTestId('order-volume-chart')).toBeInTheDocument();
        expect(screen.getByTestId('status-pie-chart')).toBeInTheDocument();
    });
});
