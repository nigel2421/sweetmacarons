
import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Header from './Header';
import Footer from './Footer';
import CartModal from './CartModal';
import ProductModal from './ProductModal';
import ScrollToTop from './ScrollToTop';
import ProtectedRoute from './ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AllReviewsPage = lazy(() => import('./pages/AllReviewsPage'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Orders = lazy(() => import('./pages/Orders'));
const Users = lazy(() => import('./pages/Users'));
const DataDeletion = lazy(() => import('./pages/DataDeletion'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const LegalInfo = lazy(() => import('./pages/LegalInfo'));
const DisclaimerPage = lazy(() => import('./DisclaimerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
            ...product,
            id: cartItemId,
            macaron: product,
            quantity,
            option,
          },
        ];
      }
    });

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`app-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>
      <ScrollToTop />
      <div className="app">
        <Header
          user={user}
          cart={cart}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          setIsCartVisible={setIsCartVisible}
        />
        <main className="app-container">
          <Suspense fallback={<div>Loading page...</div>}>
            <Routes>
              <Route path="/" element={<Home onAddToCart={addToCart} onSelectMacaron={openProductModal} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-account" element={<ProtectedRoute user={user}><MyAccount user={user} /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute user={user}><MyOrders user={user} /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute user={user} adminOnly><Dashboard /></ProtectedRoute>} />
              <Route path="/all-reviews" element={<ProtectedRoute user={user} adminOnly><AllReviewsPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute user={user} adminOnly><Orders /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute user={user} adminOnly><Users /></ProtectedRoute>} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<LegalInfo />} />
              <Route path="/disclaimer" element={<DisclaimerPage user={user} onClearCart={clearCart} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
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
