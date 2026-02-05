
import React, { useState, useEffect } from 'react';

const HeroSlider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-slide-content">
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroSlider;
