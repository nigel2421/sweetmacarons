
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  runTransaction,
} from 'firebase/firestore';
import './Reviews.css';

// A more advanced Star component using SVG for better styling
const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    width="24" 
    height="24"
    viewBox="0 0 24 24"
    className={`star ${filled ? 'filled' : ''}`}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const Reviews = ({ productId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, name: '', comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'reviews'), where('productId', '==', productId));
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReviews(reviewsData);
      } catch (err) {
        setError('Could not fetch reviews.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || newReview.rating === 0) {
      setError('Please fill in all fields and provide a rating.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const macaronRef = doc(db, 'macarons', productId);
      
      await runTransaction(db, async (transaction) => {
        const macaronDoc = await transaction.get(macaronRef);
        if (!macaronDoc.exists()) {
          throw new Error("Macaron document not found!");
        }

        // Add the new review to the 'reviews' collection
        const newReviewRef = doc(collection(db, 'reviews'));
        transaction.set(newReviewRef, {
          ...newReview,
          productId,
          createdAt: new Date(),
          author_uid: user.uid, // Add author UID
        });
        
        // Update the average rating on the macaron document
        const macaronData = macaronDoc.data();
        const currentReviewCount = macaronData.reviewCount || 0;
        const currentAverageRating = macaronData.averageRating || 0;
        
        const newReviewCount = currentReviewCount + 1;
        const newTotalRating = (currentAverageRating * currentReviewCount) + newReview.rating;
        const newAverageRating = newTotalRating / newReviewCount;
        
        transaction.update(macaronRef, {
          reviewCount: newReviewCount,
          averageRating: newAverageRating,
        });
      });

      setNewReview({ rating: 0, name: '', comment: '' });

      // Refetch reviews to display the new one instantly
      const q = query(collection(db, 'reviews'), where('productId', '==', productId));
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);

    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reviews-section">
      <h3>Customer Reviews</h3>
      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-name">{review.name}</span>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to write one!</p>
        )}
      </div>
      {user ? (
        <div className="review-form-container">
          <h4>Leave a Review</h4>
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group form-group-rating">
              <label>Rating</label>
              <div className="star-rating-container">
                <span className="rating-number">1</span>
                <div className="star-rating-input" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Star
                      key={starIndex}
                      filled={hoverRating >= starIndex || newReview.rating >= starIndex}
                      onClick={() => handleRatingClick(starIndex)}
                      onMouseEnter={() => setHoverRating(starIndex)}
                    />
                  ))}
                </div>
                <span className="rating-number">5</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={newReview.comment}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      ) : (
        <p>Please log in to leave a review.</p>
      )}
    </div>
  );
};

export default Reviews;
