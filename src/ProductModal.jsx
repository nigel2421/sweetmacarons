
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const ProductModal = ({ macaron, show, onClose, onAddToCart }) => {
  const [selectedOption, setSelectedOption] = useState(macaron?.options[0]);

  if (!show || !macaron) {
    return null;
  }
  // Set the selected option to the first option when the macaron changes
  if (macaron.options[0] !== selectedOption && macaron.options.length > 0) {
    setSelectedOption(macaron.options[0]);
  }

  const handleAddToCart = () => {
    onAddToCart(macaron, selectedOption);
    onClose();
  };

  return (
    <div className="product-modal-overlay">
      <div className="product-modal">
        <div className="product-modal-header">
          <button onClick={onClose} className="product-modal-close">
            <FiX />
          </button>
        </div>
        <div className="product-modal-body">
          <img
            src={macaron.image}
            alt={macaron.name}
            className="product-modal-image"
          />
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
      </div>
    </div>
  );
};

export default ProductModal;
