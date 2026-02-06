import HeroSlider from '../HeroSlider';
import Macarons from '../Macarons';
import { macaronFlavors } from '../data';

const slides = [
  {
    image: '/images/macaron-slider-1.png',
    title: 'Made with Love',
    subtitle: 'The finest ingredients for the finest treats.',
  },
  {
    image: '/images/macaron-slider-5.png',
    title: 'A Treat for Every Occasion',
    subtitle: 'Birthdays, weddings, or just because.',
  },
  {
    image: '/images/macaron-slider-10.png',
    title: 'Your Dream Macarons',
    subtitle: 'Contact us for custom orders and flavors.',
  },
];

const Home = ({ onAddToCart, onSelectMacaron }) => {
  return (
    <>
      <HeroSlider slides={slides} />
      <h1 className="explore-macarons-title">Explore Macarons</h1>
      <Macarons
        macarons={macaronFlavors}
        onAddToCart={onAddToCart}
        onSelectMacaron={onSelectMacaron}
      />
    </>
  );
};

export default Home;
