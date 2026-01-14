
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi'; // Import star icon
import './Macarons.css';

const MacaronCard = ({ macaron, onSelect, onAddToCart }) => {
  const [selectedOption, setSelectedOption] = useState(macaron.options[0]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(macaron, selectedOption);
  };

  const handleSelectChange = (e) => {
    e.stopPropagation();
    const selected = macaron.options.find(
      (option) => JSON.stringify(option) === e.target.value
    );
    setSelectedOption(selected);
  };

  // Helper to render star ratings
  const renderRating = () => {
    if (!macaron.averageRating || macaron.reviewCount === 0) {
      return <span className="no-rating">No reviews yet</span>;
    }
    const stars = [];
    const rating = Math.round(macaron.averageRating * 2) / 2; // Round to nearest 0.5
    for (let i = 1; i <= 5; i++) {
      stars.push(<FiStar key={i} className={i <= rating ? 'star-filled' : 'star-empty'} />);
    }
    return stars;
  };

  return (
    <motion.div
      className="macaron-card"
      onClick={() => onSelect(macaron, selectedOption)} // Pass selected option
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={macaron.image}
        alt={macaron.name}
        className="macaron-card-image"
      />
      <div className="macaron-card-content">
        <h3 className="macaron-card-name">{macaron.name}</h3>
        
        <div className="macaron-card-rating">
          {renderRating()}
          {macaron.reviewCount > 0 && 
            <span className="review-count">({macaron.reviewCount})</span>
          }
        </div>

        {macaron.price && (
          <p className="macaron-card-price">
            Ksh {macaron.price.toLocaleString()}/= per piece
          </p>
        )}
        {macaron.minimum && (
          <p className="macaron-card-minimum">Minimum {macaron.minimum}</p>
        )}
        <div className="macaron-card-actions">
          <select
            className="macaron-card-select"
            value={JSON.stringify(selectedOption)}
            onChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
          >
            {macaron.options.map((option, index) => (
              <option key={index} value={JSON.stringify(option)}>
                Box of {option.box} @ Ksh {option.price.toLocaleString()}
                {option.discount && ` (${option.discount} discount)`}
              </option>
            ))}
          </select>
          <button className="macaron-card-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Macarons = ({ macarons, onSelectMacaron, onAddToCart }) => {
  return (
    <div className="macarons-container">
      {macarons.map((macaron) => (
        <MacaronCard
          key={macaron.id}
          macaron={macaron}
          onSelect={onSelectMacaron}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default Macarons;
