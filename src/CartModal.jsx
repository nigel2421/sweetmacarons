
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2 } from 'react-icons/fi';
import ConfirmationModal from './ConfirmationModal';
import './ConfirmationModal.css';
import './CartModal.css';

const CartModal = ({ cart, show, onClose, onRemoveItem, onClearCart }) => {
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [itemToRemove, setItemToRemove] = useState(null);
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

  const handleProceedToCheckout = () => {
    if (deliveryOption !== 'pickup' && !deliveryAddress.trim()) {
      alert("Please enter a delivery address.");
      return;
    }
    navigate('/disclaimer', {
      state: {
        cart,
        deliveryOption,
        deliveryAddress,
        deliveryFee,
        macaronsTotal,
        grandTotal,
      },
    });
    onClose();
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
          <>
            <div className="cart-modal-header">
              <h2>Shopping Cart</h2>
              <button onClick={onClose} className="cart-modal-close" aria-label="Close cart">
                <FiX size={20} style={{ strokeWidth: '4' }} />
                <span>CLOSE</span>
              </button>
            </div>
            <div className="cart-modal-scrollable">
              <div className="cart-modal-body">
                {cart.length > 0 ? (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="cart-modal-item">
                        <div className="cart-modal-item-info">
                          <p className="cart-modal-item-name">
                            {item.macaron ? item.macaron.name : item.name} (Box of {item.option.box})
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
                      {deliveryOption !== 'pickup' && (
                        <div className="delivery-address-section">
                          <label htmlFor="deliveryAddress">Delivery Address</label>
                          <textarea
                            id="deliveryAddress"
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Please enter your full delivery address"
                            rows="3"
                          ></textarea>
                        </div>
                      )}
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
            </div>
            {cart.length > 0 && (
              <div className="cart-modal-footer">
                <button
                  onClick={handleProceedToCheckout}
                  className="cart-modal-checkout"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
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
            : `Are you sure you want to remove ${itemToRemove?.macaron ? itemToRemove?.macaron.name : itemToRemove?.name} from your cart?`
        }
      />
    </>
  );
};

export default CartModal;
