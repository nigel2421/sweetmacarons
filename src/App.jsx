
import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import { checkIsAdmin } from './admin';
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
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App = () => {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeOrders;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userIsAdmin = await checkIsAdmin(user);
        setIsAdmin(userIsAdmin);

        const ordersQuery = userIsAdmin
          ? query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
          : query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));

        unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
          const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setOrders(ordersData);
        }, (error) => {
          console.error("Error fetching orders in App: ", error);
        });
      } else {
        setIsAdmin(false);
        setOrders([]);
        if (unsubscribeOrders) unsubscribeOrders();
      }
      setLoading(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeOrders) unsubscribeOrders();
    };
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
          <Suspense fallback={
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
              fontSize: '1.2rem',
              color: '#e75480'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home onAddToCart={addToCart} onSelectMacaron={openProductModal} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/my-account" element={<ProtectedRoute user={user}><MyAccount user={user} /></ProtectedRoute>} />
              <Route path="/my-orders" element={<ProtectedRoute user={user}><MyOrders user={user} orders={orders} isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute user={user} adminOnly><Dashboard orders={orders} /></ProtectedRoute>} />
              <Route path="/all-reviews" element={<ProtectedRoute user={user} adminOnly><AllReviewsPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute user={user} adminOnly><Orders orders={orders} isAdmin={isAdmin} /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute user={user} adminOnly><Users orders={orders} /></ProtectedRoute>} />
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
