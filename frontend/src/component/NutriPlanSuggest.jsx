import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function NutritionPlan() {
  const location = useLocation();
  const { age, bmi, lifestyle } = location.state || {};

  const [plan, setPlan] = useState(null);
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
        setPlan(res.data.plan);
      } catch (err) {
        setError("Failed to load nutrition plan.");
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [age, bmi, lifestyle]);

  if (loading) return <p>Loading Nutrition Plan...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Nutrition Plan</h1>
      {plan ? (
        <>
          <h2>Meals</h2>
          <ul>
            {plan.map((p, i) => (
              <>
                {p.meals.map((meal, i) => (
                  <li key={i}>
                    🍽️ {meal.title} — {meal.readyInMinutes} mins
                  </li>
                ))}
              </>
            ))}
          </ul>
        </>
      ) : (
        <p>No meals found.</p>
      )}
    </div>
  );
}