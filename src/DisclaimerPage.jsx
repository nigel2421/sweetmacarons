
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import './DisclaimerPage.css';

const DisclaimerPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { orderId, cart, deliveryFee, macaronsTotal } = location.state || { orderId: null, cart: [], deliveryFee: 0, macaronsTotal: 0 };

  const depositAmount = macaronsTotal * 0.3;
  const balance = macaronsTotal + deliveryFee - depositAmount;
  const whatsappNumber = '+254723734211';

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(whatsappNumber);
    alert('Copied to clipboard');
  };

  const handleCheckout = async () => {
    try {
      await setDoc(doc(db, 'orders', orderId), {
        orderId,
        cart,
        deliveryFee,
        macaronsTotal,
        depositAmount,
        balance,
        status: 'pending',
        createdAt: new Date(),
      });

      const message = `*Hello!* 👋 I would like to place an order for the following macarons:\n\n${
        cart.map(item => `• *${item.name}* (Box of ${item.option.box}): Ksh ${item.option.price.toLocaleString()}`).join('\n')
      }\n\n*Subtotal:* Ksh ${macaronsTotal.toLocaleString()}\n*Delivery Fee:* Ksh ${deliveryFee.toLocaleString()}\n*Total:* Ksh ${(macaronsTotal + deliveryFee).toLocaleString()}\n\nI will pay the 30% deposit of *Ksh ${depositAmount.toLocaleString()}* and share the confirmation message shortly.\n\n*Order ID:* ${orderId}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    } catch (error) {
      console.error('Error writing document: ', error);
      alert('There was an error placing your order. Please try again.');
    }
  };

  return (
    <div className="disclaimer-page">
      <nav className="disclaimer-nav">
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </nav>
      <div className="disclaimer-content">
        <h1>Disclaimer</h1>
        <p>Macarons ordered will take up to 3 days before delivery as they are hand made to perfection.</p>
        <h2>Deposit</h2>
        <p>
          <b>To begin work, a deposit of 30% of the total cost for the macarons is required.</b>
        </p>
        <div className="deposit-info">
          <p>30% Deposit Amount: <strong>Ksh {depositAmount.toLocaleString()}</strong></p>
        </div>
        <div className="payment-info">
          <p>You can pay via Lipa Na MPESA or to Pochi la Biashara on the number provided below.</p>
          <div className="whatsapp-number">
            <span>{whatsappNumber}</span>
            <button onClick={handleCopyToClipboard} title="Copy number">
              <i className="fas fa-copy" style={{ color: '#333' }}></i>
            </button>
          </div>
          <p className="whatsapp-instruction">Please share the deposit confirmation message via WhatsApp.</p>
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
                <span>{item.name} (Box of ${item.option.box})</span>
                <span>Ksh {item.option.price.toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="cart-totals-review">
              <p>Subtotal: Ksh {macaronsTotal.toLocaleString()}</p>
              <p>Delivery Fee: Ksh {deliveryFee.toLocaleString()}</p>
              <p>Total: Ksh {(macaronsTotal + deliveryFee).toLocaleString()}</p>
            </div>
          </div>
        )}
        <button className="checkout-button" onClick={handleCheckout} disabled={!agree}>
          Checkout via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPage;
