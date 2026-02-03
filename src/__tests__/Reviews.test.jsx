
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Reviews from '../Reviews';
import { getDocs, addDoc } from 'firebase/firestore';

// Mock Firebase module
vi.mock('./firebase', () => ({
    db: { _type: 'firestore' },
}));

// Mock firestore library
vi.mock('firebase/firestore', () => ({
    collection: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    getFirestore: vi.fn(() => ({})), // Added to satisfy src/firebase.js
}));

describe('Reviews Component', () => {
    const mockProductId = 'product-1';
    const mockUser = {
        uid: 'user-1',
        displayName: 'John Doe',
    };
    const mockReviews = [
        {
            id: 'rev-1',
            name: 'Alice',
            rating: 5,
            comment: 'Amazing macarons!',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        getDocs.mockResolvedValue({
            docs: mockReviews.map(rev => ({
                id: rev.id,
                data: () => rev,
            })),
        });
    });

    test('renders reviews correctly', async () => {
        render(<Reviews productId={mockProductId} user={mockUser} />);

        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
        });

        expect(screen.getByText('Amazing macarons!')).toBeInTheDocument();
    });

    test('shows empty state when no reviews found', async () => {
        getDocs.mockResolvedValueOnce({ docs: [] });
        render(<Reviews productId={mockProductId} user={mockUser} />);

        await waitFor(() => {
            expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument();
        });
    });

    test('submits a new review', async () => {
        addDoc.mockResolvedValueOnce({ id: 'new-rev-id' });

        const updatedReviews = [
            ...mockReviews,
            { id: 'rev-2', name: 'John', rating: 4, comment: 'Very good' }
        ];

        getDocs.mockResolvedValue({
            docs: updatedReviews.map(rev => ({ id: rev.id, data: () => rev }))
        });

        render(<Reviews productId={mockProductId} user={mockUser} />);

        await waitFor(() => {
            expect(screen.getByText(/Leave a Review/i)).toBeInTheDocument();
        });

        const commentInput = screen.getByLabelText(/Comment/i);
        fireEvent.change(commentInput, { target: { value: 'Very good' } });

        // Click on 4th star - identifying by selector
        const stars = document.querySelectorAll('.star-rating-input svg');
        fireEvent.click(stars[3]);

        const submitButton = screen.getByRole('button', { name: /Submit Review/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(addDoc).toHaveBeenCalled();
            expect(screen.getByText('Very good')).toBeInTheDocument();
        });
    });
});
