import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
  const handleContact = () => {
    const phoneNumber = '254723734211';
    const message = "Hello Los Tres Macarons! I'd like to get in touch regarding your delicious macarons. 🧁✨";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Get in Touch</h1>
        <p>Have questions or special requests? We're just a click away!</p>
        <button className="get-in-touch-button" onClick={handleContact}>
          <FaWhatsapp style={{ marginRight: '8px' }} /> Get in touch
        </button>
      </div>
    </div>
  );
};

export default Contact;
