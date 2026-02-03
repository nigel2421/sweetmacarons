
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ProductModal from '../ProductModal';

describe('ProductModal Component', () => {
    const mockProduct = {
        macaron: {
            id: '1',
            name: 'Snickers Macaron',
            description: 'A rich and nutty macaron...',
            image: 'snickers.jpg',
            ingredients: 'Almond flour, sugar...',
            allergies: 'Contains peanuts',
            options: [
                { box: 6, price: 1200 },
                { box: 12, price: 2200 },
            ],
        },
        option: { box: 6, price: 1200 },
    };

    const onClose = vi.fn();
    const onAddToCart = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders product details correctly', () => {
        render(
            <BrowserRouter>
                <ProductModal
                    show={true}
                    product={mockProduct}
                    onClose={onClose}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Snickers Macaron')).toBeInTheDocument();
        expect(screen.getByText(/Ingredients/i)).toBeInTheDocument();
        expect(screen.getByAltText('Snickers Macaron')).toBeInTheDocument();
    });

    test('calls onClose when circular close button is clicked', () => {
        render(
            <BrowserRouter>
                <ProductModal
                    show={true}
                    product={mockProduct}
                    onClose={onClose}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        const closeButton = screen.getByRole('button', { name: /Close modal/i });
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalled();
    });

    test('calls onAddToCart with selected option', () => {
        render(
            <BrowserRouter>
                <ProductModal
                    show={true}
                    product={mockProduct}
                    onClose={onClose}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        const addToCartButton = screen.getByText(/Add to Cart/i);
        fireEvent.click(addToCartButton);

        expect(onAddToCart).toHaveBeenCalledWith(mockProduct.macaron, mockProduct.option);
        expect(onClose).toHaveBeenCalled();
    });
});
