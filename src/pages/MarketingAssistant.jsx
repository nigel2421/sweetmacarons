
import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { FiZap, FiCopy, FiCheck, FiLayout } from 'react-icons/fi';
import './MarketingAssistant.css';

const MarketingAssistant = () => {
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const handleGenerate = async () => {
    if (!theme) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `You are a marketing expert for "Sweet Macarons". 
      Generate a set of marketing ideas for the theme: "${theme}".
      Include:
      1. One catchy headline for a homepage banner.
      2. Two Instagram captions with relevant hashtags.
      3. Three seasonal flavor pairing suggestions for this theme.
      
      Respond in JSON format:
      {
        "headline": "string",
        "captions": ["string", "string"],
        "flavorIdeas": ["string", "string", "string"]
      }`;

      const response = await aiService.generateText(prompt);
      const cleaned = response.replace(/```json|```/g, "").trim();
      setResult(JSON.parse(cleaned));
    } catch (error) {
      console.error(error);
      alert("Failed to generate marketing ideas.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="marketing-assistant">
      <div className="assistant-header">
        <FiLayout className="header-icon" />
        <h2>AI Marketing Assistant</h2>
        <p>Brainstorm seasonal campaigns and social media content in seconds.</p>
      </div>

      <div className="theme-input-group">
        <input 
          type="text" 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)} 
          placeholder="e.g. Easter Celebration, Mother's Day, Summer Picnic"
        />
        <button onClick={handleGenerate} disabled={loading || !theme}>
          {loading ? "Thinking..." : <><FiZap /> Generate Campaign</>}
        </button>
      </div>

      {result && (
        <div className="marketing-results">
          <div className="result-card headline-card">
            <h3>Homepage Headline</h3>
            <div className="card-content">
              <p className="large-text">{result.headline}</p>
              <button onClick={() => copyToClipboard(result.headline, 'h')}>
                {copied === 'h' ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <h3>Social Media Captions</h3>
              {result.captions.map((cap, i) => (
                <div key={i} className="caption-box">
                  <p>{cap}</p>
                  <button onClick={() => copyToClipboard(cap, `c${i}`)}>
                    {copied === `c${i}` ? <FiCheck /> : <FiCopy />}
                  </button>
                </div>
              ))}
            </div>

            <div className="result-card">
              <h3>Seasonal Flavor Ideas</h3>
              <ul className="flavor-ideas">
                {result.flavorIdeas.map((flavor, i) => (
                  <li key={i}>{flavor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingAssistant;
