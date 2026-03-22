
import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { macaronFlavors } from '../data';
import { FiSend, FiUser, FiZap } from 'react-icons/fi';
import { motion as Motion } from 'framer-motion';
import './FlavorExplorer.css';

const FlavorExplorer = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Bonjour! I am your AI Macaron Sommelier. Describe your mood, a favorite dessert, or a flavor profile you love, and I will find your perfect match!" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const recommendation = await aiService.recommendFlavors(query, macaronFlavors);
      setMessages(prev => [...prev, { role: 'ai', text: recommendation }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Pardon, I had a bit of trouble finding that for you. Could you try describing it differently?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flavor-explorer-container">
      <div className="explorer-header">
        <h1 className="explorer-title">AI Flavor Explorer</h1>
        <p className="explorer-subtitle">Discover your next favorite flavor with our AI Sommelier</p>
      </div>

      <div className="chat-window">
        <div className="messages-list">
          {messages.map((msg, index) => (
            <Motion.div 
              key={index} 
              className={`message-bubble ${msg.role}`}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bubble-icon">
                {msg.role === 'ai' ? <img src="/images/logo.jpeg" alt="AI" /> : <FiUser />}
              </div>
              <div className="bubble-text">
                {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </Motion.div>
          ))}
          {loading && (
            <div className="message-bubble ai loading">
              <div className="bubble-icon">
                <img src="/images/logo.jpeg" alt="AI" />
              </div>
              <div className="bubble-text">
                <p><FiZap className="pulse" /> Thinking of the perfect pairing...</p>
              </div>
            </div>
          )}
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="e.g. I want something citrusy and refreshing for a hot day"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !query.trim()}>
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default FlavorExplorer;
