
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Reviews from './Reviews';
import { auth } from './firebase';
import './ProductModal.css';

const ProductModal = ({ product, show, onClose, onAddToCart }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedOption(product.option);
    }
  }, [product]);

  if (!show || !product) {
    return null;
  }

  const { macaron } = product;

  const handleAddToCart = () => {
    onAddToCart(macaron, selectedOption);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-button" aria-label="Close modal">
          <FiX size={20} style={{ strokeWidth: '4' }} />
          <span>CLOSE</span>
        </button>
        <div className="product-modal-scrollable">
          <div className="product-modal-body">
            <div className="product-modal-image-container">
              <img
                src={macaron.image}
                alt={macaron.name}
                className="product-modal-image"
              />
            </div>
            <div className="product-modal-info">
              <h2 className="product-modal-name">{macaron.name}</h2>
              <p className="product-modal-description">{macaron.description}</p>
              <div className="product-modal-details">
                <h3>Ingredients</h3>
                <p>{macaron.ingredients}</p>
                <h3>Allergy Notice</h3>
                <p>{macaron.allergies}</p>
              </div>
              <div className="product-modal-actions">
                <select
                  className="macaron-card-select"
                  value={JSON.stringify(selectedOption)}
                  onChange={(e) =>
                    setSelectedOption(JSON.parse(e.target.value))
                  }
                >
                  {macaron.options.map((option, index) => (
                    <option key={index} value={JSON.stringify(option)}>
                      Box of {option.box} @ Ksh {option.price.toLocaleString()}
                      {option.discount && ` (${option.discount} discount)`}
                    </option>
                  ))}
                </select>
                <button
                  className="macaron-card-button"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="product-modal-reviews">
            <Reviews productId={macaron.id} user={user} />
            <div className="see-all-reviews-container">
              <Link
                to="/all-reviews"
                state={{ productId: macaron.id, productName: macaron.name }}
                className="see-all-reviews-button"
              >
                See All Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
