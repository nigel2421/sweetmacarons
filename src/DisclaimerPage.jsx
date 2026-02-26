
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCopy } from 'react-icons/fi';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { generateOrderId } from './utils';
import ConfirmationModal from './ConfirmationModal';
import './DisclaimerPage.css';

const DisclaimerPage = ({ user, onClearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agree, setAgree] = useState(false);
  const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  // Store cart data in state to prevent loss on re-renders
  const [cartData] = useState(() => {
    const state = location.state || {};
    return {
      cart: state.cart || [],
      deliveryOption: state.deliveryOption || 'pickup',
      deliveryAddress: state.deliveryAddress || '',
      deliveryFee: state.deliveryFee || 0,
      macaronsTotal: state.macaronsTotal || 0,
      grandTotal: state.grandTotal || 0
    };
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log('isOrderSuccessful changed to:', isOrderSuccessful);
    console.log('whatsappMessage length:', whatsappMessage.length);
  }, [isOrderSuccessful, whatsappMessage]);

  const { cart, deliveryOption, deliveryAddress, deliveryFee, macaronsTotal, grandTotal } = cartData;

  const depositAmount = macaronsTotal * 0.5;
  const orderWhatsAppNumber = '254723734211';
  const paymentNumber = '0769456153';

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(paymentNumber);
    alert('Payment number copied to clipboard');
  };

  const handleCheckout = async () => {
    const orderId = generateOrderId(user);

    const orderItems = cart.map(item => `• *${item.macaron.name}* (Box of ${item.option.box}) x ${item.quantity}: Ksh ${(item.option.price * item.quantity).toLocaleString()}`).join('\n');

    let deliveryMessage = '';
    if (deliveryOption !== 'pickup') {
      deliveryMessage = `\n*Delivery Address:* ${deliveryAddress}`;
    }

    const message = `*Hello Los Tres Macarons!* 👋\n\nI would like to place an order for the following:\n\n${orderItems}${deliveryMessage}\n\n*Subtotal:* Ksh ${macaronsTotal.toLocaleString()}\n*Delivery Fee:* Ksh ${deliveryFee.toLocaleString()}\n*Total:* Ksh ${grandTotal.toLocaleString()}\n\n*Deposit Required (50%):* Ksh ${depositAmount.toLocaleString()}\n\n*Order ID:* ${orderId}\n\nI will share the payment confirmation shortly. Thank you!`;
    setWhatsappMessage(message);

    try {
      await addDoc(collection(db, 'orders'), {
        orderId: orderId,
        userId: user ? user.uid : 'anonymous',
        userEmail: user ? user.email : 'Anonymous',
        userName: user ? user.displayName : 'Anonymous',
        items: cart,
        total: grandTotal,
        status: 'pending',
        createdAt: serverTimestamp(),
        deliveryOption,
        deliveryAddress,
        deliveryFee,
        macaronsTotal,
        depositAmount: macaronsTotal * 0.5,
        balance: grandTotal - (macaronsTotal * 0.5),
      });

      console.log('Order saved successfully!');
      console.log('Setting isOrderSuccessful to true...');
      setIsOrderSuccessful(true);

      // Open WhatsApp after 4 seconds, then navigate home
      setTimeout(() => {
        window.open(`https://wa.me/${orderWhatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank');

        // Navigate to home after opening WhatsApp
        setTimeout(() => {
          console.log('Timeout: Clearing cart and navigating home...');
          setIsOrderSuccessful(false);
          if (onClearCart) {
            onClearCart();
          }
          navigate('/');
        }, 1000);
      }, 4000);

    } catch (error) {
      console.error("Error placing order: ", error);
      alert("There was an error placing your order. Please try again.");
    }
  };

  const handleModalClose = () => {
    setIsOrderSuccessful(false);
    if (onClearCart) {
      onClearCart();
    }
    navigate('/');
  };

  return (
    <>
      <div className="disclaimer-page">
        <nav className="disclaimer-nav">
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </nav>
        <div className="disclaimer-content">
          <h1>Disclaimer</h1>
          <p>Macarons ordered will take up to 3 days before delivery as they are hand made to perfection.</p>
          <h2>Deposit</h2>
          <p>
            <b>To begin work, a deposit of 50% of the total cost for the macarons is required.</b>
          </p>
          <div className="deposit-info">
            <p>50% Deposit Amount: <strong>Ksh {depositAmount.toLocaleString()}</strong></p>
          </div>
          <div className="payment-info">
            <p>You can pay via Lipa Na MPESA or to Pochi la Biashara on the number provided below.</p>
            <div className="whatsapp-number">
              <span>{paymentNumber}</span>
              <button onClick={handleCopyToClipboard} title="Copy payment number">
                <FiCopy style={{ color: '#2D3748' }} />
              </button>
            </div>
            <p className="whatsapp-instruction">Please note: <br />A 50% deposit is required before your macaron order can be created.<br />Kindly send the deposit via M-Pesa to 0769456153, and <br />Share the M-Pesa confirmation message in the WhatsApp chat where your order is being placed.</p>
          </div>
          <div className="consent-checkbox">
            <input type="checkbox" id="agree" checked={agree} onChange={() => setAgree(!agree)} />
            <label htmlFor="agree">I agree to these terms and conditions.</label>
          </div>
          {agree && (
            <div className="cart-review">
              <h2>Cart Review</h2>
              {cart.map(item => (
                <div key={item.id} className="cart-item-review">
                  <span>{item.macaron.name} (Box of {item.option.box})</span>
                  <span>Ksh {item.option.price.toLocaleString()}</span>
                </div>
              ))}
              <hr />
              <div className="cart-totals-review">
                <p>Subtotal: Ksh {macaronsTotal.toLocaleString()}</p>
                <p>Delivery Fee: Ksh {deliveryFee.toLocaleString()}</p>
                <p>Total: Ksh {grandTotal.toLocaleString()}</p>
              </div>
            </div>
          )}
          <button className="checkout-button" onClick={handleCheckout} disabled={!agree}>
            Checkout via WhatsApp
          </button>
        </div>
      </div>
      <ConfirmationModal
        show={isOrderSuccessful}
        onClose={handleModalClose}
        title="Order Placed Successfully! 🎉"
        message="Your order has been saved. Please follow the instructions below to complete your order via WhatsApp."
        additionalInfo={whatsappMessage}
        isOrderSuccess={true}
      />
    </>
  );
};

export default DisclaimerPage;
