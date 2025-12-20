
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header cartCount={0} handleCartClick={() => {}} />);
    
    expect(screen.getByText(/Los Tres Macarons/i)).toBeInTheDocument();
    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
  });
});
