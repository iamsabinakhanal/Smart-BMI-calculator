import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/FitnessPlan.css";

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

        // Transform the data to match the admin dashboard structure
        const transformedPlan = response.data.plan?.map(dayPlan => ({
          day: dayPlan.day || 'Unspecified Day',
          exercises: dayPlan.exercises?.map(exercise => ({
            name: exercise.name || exercise.exerciseName || 'Custom Exercise',
            description: exercise.description || exercise.instructions || 
                        'This exercise will help improve your fitness level.',
            setsReps: exercise.setsReps || 
                     (exercise.sets && exercise.reps ? `${exercise.sets} sets × ${exercise.reps} reps` : '3 sets × 10 reps'),
            videoUrl: exercise.videoUrl || exercise.demoLink || null
          })) || []
        })) || [];

        setPlan(transformedPlan);
      } catch (err) {
        setError("Failed to load fitness plan.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPlan();
  }, [age, bmi, lifestyle, income, ethnicity]);

  if (loading) return <div className="plan-loading">Generating your personalized fitness plan...</div>;
  if (error) return <div className="plan-error">{error}</div>;

  return (
    <div className="fitness-plan">
      <h1>Your Personalized Fitness Plan</h1>
      
      {plan.length > 0 ? (
        <div className="exercise-plan">
          {plan.map((day) => (
            <div key={day.day} className="day-plan">
              <h2>{day.day}</h2>
              <div className="exercises-container">
                {day.exercises.map((exercise, index) => (
                  <div key={index} className="exercise-card">
                    <h3>{exercise.name}</h3>
                    <p className="exercise-description">{exercise.description}</p>
                    <p className="sets-reps">{exercise.setsReps}</p>
                    {exercise.videoUrl && (
                      <a href={exercise.videoUrl} className="demo-link" target="_blank" rel="noopener noreferrer">
                        Watch Demonstration
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
          <p>We couldn't generate a fitness plan for your profile.</p>
          <p>Please try again or check your inputs.</p>
        </div>
      )}
    </div>
  );
}