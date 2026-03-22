
import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { FiZap, FiCopy, FiCheck } from 'react-icons/fi';
import './AdminAIHelper.css';

const AdminAIHelper = () => {
  const [flavorName, setFlavorName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!flavorName || !ingredients) return;
    setLoading(true);
    setResult(null);
    try {
      const description = await aiService.generateProductDescription(flavorName, ingredients);
      
      // Construct a data object for src/data.js
      const dataBlock = {
        id: "TBD",
        name: flavorName,
        price: 300,
        category: "Specialty Flavors",
        options: [
          { box: 6, price: 1800 },
          { box: 10, price: 3000 },
          { box: 20, price: 5400, discount: "10%" },
        ],
        image: "images/placeholder.jpg",
        alt: `Elegant ${flavorName} macaron with high-quality ingredients`,
        description: description.trim(),
        ingredients: ingredients,
        allergies: "Contains nuts (almonds) and dairy.",
      };

      setResult(dataBlock);
    } catch (error) {
      console.error(error);
      alert("Failed to generate description. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(result, null, 2).replace(/"([^"]+)":/g, '$1:'); // Remove quotes from keys for JS object
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="admin-ai-helper">
      <h2>✨ AI Product Helper</h2>
      <p className="helper-intro">Enter a new flavor idea to generate a premium description and a code block for <code>src/data.js</code>.</p>
      
      <div className="helper-form">
        <div className="form-group">
          <label>Flavor Name</label>
          <input 
            type="text" 
            value={flavorName} 
            onChange={(e) => setFlavorName(e.target.value)} 
            placeholder="e.g. Lavender Honey"
          />
        </div>
        <div className="form-group">
          <label>Key Ingredients</label>
          <textarea 
            value={ingredients} 
            onChange={(e) => setIngredients(e.target.value)} 
            placeholder="e.g. French lavender, local raw honey, white chocolate"
          />
        </div>
        <button 
          className="generate-button" 
          onClick={handleGenerate} 
          disabled={loading || !flavorName || !ingredients}
        >
          {loading ? "Generating..." : <><FiZap /> Generate Content</>}
        </button>
      </div>

      {result && (
        <div className="helper-result">
          <h3>Generated Data Block</h3>
          <div className="code-container">
            <pre>
              <code>{JSON.stringify(result, null, 2).replace(/"([^"]+)":/g, '$1:')}</code>
            </pre>
            <button className="copy-button" onClick={copyToClipboard}>
              {copied ? <FiCheck /> : <FiCopy />} {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
          <div className="preview-card">
            <h4>Preview Description</h4>
            <p>{result.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAIHelper;
