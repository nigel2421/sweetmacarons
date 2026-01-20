
import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Macarons from './Macarons';
import CartModal from './CartModal';
import ProductModal from './ProductModal';
import HeroSlider from './HeroSlider';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';
import AdminNav from './pages/AdminNav';
import ScrollToTop from './ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import { auth, db } from './firebase'; // Correctly import auth and db
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { macarons as macaronsData } from './data'; // Import local macaron data
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './HeroSlider.css';
import './Footer.css';
import './pages/About.css';
import './pages/Contact.css';
import './pages/Orders.css';
import './pages/Login.css';
import './pages/OrderDetailsModal.css';
import './pages/Analytics.css';
import './pages/AdminNav.css';
import './pages/PrivacyPolicy.css';
import './pages/TermsOfService.css';
import './pages/DataDeletion.css';
import './pages/MyAccount.css';
import AllReviewsPage from './pages/AllReviewsPage';

const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Orders = lazy(() => import('./pages/Orders'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Login = lazy(() => import('./pages/Login'));
const Analytics = lazy(() => import('./pages/Analytics'));
const DisclaimerPage = lazy(() => import('./DisclaimerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const DataDeletion = lazy(() => import('./pages/DataDeletion'));
const MyAccount = lazy(() => import('./pages/MyAccount'));

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
  const [macarons, setMacarons] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMacaronsWithReviews = async () => {
      const reviewsCollection = collection(db, 'reviews');
      const reviewSnapshot = await getDocs(reviewsCollection);
      const reviews = reviewSnapshot.docs.map(doc => doc.data());

      const macaronsWithReviews = macaronsData.map(macaron => {
        const productReviews = reviews.filter(review => review.productId === macaron.id);
        const averageRating = productReviews.length > 0
          ? productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length
          : 0;
        return { ...macaron, averageRating, reviewCount: productReviews.length };
      });

      setMacarons(macaronsWithReviews);
    };

    fetchMacaronsWithReviews();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const addToCart = (macaron, option, quantity = 1) => {
    const cartItemId = `${macaron.id}-${option.box}`;
    const existingItem = cart.find((item) => item.id === cartItemId);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { macaron, option, quantity, id: cartItemId }]);
    }
    toast.success(`${macaron.name} (Box of ${option.box}) added to cart!`);
  };

  const handleReorder = (order) => {
    clearCart();
    order.cart.forEach(item => {
      const macaron = macarons.find(m => m.id.split('-')[0] === item.id.split('-')[0]);
      if (macaron) {
        addToCart(macaron, item.option, item.quantity);
      }
    });
    setShowCart(true);
  };

  const removeItemFromCart = (itemToRemove) => {
    setCart(cart.filter((item) => item.id !== itemToRemove.id));
    toast.error(`${itemToRemove.macaron.name} removed from cart.`);
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSelectMacaron = (macaron, option) => {
    setSelectedProduct({ macaron, option });
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <ScrollToTop />
      <header className="App-header">
        <div className="header-left">
          <Link to="/">
            <img src="/images/logo.jpeg" alt="Los Tres Macarons" className="logo" />
          </Link>
        </div>
        <div className="header-center">
          {user && isAdminPage ? (
            <AdminNav />
          ) : (
            <h1 className="header-title">Los Tres Macarons</h1>
          )}
        </div>
        <div className="header-right">
          <div className="cart-icon" onClick={() => setShowCart(true)}>
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
          {user ? (
            <Link to="/my-account" className="user-icon">
              <FiUser />
            </Link>
          ) : (
            <Link to="/login" className="user-icon">
              <FiUser />
            </Link>
          )}
        </div>
      </header>
      <main>
        {authLoading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Checking authentication...</p>
          </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <HeroSlider slides={slides} />
                    <h2 className="explore-macarons">Explore Macarons</h2>
                    <Macarons macarons={macarons} onSelectMacaron={handleSelectMacaron} onAddToCart={addToCart} />
                  </>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/my-account" element={<ProtectedRoute isAuthenticated={!!user}><MyAccount onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute isAuthenticated={!!user}><MyOrders onLogout={handleLogout} onReorder={handleReorder} /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute isAuthenticated={!!user} adminOnly={true}><Orders onLogout={handleLogout} /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute isAuthenticated={!!user} adminOnly={true}><Analytics orders={orders} /></ProtectedRoute>} />
              <Route path="/all-reviews" element={<AllReviewsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        )}
      </main>
      <Footer />
      <CartModal
        cart={cart}
        show={showCart}
        onClose={() => setShowCart(false)}
        onRemoveItem={removeItemFromCart}
        onClearCart={clearCart}
        onCheckout={() => { 
          setShowCart(false);
        }}
      />
      <ProductModal
        product={selectedProduct}
        show={!!selectedProduct}
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
      <ScrollToTopButton />
    </div>
  );
}

export default App;
