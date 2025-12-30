
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <button onClick={handleGoBack} className="back-button">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
