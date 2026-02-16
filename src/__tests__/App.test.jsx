
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

// Mock Firebase
vi.mock('../firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback(null); // Simulate no user logged in
    return () => { };
  }),
  getAuth: vi.fn(() => ({})),
}));


describe('App component routing', () => {
  test('renders the landing page by default', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // screen.debug(); // Uncomment if needed, but findBy* already waits
    expect(await screen.findByRole('heading', { name: /Explore Macarons/i }, { timeout: 3000 })).toBeInTheDocument();




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
