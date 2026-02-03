
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App component routing', () => {
  test('renders the landing page by default', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByText('Explore Macarons')).toBeInTheDocument();
  });

  test('navigates to the about page', async () => {
    render(
      <MemoryRouter initialEntries={['/about']}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: 'About Us' })).toBeInTheDocument();
  });

  test('navigates to the login page', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(await screen.findByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});
