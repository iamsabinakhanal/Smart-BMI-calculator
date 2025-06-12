import React, { useState } from 'react';
import '../styles/BMICalculator.css';
import Navbar from './Navbar';

const BMICalculator = () => {
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    if (!feet || !weight) {
      alert('Please enter both height and weight');
      return;
    }

    const totalInches = parseFloat(feet) * 12 + parseFloat(inches || 0);
    const heightInMeters = totalInches * 0.0254;
    const weightInKg = parseFloat(weight);
    const bmiResult = weightInKg / (heightInMeters * heightInMeters);

    setBmi(bmiResult.toFixed(1));

    if (bmiResult < 18.5) setCategory('Underweight');
    else if (bmiResult < 25) setCategory('Healthy');
    else if (bmiResult < 30) setCategory('Overweight');
    else setCategory('Obesity');
  };

  const resetCalculator = () => {
    setFeet('');
    setInches('');
    setWeight('');
    setBmi(null);
    setCategory('');
  };

  return (
    <div className="bmi-container">
      <div className="calculator-box">
        <Navbar />
        <div className="header-section">
          <h3>BMI Calculator</h3>
        </div>
        <p>Submit your height and weight to calculate your BMI</p>

        <div className="input-group">
          <label>Height</label>
          <div className="height-inputs">
            <input 
              type="number" 
              placeholder="Feet (ft)" 
              value={feet} 
              onChange={(e) => setFeet(e.target.value)}
              min="0"
            />
            <input 
              type="number" 
              placeholder="Inches (in)" 
              value={inches} 
              onChange={(e) => setInches(e.target.value)}
              min="0" 
              max="11"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Weight</label>
          <input 
            type="number" 
            placeholder="Kilograms (kg)" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)}
            min="0"
          />
        </div>

        <div className="button-group">
          <button className="calculate-btn" onClick={calculateBMI}>
            Calculate BMI
          </button>
          <button className="reset-btn" onClick={resetCalculator}>
            Reset
          </button>
        </div>

        {bmi && (
          <div className={`result ${category.toLowerCase()}`}>
            <h4>Your Results</h4>
            <p>BMI: <span>{bmi}</span></p>
            <p>Category: <span>{category}</span></p>
            <p className="advice">{getAdvice(category)}</p>
          </div>
        )}
      </div>

      <div className="category-box">
        <div className="header-section">
          <h3>BMI Categories</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>BMI Range</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr className={category === 'Underweight' ? 'highlight' : ''}>
              <td>Underweight</td>
              <td>Below 18.5</td>
              <td>Moderate</td>
            </tr>
            <tr className={category === 'Healthy' ? 'highlight' : ''}>
              <td>Healthy</td>
              <td>18.5 - 24.9</td>
              <td>Low</td>
            </tr>
            <tr className={category === 'Overweight' ? 'highlight' : ''}>
              <td>Overweight</td>
              <td>25.0 - 29.9</td>
              <td>Increased</td>
            </tr>
            <tr className={category === 'Obesity' ? 'highlight' : ''}>
              <td>Obesity</td>
              <td>30.0 or above</td>
              <td>High</td>
            </tr>
          </tbody>
        </table>
        <p className="view-link">View detailed BMI information</p>
      </div>
    </div>
  );
};

// Helper function for advice
const getAdvice = (category) => {
  switch(category) {
    case 'Underweight':
      return 'Consider consulting a nutritionist for healthy weight gain strategies.';
    case 'Healthy':
      return 'Maintain your balanced diet and regular exercise routine.';
    case 'Overweight':
      return 'Small dietary changes and increased activity can help reach a healthier weight.';
    case 'Obesity':
      return 'Consult a healthcare provider for personalized weight management advice.';
    default:
      return '';
  }
};

export default BMICalculator;