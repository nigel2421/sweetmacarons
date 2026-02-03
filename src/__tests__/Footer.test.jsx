
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

describe('Footer component', () => {
  test('renders all the navigation links and social media icons', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check for quick links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();

    // Check for social media icons
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    expect(document.querySelector('a[href="https://www.facebook.com/profile.php?id=100090266093209"]')).toBeInTheDocument();
    expect(document.querySelector('a[href="https://www.instagram.com/lostresmacaronske/"]')).toBeInTheDocument();

    // Check for bottom links
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Data Deletion')).toBeInTheDocument();
  });
});
