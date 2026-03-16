
import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarRating from './components/StarRating';
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

  return (
    <Motion.div
      className="macaron-card"
      onClick={() => onSelect(macaron, selectedOption)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <img
        src={macaron.image}
        alt={macaron.alt || macaron.name}
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
          <Link
            to="/all-reviews"
            state={{ productId: macaron.id, productName: macaron.name }}
            className="view-reviews-button"
            onClick={(e) => e.stopPropagation()}
          >
            View Reviews
          </Link>
        </div>
      </div>
    </Motion.div>
  );
};

const Macarons = ({ macarons, onSelectMacaron, onAddToCart }) => {
  const groupedMacarons = macarons.reduce((acc, macaron) => {
    const category = macaron.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(macaron);
    return acc;
  }, {});

  const categoryOrder = ['Classic Flavors', 'Specialty Flavors', 'Vegan', 'Custom & Gifts', 'Other'];

  const sortedCategories = Object.keys(groupedMacarons).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return a.localeCompare(b); // both are not in order array, sort alphabetically
      if (indexA === -1) return 1; // a is not in order, should come after b
      if (indexB === -1) return -1; // b is not in order, should come after a
      return indexA - indexB; // both are in order, sort by their index
  });


  return (
    <div className="macarons-container">
      {sortedCategories.map((category) => (
        <div key={category} className="macaron-category">
          <h2 className="macaron-category-title">{category}</h2>
          <div className="macaron-category-list">
            {groupedMacarons[category].map((macaron) => (
              <MacaronCard
                key={macaron.id}
                macaron={macaron}
                onSelect={onSelectMacaron}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Macarons;
