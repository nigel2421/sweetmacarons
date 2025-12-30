
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { db } from './firebase'; // Import the Firestore database instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Import Firestore functions
import { toast } from 'react-toastify'; // Import toast for notifications
import ConfirmationModal from './ConfirmationModal';
import './ConfirmationModal.css';
import './CartModal.css';

const CartModal = ({ cart, show, onClose, onRemoveItem, onClearCart }) => {
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New state for loading
  const navigate = useNavigate();

  if (!show) {
    return null;
  }

  const macaronsTotal = cart.reduce(
    (acc, item) => acc + item.option.price * item.quantity,
    0
  );

  const deliveryFee =
    deliveryOption === 'cbd' ? 400 : deliveryOption === 'outside-cbd' ? 1000 : 0;
  const grandTotal = macaronsTotal + deliveryFee;

  const handleProceedToCheckout = async () => {
    setIsPlacingOrder(true); // Start loading
    try {
      const orderDetails = {
        cart,
        deliveryOption,
        deliveryFee,
        macaronsTotal,
        grandTotal,
        createdAt: serverTimestamp(),
        status: 'new',
      };

      const docRef = await addDoc(collection(db, "orders"), orderDetails);

      toast.success("Your order has been placed successfully!");

      onClearCart();
      onClose();

      navigate('/disclaimer', {
        state: { orderId: docRef.id, cart, deliveryFee, macaronsTotal },
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("There was an issue placing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false); // Stop loading
    }
  };

  const showConfirmation = (action, item = null) => {
    setConfirmationAction(action);
    setItemToRemove(item);
    setIsConfirmationVisible(true);
  };

  const hideConfirmation = () => {
    setIsConfirmationVisible(false);
    setConfirmationAction(null);
    setItemToRemove(null);
  };

  const handleConfirm = () => {
    if (confirmationAction === 'clear') {
      onClearCart();
    } else if (confirmationAction === 'remove') {
      onRemoveItem(itemToRemove);
    }
    hideConfirmation();
  };

  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose}>
        <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
          {isPlacingOrder && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Please wait...</p>
            </div>
          )}
          <div className="cart-modal-header">
            <h2>Shopping Cart</h2>
            <button onClick={onClose} className="cart-modal-close">
              <FiX />
            </button>
          </div>
          <div className="cart-modal-body">
            {cart.length > 0 ? (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="cart-modal-item">
                    <div className="cart-modal-item-info">
                      <p className="cart-modal-item-name">
                        {item.name} (Box of {item.option.box})
                      </p>
                      <p className="cart-modal-item-price">
                        {item.quantity} x Ksh {item.option.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => showConfirmation('remove', item)}
                      className="cart-modal-item-remove"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <div className="delivery-section">
                  <h4>Delivery Options</h4>
                  <div className="delivery-options-group">
                    <button
                      className={`delivery-option-button ${deliveryOption === 'pickup' ? 'selected' : ''}`}
                      onClick={() => setDeliveryOption('pickup')}
                    >
                      <span>Pickup</span>
                      <span>Ksh 0</span>
                    </button>
                    <button
                      className={`delivery-option-button ${deliveryOption === 'cbd' ? 'selected' : ''}`}
                      onClick={() => setDeliveryOption('cbd')}
                    >
                      <span>Within CBD</span>
                      <span>Ksh 400</span>
                    </button>
                    <button
                      className={`delivery-option-button ${deliveryOption === 'outside-cbd' ? 'selected' : ''}`}
                      onClick={() => setDeliveryOption('outside-cbd')}
                    >
                      <span>Outside CBD</span>
                      <span>Ksh 1000</span>
                    </button>
                  </div>
                </div>
                <div className="cart-totals">
                  <div>
                    <span>Macarons Total:</span>
                    <span>Ksh {macaronsTotal.toLocaleString()}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div>
                      <span>Delivery Fee:</span>
                      <span>Ksh {deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="grand-total">
                    <span>Grand Total:</span>
                    <span>Ksh {grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button
                    onClick={() => showConfirmation('clear')}
                    className="cart-modal-clear-cart"
                >
                    Clear Cart
                </button>
              </>
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-modal-footer">
              <button
                onClick={handleProceedToCheckout}
                className="cart-modal-checkout"
                disabled={cart.length === 0 || isPlacingOrder}
              >
                {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        show={isConfirmationVisible}
        onClose={hideConfirmation}
        onConfirm={handleConfirm}
        title={confirmationAction === 'clear' ? "Clear Cart" : "Remove Item"}
        message={
          confirmationAction === 'clear'
            ? "Are you sure you want to clear your cart?"
            : `Are you sure you want to remove ${itemToRemove?.name} from your cart?`
        }
      />
    </>
  );
};

export default CartModal;
