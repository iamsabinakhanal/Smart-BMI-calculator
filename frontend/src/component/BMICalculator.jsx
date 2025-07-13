import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaWeight, FaRulerVertical, FaUser, FaBirthdayCake, 
  FaRunning, FaMoneyBillWave, FaUtensils, FaDumbbell 
} from "react-icons/fa";
import { GiMeal } from "react-icons/gi";
import { MdFitnessCenter } from "react-icons/md";
import "../styles/BMICalculator.css";

const ethnicityOptions = [
  { value: 1, label: "Mexican American", description: "Persons of Mexican heritage" },
  { value: 2, label: "Other Hispanic", description: "Hispanic/Latino not of Mexican origin" },
  { value: 3, label: "Non-Hispanic White", description: "White persons not of Hispanic origin" },
  { value: 4, label: "Non-Hispanic Black", description: "Black/African American not Hispanic" },
  { value: 5, label: "Other Race", description: "Multi-Racial, Asian, Native American, etc." },
];

const lifestyleOptions = [
  { value: 1, label: "Sedentary", description: "Little or no exercise" },
  { value: 2, label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: 3, label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: 4, label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: 5, label: "Extremely Active", description: "Very hard exercise & physical job" },
];

const incomeOptions = [
  { value: 1, label: "< 1.0", description: "Below poverty level" },
  { value: 2, label: "1.0-1.99", description: "Near poverty level" },
  { value: 3, label: "2.0-3.99", description: "Middle class" },
  { value: 4, label: "4.0-5.99", description: "Upper middle class" },
  { value: 5, label: "6.0+", description: "High income" },
];

