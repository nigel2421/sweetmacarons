
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrderDetailsModal from '../pages/OrderDetailsModal';
import { updateDoc } from 'firebase/firestore';

// Mock Firebase
vi.mock('../firebase', () => ({
    db: {},
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(() => ({})), // Return empty object as ref
    updateDoc: vi.fn(),
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('OrderDetailsModal Component', () => {
    const mockOrder = {
        id: 'LTM-1',
        orderId: 'LTM-1',
        status: 'pending',
        macaronsTotal: 1200,
        deliveryFee: 400,
        depositAmount: 360,
        balance: 1240,
        deliveryOption: 'cbd',
        deliveryAddress: '123 CBD Street',
        items: [{ id: 'item1', macaron: { name: 'Vanilla' }, quantity: 2, option: { box: 6, price: 600 } }],
        createdAt: { toDate: () => new Date('2024-01-01T03:00:00') },
    };

    const onClose = vi.fn();
    const onUpdateStatus = vi.fn();
    const onReorder = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders order details correctly', () => {
        render(
            <OrderDetailsModal
                show={true}
                order={mockOrder}
                onClose={onClose}
            />
        );

        expect(screen.getByText(/Order Details/i)).toBeInTheDocument();
        expect(screen.getByText(/LTM-1/i)).toBeInTheDocument();
        expect(screen.getByText(/Status:/i)).toBeInTheDocument();
        expect(screen.getByText(/pending/i)).toBeInTheDocument();
        expect(screen.getByText(/123 CBD Street/i)).toBeInTheDocument();
        expect(screen.getByText(/Ksh 1,600/i)).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        render(
            <OrderDetailsModal
                show={true}
                order={mockOrder}
                onClose={onClose}
            />
        );

        const closeButton = screen.getByRole('button', { name: /Close modal/i });
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();
    });

    test('handles status update for admin', async () => {
        updateDoc.mockResolvedValueOnce();

        render(
            <OrderDetailsModal
                show={true}
                order={mockOrder}
                onClose={onClose}
                onUpdateStatus={onUpdateStatus}
            />
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'paid' } });

        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalled();
            expect(onUpdateStatus).toHaveBeenCalledWith('LTM-1', 'paid');
        });
    });

    test('displays reorder button for non-admin', () => {
        render(
            <OrderDetailsModal
                show={true}
                order={mockOrder}
                onClose={onClose}
                onReorder={onReorder}
            />
        );

        const reorderButton = screen.getByText(/Order Again/i);
        fireEvent.click(reorderButton);

        expect(onReorder).toHaveBeenCalledWith(mockOrder);
    });
});
