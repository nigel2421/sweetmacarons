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
  const onClose = vi.fn();

  test('renders the cart items and total', () => {
    render(
      <BrowserRouter>
        <CartModal cart={cart} show={true} onClose={onClose} onRemoveItem={onRemoveItem} onClearCart={onClearCart} />
      </BrowserRouter>
    );

    expect(screen.getByText('Macaron 1 (Box of 6)')).toBeInTheDocument();
    expect(screen.getByText('Macaron 2 (Box of 12)')).toBeInTheDocument();

    // Use getAllByText for the total price since it appears multiple times (Total and Grand Total)
    const totalPrices = screen.getAllByText(/Ksh 5,600/);
    expect(totalPrices.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/Macarons Total:/)).toBeInTheDocument();
  });

  test('calculates delivery fee correctly', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CartModal cart={cart} show={true} onClose={onClose} onRemoveItem={onRemoveItem} onClearCart={onClearCart} />
      </BrowserRouter>
    );

    const withinCBDButton = screen.getByRole('button', { name: /Within CBD/i });
    await user.click(withinCBDButton);

    expect(screen.getByText(/Delivery Fee:/)).toBeInTheDocument();

    // Use getAllByText for Ksh 400 since it appears in the button and the fee row
    const deliveryFees = screen.getAllByText(/Ksh 400/);
    expect(deliveryFees.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/Grand Total:/)).toBeInTheDocument();
    expect(screen.getByText(/Ksh 6,000/)).toBeInTheDocument();
  });
});
