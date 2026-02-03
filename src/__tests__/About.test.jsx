
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import About from '../pages/About';

describe('About page', () => {
  test('renders the main heading and paragraphs', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'About Us' })).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Los Tres Macarons!/)).toBeInTheDocument();
    expect(screen.getByText(/We use only the finest ingredients/)).toBeInTheDocument();
  });
});
