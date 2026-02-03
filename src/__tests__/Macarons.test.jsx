
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import Macarons from '../Macarons';

describe('Macarons Component', () => {
    const mockMacarons = [
        {
            id: '1',
            name: 'Classic Vanilla',
            image: 'vanilla.jpg',
            averageRating: 4.5,
            reviewCount: 10,
            price: 200,
            minimum: '6 pieces',
            options: [
                { box: 6, price: 1200 },
                { box: 12, price: 2200, discount: '10%' },
            ],
        },
    ];

    const onSelectMacaron = vi.fn();
    const onAddToCart = vi.fn();

    test('renders macaron cards correctly', () => {
        render(
            <BrowserRouter>
                <Macarons
                    macarons={mockMacarons}
                    onSelectMacaron={onSelectMacaron}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        expect(screen.getByText('Classic Vanilla')).toBeInTheDocument();
        expect(screen.getByText(/Ksh 200\/= per piece/i)).toBeInTheDocument();
        expect(screen.getByText(/Minimum 6 pieces/i)).toBeInTheDocument();
        expect(screen.getByText('(10)')).toBeInTheDocument();
    });

    test('updates price when changing box size dropdown', () => {
        render(
            <BrowserRouter>
                <Macarons
                    macarons={mockMacarons}
                    onSelectMacaron={onSelectMacaron}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        const select = screen.getByRole('combobox');

        // Initial value (Box of 6)
        expect(select.value).toContain('1200');

        // Change to Box of 12
        fireEvent.change(select, { target: { value: JSON.stringify(mockMacarons[0].options[1]) } });

        expect(select.value).toContain('2200');
        expect(screen.getByText(/Box of 12 @ Ksh 2,200/i)).toBeInTheDocument();
    });

    test('calls onAddToCart with selected option', () => {
        render(
            <BrowserRouter>
                <Macarons
                    macarons={mockMacarons}
                    onSelectMacaron={onSelectMacaron}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        const select = screen.getByRole('combobox');
        const addToCartButton = screen.getByRole('button', { name: /Add to cart/i });

        // Select Box of 12
        fireEvent.change(select, { target: { value: JSON.stringify(mockMacarons[0].options[1]) } });
        fireEvent.click(addToCartButton);

        expect(onAddToCart).toHaveBeenCalledWith(mockMacarons[0], mockMacarons[0].options[1]);
    });

    test('calls onSelectMacaron when card is clicked', () => {
        render(
            <BrowserRouter>
                <Macarons
                    macarons={mockMacarons}
                    onSelectMacaron={onSelectMacaron}
                    onAddToCart={onAddToCart}
                />
            </BrowserRouter>
        );

        const card = screen.getByText('Classic Vanilla').closest('.macaron-card');
        fireEvent.click(card);

        expect(onSelectMacaron).toHaveBeenCalledWith(mockMacarons[0], mockMacarons[0].options[0]);
    });
});
