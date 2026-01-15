
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StarRating from './components/StarRating';
import { auth } from './firebase';
import './Macarons.css';

const MacaronCard = ({ macaron, onSelect, onAddToCart }) => {
  const [selectedOption, setSelectedOption] = useState(macaron.options[0]);
  const navigate = useNavigate();

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

  const handleViewReviews = (e) => {
    e.stopPropagation();
    if (auth.currentUser) {
      // Navigate to reviews page if logged in
      navigate(`/macarons/${macaron.id}/reviews`);
    } else {
      // Redirect to login page if not logged in
      navigate('/login');
    }
  };

  return (
    <motion.div
      className="macaron-card"
      onClick={() => onSelect(macaron, selectedOption)}
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
          <StarRating rating={macaron.averageRating || 0} />
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
        <button className="view-reviews-button" onClick={handleViewReviews}>
          View Reviews
        </button>
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
