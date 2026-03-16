import { lazy, Suspense } from 'react';
import HeroSlider from '../HeroSlider';
import { macaronFlavors } from '../data';

const Macarons = lazy(() => import('../Macarons'));

const slides = [
  {
    image: '/images/macaron-slider-1.png',
    title: 'Made with Love',
    subtitle: 'The finest ingredients for the finest treats.',
    alt: 'Beautifully arranged artisanal macarons made with love',
  },
  {
    image: '/images/macaron-slider-5.png',
    title: 'A Treat for Every Occasion',
    subtitle: 'Birthdays, weddings, or just because.',
    alt: 'Gourmet macarons perfect for birthdays, weddings, and special events',
  },
  {
    image: '/images/macaron-slider-10.png',
    title: 'Your Dream Macarons',
    subtitle: 'Contact us for custom orders and flavors.',
    alt: 'Customizable macaron flavors and designs for your dream dessert',
  },
];

const Home = ({ onAddToCart, onSelectMacaron }) => {
  return (
    <>
      <HeroSlider slides={slides} />
      <h1 className="explore-macarons-title">Explore Our Gourmet Macaron Collection</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Macarons
          macarons={macaronFlavors}
          onAddToCart={onAddToCart}
          onSelectMacaron={onSelectMacaron}
        />
      </Suspense>
    </>
  );
};

export default Home;
