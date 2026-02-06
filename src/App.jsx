
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiX, FiMenu } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Header from './Header';
import HeroSlider from './HeroSlider';
import Macarons from './Macarons';
import Reviews from './Reviews';
import Footer from './Footer';
import CartModal from './CartModal';
import ProductModal from './ProductModal';
import ScrollToTop from './ScrollToTop';
import DisclaimerPage from './DisclaimerPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import MyOrders from './pages/MyOrders';
import Dashboard from './pages/Dashboard';
import AllReviewsPage from './pages/AllReviewsPage';
import Analytics from './pages/Analytics';
import Orders from './pages/Orders';
import Users from './pages/Users';
import DataDeletion from './pages/DataDeletion';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import { macaronFlavors } from './data';

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

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product, option, quantity = 1) => {
    if (!product || !option) return;

    let isUpdated = false;
    setCart((prevCart) => {
      const cartItemId = `${product.id}-${option.box}`;
      const existingItem = prevCart.find((item) => item.id === cartItemId);

      if (existingItem) {
        isUpdated = true;
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product, // Keep spread to clone properties
            id: cartItemId,
            macaron: product,
            quantity,
            option,
          },
        ];
      }
    });

    // Show toast notification instead of opening cart
    toast.success(
      isUpdated
        ? `Updated ${product.name} in cart! 🛒`
        : `${product.name} added to cart! 🎉`,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== itemToRemove.id)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openProductModal = (product, option) => {
    setSelectedProduct({ macaron: product, option });
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const MainContent = () => {
    const location = useLocation();
    const isLegalPage = [
      '/login',
      '/my-account',
      '/my-orders',
      '/dashboard',
      '/all-reviews',
      '/analytics',
      '/orders',
      '/users',
      '/about',
      '/contact',
      '/data-deletion',
      '/terms-of-service',
      '/privacy-policy',
      '/disclaimer',
    ].includes(location.pathname);

    return (
      <div className={`app-container ${isMenuOpen ? 'menu-open' : ''}`}>
        {!isLegalPage && <HeroSlider slides={slides} />}
        {!isLegalPage && <h1 className="explore-macarons-title">Explore Macarons</h1>}
        {!isLegalPage && <Macarons macarons={macaronFlavors} onAddToCart={addToCart} onSelectMacaron={openProductModal} />}
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-account" element={<ProtectedRoute user={user}><MyAccount user={user} /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute user={user}><MyOrders user={user} /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute user={user} adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="/all-reviews" element={<ProtectedRoute user={user} adminOnly><AllReviewsPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute user={user} adminOnly><Analytics /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute user={user} adminOnly><Orders /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute user={user} adminOnly><Users /></ProtectedRoute>} />
          <Route path="/data-deletion" element={<DataDeletion />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/disclaimer" element={<DisclaimerPage user={user} onClearCart={clearCart} />} />
          <Route path="/" element={null} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <div className="app">
        <Header
          user={user}
          cart={cart}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          setIsCartVisible={setIsCartVisible}
        />
        <MainContent />
        <Footer />
        <CartModal
          cart={cart}
          show={isCartVisible}
          onClose={() => setIsCartVisible(false)}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            show={true}
            onClose={closeProductModal}
            onAddToCart={addToCart}
          />
        )}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default App;
