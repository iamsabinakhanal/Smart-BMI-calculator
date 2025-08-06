import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/NutritionPlan.css";

export default function NutritionPlan() {
  const location = useLocation();
  const { age, bmi, lifestyle } = location.state || {};

  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!age || !bmi) {
      setError("Missing age or BMI data.");
      setLoading(false);
      return;
    }

    async function fetchPlan() {
      try {
        const res = await axios.post("http://127.0.0.1:5000/generate-plan", {
          type: "nutrition",
          age,
          bmi,
          lifestyle,
        });

        // Transform the data to match the admin dashboard structure
        const transformedPlan = res.data.plan?.map(dayPlan => ({
          day: dayPlan.day || 'Unspecified Day',
          meals: dayPlan.meals?.map(meal => ({
            title: meal.title || meal.mealTitle || 'Healthy Meal',
            readyInMinutes: meal.readyInMinutes || meal.prepTime || 30,
            servings: meal.servings || meal.portionSize || 2,
            ingredients: meal.ingredients || ['Fresh ingredients'],
            sourceUrl: meal.sourceUrl || meal.recipeLink || null
          })) || []
        })) || [];

        setPlan(transformedPlan);
      } catch (err) {
        setError("Failed to load nutrition plan.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [age, bmi, lifestyle]);

  if (loading) return <div className="plan-loading">Generating your personalized nutrition plan...</div>;
  if (error) return <div className="plan-error">{error}</div>;

  return (
    <div className="nutrition-plan">
      <h1>Your Personalized Nutrition Plan</h1>
      
      {plan.length > 0 ? (
        <div className="meal-plan">
          {plan.map((day) => (
            <div key={day.day} className="day-plan">
              <h2>{day.day}</h2>
              <div className="meals-container">
                {day.meals.map((meal, index) => (
                  <div key={index} className="meal-card">
                    <h3>{meal.title}</h3>
                    <div className="meal-details">
                      <p>⏱️ Ready in {meal.readyInMinutes} minutes</p>
                      <p>🍽️ Servings: {meal.servings}</p>
                    </div>
                    <div className="meal-ingredients">
                      <h4>Ingredients:</h4>
                      <ul>
                        {meal.ingredients.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    {meal.sourceUrl && (
                      <a href={meal.sourceUrl} className="recipe-link" target="_blank" rel="noopener noreferrer">
                        View Full Recipe
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-plan">
          <p>We couldn't generate a nutrition plan for your profile.</p>
          <p>Please try again or check your inputs.</p>
        </div>
      )}
    </div>
  );
}