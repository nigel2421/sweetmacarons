
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import OrderDetailsModal from '../pages/OrderDetailsModal';
import { updateDoc } from 'firebase/firestore';
import { generateOrderReceipt } from '../lib/pdf';
import { aiService } from '../services/aiService';

// Mock Firebase
vi.mock('../firebase', () => ({
    db: {},
    auth: {
        currentUser: { email: 'admin@example.com', uid: 'admin-uid' }
    }
}));

vi.mock('firebase/firestore', () => ({
    doc: vi.fn(() => ({})), // Return empty object as ref
    updateDoc: vi.fn(),
    arrayUnion: vi.fn(val => val),
    serverTimestamp: vi.fn(() => new Date()),
}));

vi.mock('../lib/pdf', () => ({
    generateOrderReceipt: vi.fn(),
}));

vi.mock('../lib/audit', () => ({
    logAdminAction: vi.fn(),
}));

vi.mock('../services/aiService', () => ({
    aiService: {
        scanOrderNotes: vi.fn(() => Promise.resolve({ hasAlert: true, alerts: ['Allergy'], summary: 'Caution' }))
    }
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
                isAdmin={true}
            />
        );

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: 'deposit-paid' } });

        await waitFor(() => {
            expect(updateDoc).toHaveBeenCalled();
            expect(onUpdateStatus).toHaveBeenCalledWith('LTM-1', 'deposit-paid');
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

    test('triggers PDF download when receipt button is clicked', () => {
        render(
            <OrderDetailsModal
                show={true}
                order={mockOrder}
                onClose={onClose}
            />
        );

        const downloadBtn = screen.getByText(/Receipt \(PDF\)/i);
        fireEvent.click(downloadBtn);

        expect(generateOrderReceipt).toHaveBeenCalledWith(mockOrder);
    });

    test('triggers AI note scan for admin when notes are present', async () => {
        const orderWithNotes = {
            ...mockOrder,
            orderNotes: 'Please avoid peanuts, severe allergy.'
        };
        
        render(
            <OrderDetailsModal
                show={true}
                order={orderWithNotes}
                onClose={onClose}
                isAdmin={true}
            />
        );

        await waitFor(() => {
            expect(aiService.scanOrderNotes).toHaveBeenCalledWith(orderWithNotes.orderNotes);
        });
    });

    test('renders status history correctly', () => {
        const orderWithHistory = {
            ...mockOrder,
            statusHistory: [
                { status: 'pending', timestamp: '2024-01-01T10:00:00Z', updatedBy: 'System' },
                { status: 'paid', timestamp: '2024-01-01T11:00:00Z', updatedBy: 'Admin' }
            ]
        };

        render(
            <OrderDetailsModal
                show={true}
                order={orderWithHistory}
                onClose={onClose}
            />
        );

        expect(screen.getByText(/Status History/i)).toBeInTheDocument();
        const historyList = screen.getByRole('list');
        expect(within(historyList).getByText(/paid/i)).toBeInTheDocument();
        expect(within(historyList).getByText(/Admin/i)).toBeInTheDocument();
    });
});
