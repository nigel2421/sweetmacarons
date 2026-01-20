
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import StarRating from '../components/StarRating';
import './AllReviewsPage.css';

const AllReviewsPage = () => {
  const location = useLocation();
  const { productId, productName } = location.state || {};
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (productId) {
        const q = query(
          collection(db, 'reviews'),
          where('productId', '==', productId)
        );
        const querySnapshot = await getDocs(q);
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div className="all-reviews-page">
      <div className="all-reviews-header">
        <h1>Reviews for {productName}</h1>
        <Link to="/" className="back-to-store-button">Back to Store</Link>
      </div>
      {reviews.length > 0 ? (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-card-header">
                <span className="review-author">{review.author}</span>
                <span className="review-date">
                  {review.createdAt.toDate().toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} />
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet for this product.</p>
      )}
    </div>
  );
};

export default AllReviewsPage;
