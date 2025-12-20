
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the footer component', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Los Tres Macarons/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Links/i)).toBeInTheDocument();
    expect(screen.getByText(/Follow Us/i)).toBeInTheDocument();
  });
});
