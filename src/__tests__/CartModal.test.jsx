
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CartModal from '../CartModal';

describe('CartModal component', () => {
  const cart = [
    {
      id: '1-6',
      macaron: { name: 'Macaron 1' },
      option: { box: 6, price: 1200 },
      quantity: 1,
    },
    {
      id: '2-12',
      macaron: { name: 'Macaron 2' },
      option: { box: 12, price: 2200 },
      quantity: 2,
    },
  ];

  const onRemoveItem = vi.fn();
  const onClearCart = vi.fn();

  test('renders the cart items and total', () => {
    render(
      <BrowserRouter>
        <CartModal cart={cart} show={true} onRemoveItem={onRemoveItem} onClearCart={onClearCart} />
      </BrowserRouter>
    );

    expect(screen.getByText('Macaron 1 (Box of 6)')).toBeInTheDocument();
    expect(screen.getByText('Macaron 2 (Box of 12)')).toBeInTheDocument();
    expect(screen.getByText(/Macarons Total:/)).toBeInTheDocument();
    expect(screen.getByText(/Ksh 5,600/)).toBeInTheDocument();
  });

  test('calculates delivery fee correctly', () => {
    render(
      <BrowserRouter>
        <CartModal cart={cart} show={true} onRemoveItem={onRemoveItem} onClearCart={onClearCart} />
      </BrowserRouter>
    );

    userEvent.click(screen.getByText('Within CBD'));
    expect(screen.getByText(/Delivery Fee:/)).toBeInTheDocument();
    expect(screen.getByText(/Ksh 400/)).toBeInTheDocument();
    expect(screen.getByText(/Grand Total:/)).toBeInTheDocument();
    expect(screen.getByText(/Ksh 6,000/)).toBeInTheDocument();
  });
});
