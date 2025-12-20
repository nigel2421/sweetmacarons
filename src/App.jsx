
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Macarons from './Macarons';
import CartModal from './CartModal';
import ProductModal from './ProductModal';
import DisclaimerPage from './DisclaimerPage';
import HeroSlider from './HeroSlider';
import Footer from './Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import { FiShoppingCart } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './HeroSlider.css';
import './Footer.css';
import './pages/About.css';
import './pages/Contact.css';
import './pages/Orders.css';
import './pages/Login.css';
import './pages/OrderDetailsModal.css';

const slides = [
  {
    image: '/images/macaron-slider-1.png',
    title: 'Delicious Macarons',
    subtitle: 'A taste of heaven in every bite.',
  },
  {
    image: '/images/macaron-slider-10.png',
    title: 'Perfect for Any Occasion',
    subtitle: 'Weddings, birthdays, or just a treat for yourself.',
  },
  {
    image: '/images/macaron-slider-5.png',
    title: 'Made with Love',
    subtitle: 'Using only the finest ingredients.',
  },
];

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [selectedMacaron, setSelectedMacaron] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const addToCart = (macaron, option) => {
    const existingItem = cart.find(
      (item) => item.id === macaron.id && item.option.box === option.box
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === macaron.id && item.option.box === option.box
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...macaron, option, quantity: 1, id: `${macaron.id}-${option.box}` }]);
    }
    toast.success(`${macaron.name} (Box of ${option.box}) added to cart!`);
  };

  const removeItemFromCart = (itemToRemove) => {
    setCart(cart.filter((item) => item.id !== itemToRemove.id));
    toast.error(`${itemToRemove.name} removed from cart.`);
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared!');
  };

  const handleSelectMacaron = (macaron) => {
    setSelectedMacaron(macaron);
  };

  const handleCloseProductModal = () => {
    setSelectedMacaron(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="App">
      <header className="App-header">
        <Link to="/">
          <img src="/images/logo.jpeg" alt="Los Tres Macarons" className="logo" />
        </Link>
        <div className="cart-icon" onClick={() => setShowCart(true)}>
          <FiShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSlider slides={slides} />
                <h2 className="explore-macarons">Explore Macarons</h2>
                <Macarons onSelectMacaron={handleSelectMacaron} onAddToCart={addToCart} />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Orders onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <CartModal
        cart={cart}
        show={showCart}
        onClose={() => setShowCart(false)}
        onRemoveItem={removeItemFromCart}
        onClearCart={clearCart}
      />
      <ProductModal
        macaron={selectedMacaron}
        show={!!selectedMacaron}
        onClose={handleCloseProductModal}
        onAddToCart={addToCart}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
