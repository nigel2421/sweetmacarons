
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-background"></div>
      <div className="about-content">
          <div className="about-card">
              <h1>About Us</h1>
              <p>
                  Welcome to Los Tres Macarons! We are passionate about creating the most
                  delicious and beautiful macarons you've ever tasted. Our journey began
                  in a small kitchen, with a dream of sharing our love for these delicate
                  French treats with the world.
              </p>
              <p>
                  We use only the finest ingredients, from locally sourced almonds to
                  premium Belgian chocolate. Each macaron is handcrafted with precision
                  and care, ensuring a perfect balance of flavor and texture.
              </p>
              <p>
                  Whether you're celebrating a special occasion or simply indulging in a
                  sweet treat, we have a wide variety of flavors to choose from. We hope
                  you enjoy our macarons as much as we enjoy making them!
              </p>
          </div>
      </div>
    </div>
  );
};

export default About;
