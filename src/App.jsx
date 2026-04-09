import { useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    city: '',
    height: '',
    weight: '',
    income_lpa: '',
    occupation: 'private_job',
    smoker: false
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://mehul-backend-hqekh7e7eteugnct.centralindia-01.azurewebsites.net';

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      income_lpa: parseFloat(formData.income_lpa),
    };

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Prediction failed');
      }
    } catch (err) {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="hero-section">
        <h1>Predict Your Future Security.</h1>
        <p>Get instant, AI-powered health insurance premium estimates based on your lifestyle and demographics.</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="grid-inputs">
            <div className="input-group">
              <label htmlFor="age">Age</label>
              <input type="number" id="age" value={formData.age} onChange={handleChange} required min="1" max="119" placeholder="25" />
            </div>
            <div className="input-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" value={formData.city} onChange={handleChange} required placeholder="Mumbai" />
            </div>
            <div className="input-group">
              <label htmlFor="height">Height (m)</label>
              <input type="number" id="height" step="0.01" value={formData.height} onChange={handleChange} required min="0.5" max="2.5" placeholder="1.75" />
            </div>
            <div className="input-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input type="number" id="weight" step="0.1" value={formData.weight} onChange={handleChange} required min="10" max="200" placeholder="70" />
            </div>
            <div className="input-group">
              <label htmlFor="income_lpa">Income (LPA)</label>
              <input type="number" id="income_lpa" step="0.1" value={formData.income_lpa} onChange={handleChange} required min="0" placeholder="12.5" />
            </div>
            <div className="input-group">
              <label htmlFor="occupation">Occupation</label>
              <select id="occupation" value={formData.occupation} onChange={handleChange} required>
                <option value="private_job">Private Job</option>
                <option value="government_job">Government Job</option>
                <option value="business_owner">Business Owner</option>
                <option value="retired">Retired</option>
                <option value="unemployed">Unemployed</option>
              </select>
            </div>
          </div>

          <label className="checkbox-group">
            <input type="checkbox" id="smoker" checked={formData.smoker} onChange={handleChange} />
            <span>Are you a smoker?</span>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing Data...' : 'Calculate Premium'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-section">
            <p>Estimated Annual Premium</p>
            <div className="prediction-value">
              ₹{result.prediction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div className="model-info">AI Engine v{result.model_version}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
