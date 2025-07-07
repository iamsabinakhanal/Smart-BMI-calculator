import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function FitnessPlan() {
  const location = useLocation();
  const { age, bmi, lifestyle, income, ethnicity } = location.state || {};
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!age || !bmi) {
      setError("Missing required data to generate fitness plan.");
      setLoading(false);
      return;
    }

    async function fetchPlan() {
      try {
        const response = await axios.post("http://localhost:5000/generate-plan", {
          type: "fitness",
          age,
          bmi,
          lifestyle,
          income,
          ethnicity
        });
        setPlan(response.data.plan || []);
      } catch (err) {
        setError("Failed to load fitness plan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [age, bmi, lifestyle, income, ethnicity]);

  if (loading) return <p>Loading Fitness Plan...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Weekly Fitness Plan</h1>
      {plan.length > 0 ? (
        <div>
          {plan.map((dayPlan, index) => (
            <div key={index} style={{ marginBottom: "1.5rem" }}>
              <h2>{dayPlan.day}</h2>
              <ul>
                {dayPlan.exercises.map((exercise, idx) => (
                  <li key={idx}>
                    <strong>{exercise.name}</strong>:{" "}
                    {exercise.description
                      ? exercise.description.replace(/<[^>]*>/g, "")
                      : "No description available."}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No fitness exercises found for your profile.</p>
      )}
    </div>
  );
}
