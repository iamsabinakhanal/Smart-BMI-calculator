import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/BMICalculator.css";

const ethnicityOptions = [
  { value: 1, label: "Mexican American", description: "Persons of Mexican heritage" },
  { value: 2, label: "Other Hispanic", description: "Hispanic/Latino not of Mexican origin" },
  { value: 3, label: "Non-Hispanic White", description: "White persons not of Hispanic origin" },
  { value: 4, label: "Non-Hispanic Black", description: "Black/African American not Hispanic" },
  { value: 5, label: "Other Race", description: "Multi-Racial, Asian, Native American, etc." }
];

const lifestyleOptions = [
  { value: 1, label: "Sedentary", description: "Little or no exercise" },
  { value: 2, label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: 3, label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: 4, label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: 5, label: "Extremely Active", description: "Very hard exercise & physical job" }
];

const incomeOptions = [
  { value: 1, label: "< 1.0", description: "Below poverty level" },
  { value: 2, label: "1.0-1.99", description: "Near poverty level" },
  { value: 3, label: "2.0-3.99", description: "Middle class" },
  { value: 4, label: "4.0-5.99", description: "Upper middle class" },
  { value: 5, label: "6.0+", description: "High income" }
];

const bmiCategories = [
  { range: "< 18.5", category: "Underweight", color: "#63e6be" },
  { range: "18.5-24.9", category: "Healthy Weight", color: "#51cf66" },
  { range: "25.0-29.9", category: "Overweight", color: "#fcc419" },
  { range: "30.0+", category: "Obese", color: "#ff6b6b" }
];

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    age: "", weight: "", height: "",
    ethnicity: 3, lifestyle: 3, income: 3
  });
  const [bmi, setBmi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        RIAGENDR: 1,
        RIDAGEYR: Number(formData.age),
        BMXWT: Number(formData.weight),
        BMXHT: Number(formData.height),
        RIDRETH1: Number(formData.ethnicity),
        DMQADFC: Number(formData.lifestyle),
        INDFMPIR: Number(formData.income)
      });
      setBmi(response.data.predicted_bmi);
    } catch (error) {
      alert("Error calculating BMI");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bmi) {
      const generateRecommendation = async () => {
        try {
          const response = await axios.post("http://localhost:5000/generate-plan", {
            type: "combined",
            age: formData.age,
            bmi: bmi.toFixed(1),
            lifestyle: lifestyleOptions.find(o => o.value === formData.lifestyle)?.label
          });
          setAiRecommendation(response.data.plan);
        } catch (error) {
          console.error("AI recommendation error:", error);
        }
      };
      generateRecommendation();
    }
  }, [bmi, formData.age, formData.lifestyle]);

  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue <= 24.9) return "Healthy Weight";
    if (bmiValue <= 29.9) return "Overweight";
    return "Obese";
  };

  const handleViewPlan = (type) => {
    if (bmi) {
      navigate(`/${type}`, {
        state: {
          age: formData.age,
          bmi: bmi.toFixed(1),
          lifestyle: formData.lifestyle,
          category: getBmiCategory(bmi)
        }
      });
    }
  };

  return (
    <div className="calculator-container">
      <div className="form-section">
        <h2>BMI Calculator</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Age (years)</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
            />
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="1"
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label>Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Ethnicity</label>
            <select
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              required
            >
              {ethnicityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select
              name="lifestyle"
              value={formData.lifestyle}
              onChange={handleChange}
              required
            >
              {lifestyleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Income Ratio</label>
            <select
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
            >
              {incomeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Calculating..." : "Calculate BMI"}
          </button>
        </form>

        {bmi !== null && (
          <div className="results-section">
            <div className="bmi-result">
              <h3>Your Results</h3>
              <div className="bmi-score">
                <span className="bmi-value">{bmi.toFixed(1)}</span>
                <span className="bmi-category">{getBmiCategory(bmi)}</span>
              </div>
              
              <div className="bmi-visualization">
                {bmiCategories.map((cat, index) => {
                  const isActive = getBmiCategory(bmi) === cat.category;
                  return (
                    <div 
                      key={index}
                      className={`bmi-range ${isActive ? "active" : ""}`}
                      style={{ backgroundColor: cat.color }}
                    >
                      <div className="range-label">{cat.range}</div>
                      <div className="category-label">{cat.category}</div>
                      {isActive && <div className="active-indicator">Your Category</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {aiRecommendation && (
              <div className="recommendation">
                <h3>Personalized Health Plan</h3>
                <div className="recommendation-content">
                  {aiRecommendation.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button 
                className="btn-nutrition"
                onClick={() => handleViewPlan('nutrition')}
              >
                View Detailed Nutrition Plan
              </button>
              <button 
                className="btn-fitness"
                onClick={() => handleViewPlan('fitness')}
              >
                View Detailed Fitness Plan
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="reference-section">
        <div className="reference-card">
          <h3>BMI Categories</h3>
          <table className="reference-table">
            <thead>
              <tr>
                <th>Range</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {bmiCategories.map((cat, i) => (
                <tr key={i}>
                  <td>{cat.range}</td>
                  <td>{cat.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reference-card">
          <h3>Ethnicity Reference</h3>
          <table className="reference-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {ethnicityOptions.map(opt => (
                <tr key={opt.value}>
                  <td>{opt.label}</td>
                  <td>{opt.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reference-card">
          <h3>Activity Levels</h3>
          <table className="reference-table">
            <thead>
              <tr>
                <th>Level</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {lifestyleOptions.map(opt => (
                <tr key={opt.value}>
                  <td>{opt.label}</td>
                  <td>{opt.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="reference-card">
          <h3>Income Ratio Guide</h3>
          <table className="reference-table">
            <thead>
              <tr>
                <th>Ratio</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {incomeOptions.map(opt => (
                <tr key={opt.value}>
                  <td>{opt.label}</td>
                  <td>{opt.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="footnote">Income-to-poverty ratio</p>
        </div>
      </div>
    </div>
  );
}