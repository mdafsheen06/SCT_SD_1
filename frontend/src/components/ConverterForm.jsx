import { useState } from 'react';

export default function ConverterForm() {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!value || isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: parseFloat(value),
          unit: unit
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleConvert}>
        <div className="input-group">
          <label htmlFor="tempValue">Temperature</label>
          <input 
            type="number" 
            id="tempValue"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 100"
            step="any"
          />
        </div>

        <div className="input-group">
          <label htmlFor="tempUnit">From Unit</label>
          <select 
            id="tempUnit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="celsius">Celsius (°C)</option>
            <option value="fahrenheit">Fahrenheit (°F)</option>
            <option value="kelvin">Kelvin (K)</option>
          </select>
        </div>

        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

        <button type="submit" className="convert-btn" disabled={loading}>
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </form>

      {results && (
        <div className="results-container">
          <div className="result-item">
            <span className="unit-label">Celsius</span>
            <span className="unit-value">{results.celsius} °C</span>
          </div>
          <div className="result-item">
            <span className="unit-label">Fahrenheit</span>
            <span className="unit-value">{results.fahrenheit} °F</span>
          </div>
          <div className="result-item">
            <span className="unit-label">Kelvin</span>
            <span className="unit-value">{results.kelvin} K</span>
          </div>
        </div>
      )}
    </>
  );
}
