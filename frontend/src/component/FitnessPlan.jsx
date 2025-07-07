import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function FitnessPlan() {
  const location = useLocation();
<<<<<<< HEAD
  const { age, bmi, lifestyle } = location.state || {};

  const [plan, setPlan] = useState("");
=======
  const { age, bmi, lifestyle, income, ethnicity } = location.state || {};
  const [plan, setPlan] = useState([]);
>>>>>>> origin/Dipika
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!age || !bmi) {
<<<<<<< HEAD
      setError("Missing age or BMI data.");
=======
      setError("Missing required data to generate fitness plan.");
>>>>>>> origin/Dipika
      setLoading(false);
      return;
    }

    async function fetchPlan() {
      try {
<<<<<<< HEAD
        const res = await axios.post("http://127.0.0.1:5000/generate-plan", {
=======
        const response = await axios.post("http://localhost:5000/generate-plan", {
>>>>>>> origin/Dipika
          type: "fitness",
          age,
          bmi,
          lifestyle,
<<<<<<< HEAD
        });
        setPlan(res.data.plan);
      } catch (err) {
        setError("Failed to load fitness plan.");
=======
          income,
          ethnicity
        });
        setPlan(response.data.plan || []);
      } catch (err) {
        setError("Failed to load fitness plan.");
        console.error(err);
>>>>>>> origin/Dipika
      } finally {
        setLoading(false);
      }
    }
<<<<<<< HEAD
    fetchPlan();
  }, [age, bmi, lifestyle]);
=======

    fetchPlan();
  }, [age, bmi, lifestyle, income, ethnicity]);
>>>>>>> origin/Dipika

  if (loading) return <p>Loading Fitness Plan...</p>;
  if (error) return <p>{error}</p>;

  return (
<<<<<<< HEAD
    <div>
      <h1>Fitness Plan</h1>
      <pre style={{ whiteSpace: "pre-wrap" }}>{plan}</pre>
=======
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
>>>>>>> origin/Dipika
    </div>
  );
}
