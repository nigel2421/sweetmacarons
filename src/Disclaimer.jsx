
import { useLocation, Link } from 'react-router-dom';
import './Disclaimer.css';

const Disclaimer = () => {
  const location = useLocation();
  const { orderId, cart, deliveryFee, macaronsTotal, depositAmount, balance } = location.state || {};

  if (!orderId) {
    return (
        <div className="disclaimer-container">
            <p>No order details found. Please go back to the cart and try again.</p>
            <Link to="/">Go to Homepage</Link>
        </div>
    );
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <div className="disclaimer-container">
      <div className="disclaimer-header">
        <h1>Thank You for Your Order!</h1>
        <p>Your order number is <strong>{orderId}</strong>.</p>
      </div>
      <div className="disclaimer-content">
        <h2>Next Steps</h2>
        <ol>
          <li>A 30% deposit is required to confirm your order.</li>
          <li>The balance is due upon delivery or pickup.</li>
        </ol>
        
        <h2>Payment Details</h2>
        <div className="payment-info">
            <p>Please use M-Pesa to pay the deposit to:</p>
            <p className="phone-number"><strong>0712 345 678</strong></p>
            <p>Then, forward the M-Pesa confirmation message to the same number.</p>
        </div>

        <h2>Order Summary</h2>
        <div className="order-summary-box">
            {cart.map(item => (
              <div key={item.id} className="order-summary-item">
                <span>{item.quantity} x {item.name} (Box of {item.option.box})</span>
                <span>Ksh {(item.option.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <hr />
            <div className="order-summary-total">
              <span>Macarons Total:</span>
              <span>Ksh {macaronsTotal.toLocaleString()}</span>
            </div>
            <div className="order-summary-total">
                <span>Delivery Fee:</span>
                <span>Ksh {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="order-summary-grand-total">
                <span>Grand Total:</span>
                <span>Ksh {(macaronsTotal + deliveryFee).toLocaleString()}</span>
            </div>
            <hr />
            <div className="order-summary-total">
                <span className="deposit-amount">Deposit (30%):</span>
                <span className="deposit-amount">Ksh {depositAmount.toLocaleString()}</span>
            </div>
            <div className="order-summary-total">
                <span>Balance Due:</span>
                <span>Ksh {balance.toLocaleString()}</span>
            </div>
        </div>

        <div className="disclaimer-footer">
          <p>We will contact you shortly to confirm the details. If you have any questions, please contact us.</p>
          <div className="disclaimer-actions">
            <button onClick={handlePrint} className="print-button">Print Summary</button>
            <Link to="/" className="home-button">Back to Homepage</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