const bmiCategories = [
  { range: "< 18.5", category: "Underweight", color: "#63e6be" },
  { range: "18.5-24.9", category: "Healthy Weight", color: "#51cf66" },
  { range: "25.0-29.9", category: "Overweight", color: "#fcc419" },
  { range: "30.0+", category: "Obese", color: "#ff6b6b" },
];

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    ethnicity: 3,
    lifestyle: 3,
    income: 3,
  });
  const [userId, setUserId] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [fitnessPlan, setFitnessPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("nutrition");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calculate BMI
      const response = await axios.post("http://localhost:5000/predict", {
        RIAGENDR: 1,
        RIDAGEYR: Number(formData.age),
        BMXWT: Number(formData.weight),
        BMXHT: Number(formData.height),
        RIDRETH1: Number(formData.ethnicity),
        DMQADFC: Number(formData.lifestyle),
        INDFMPIR: Number(formData.income),
      });
      const predictedBmi = response.data.predicted_bmi;
      setBmi(predictedBmi);

      // Save user data
      const res = await axios.post("http://localhost:8000/admin/user", {
        name: formData.name,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        bmi: predictedBmi,
        ethnicity: Number(formData.ethnicity),
        lifestyle: Number(formData.lifestyle),
        income: Number(formData.income),
      });
      setUserId(res.data._id);
    } catch (error) {
      alert("Error calculating BMI or saving user data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bmi && userId) {
      const generatePlans = async () => {
        try {
          const lifestyleLabel = lifestyleOptions.find(
            (o) => o.value === Number(formData.lifestyle)
          )?.label;

          // Get nutrition plan
          const nutritionRes = await axios.post(
            "http://localhost:5000/generate-plan",
            {
              type: "nutrition",
              age: formData.age,
              bmi: bmi.toFixed(1),
              lifestyle: lifestyleLabel,
            }
          );
          setNutritionPlan(nutritionRes.data.plan || []);

          // Get fitness plan
          const fitnessRes = await axios.post(
            "http://localhost:5000/generate-plan",
            {
              type: "fitness",
              age: formData.age,
              bmi: bmi.toFixed(1),
              lifestyle: lifestyleLabel,
            }
          );
          setFitnessPlan(fitnessRes.data.plan || []);

          // Save plans to database
          await axios.post("http://localhost:8000/admin/plans", {
            userId: userId,
            fitnessPlan: fitnessRes.data.plan,
            nutritionPlan: nutritionRes.data.plan,
          });
        } catch (error) {
          console.error("Plan generation error:", error);
        }
      };

      generatePlans();
    }
  }, [userId, bmi]);

  const getBmiCategory = (bmiValue) => {
    if (bmiValue < 18.5) return "Underweight";
    if (bmiValue <= 24.9) return "Healthy Weight";
    if (bmiValue <= 29.9) return "Overweight";
    return "Obese";
  };

  const getBmiColor = (bmiValue) => {
    if (bmiValue < 18.5) return "#63e6be";
    if (bmiValue <= 24.9) return "#51cf66";
    if (bmiValue <= 29.9) return "#fcc419";
    return "#ff6b6b";
  };

  return (
    <div className="calculator-container">
      <div className="form-section">
        <h2 className="calculator-title">BMI Calculator</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label><FaUser className="input-icon" /> Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label><FaBirthdayCake className="input-icon" /> Age (years)</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              required
              placeholder="e.g. 25"
            />
          </div>

          <div className="form-group">
            <label><FaWeight className="input-icon" /> Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="1"
              step="0.1"
              required
              placeholder="e.g. 68.5"
            />
          </div>

          <div className="form-group">
            <label><FaRulerVertical className="input-icon" /> Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="1"
              required
              placeholder="e.g. 175"
            />
          </div>

          <div className="form-group">
            <label><FaUser className="input-icon" /> Ethnicity</label>
            <select
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
              required
            >
              {ethnicityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><FaRunning className="input-icon" /> Activity Level</label>
            <select
              name="lifestyle"
              value={formData.lifestyle}
              onChange={handleChange}
              required
            >
              {lifestyleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label><FaMoneyBillWave className="input-icon" /> Income Ratio</label>
            <select
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
            >
              {incomeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="calculate-btn">
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              "Calculate BMI & Generate Plans"
            )}
          </button>
        </form>

        {bmi !== null && (
          <div className="results-section">
            <div className="bmi-result">
              <h3>Your Results</h3>
              <div className="bmi-score">
                <span className="bmi-value">{bmi.toFixed(1)}</span>
                <div>
                  <span 
                    className="bmi-category"
                    style={{ backgroundColor: getBmiColor(bmi) }}
                  >
                    {getBmiCategory(bmi)}
                  </span>
                  <div className="bmi-bar">
                    {bmiCategories.map((cat, i) => (
                      <div
                        key={i}
                        className="bmi-segment"
                        style={{
                          backgroundColor: cat.color,
                          width: `${100 / bmiCategories.length}%`
                        }}
                      >
                        {getBmiCategory(bmi) === cat.category && (
                          <div
                            className="bmi-marker"
                            style={{ left: `${(bmi - 15) / 30 * 100}%` }}
                          ></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="plans-tabs">
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`}
                  onClick={() => setActiveTab('nutrition')}
                >
                  <GiMeal className="tab-icon" /> Nutrition Plan
                </button>
                <button
                  className={`tab-btn ${activeTab === 'fitness' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fitness')}
                >
                  <MdFitnessCenter className="tab-icon" /> Fitness Plan
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'nutrition' && nutritionPlan && (
                  <div className="nutrition-plan">
                    <h4><FaUtensils /> Your Personalized Nutrition Plan</h4>
                    <div className="meals-grid">
                      {nutritionPlan.map((meal, index) => (
                        <div key={index} className="meal-card">
                          <h5>{meal.title}</h5>
                          <p>⏱️ Ready in {meal.readyInMinutes} minutes</p>
                          <p>🍽️ Servings: {meal.servings || 'N/A'}</p>
                          {meal.sourceUrl && (
                            <a 
                              href={meal.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="plan-link"
                            >
                              View Recipe
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'fitness' && fitnessPlan && (
                  <div className="fitness-plan">
                    <h4><FaDumbbell /> Your Personalized Fitness Plan</h4>
                    <div className="exercises-list">
                      {fitnessPlan.map((exercise, index) => (
                        <div key={index} className="exercise-card">
                          <h5>{exercise.name}</h5>
                          <p>{exercise.description?.replace(/<[^>]*>/g, "")}</p>
                          {exercise.videoUrl && (
                            <a 
                              href={exercise.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="plan-link"
                            >
                              Watch Demonstration
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
              {ethnicityOptions.map((opt) => (
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
              {lifestyleOptions.map((opt) => (
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
              {incomeOptions.map((opt) => (
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