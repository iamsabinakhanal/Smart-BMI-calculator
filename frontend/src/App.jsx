import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './component/Navbar';
import FitnessPlan from './component/FitnessPlan';
<<<<<<< HEAD
import FeedbackForm from './component/FeedbackForm'
=======
import AdminDashboard from './component/AdminDashboard';
>>>>>>> 3781ed53822a311f16952f848825da29397cf28c
const SmartBMI = lazy(() => import('./component/SmartBMI'));
const NutriPlanSuggest = lazy(() => import('./component/NutriPlanSuggest'));
const BMICalculator = lazy(() => import('./component/BMICalculator'));

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SmartBMI />} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/nutrition" element={<NutriPlanSuggest />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/fitness" element={<FitnessPlan />} />
<<<<<<< HEAD
          <Route path="/feedback" element={<FeedbackForm />} />
=======
          <Route path="/admin" element={<AdminDashboard />} />
>>>>>>> 3781ed53822a311f16952f848825da29397cf28c
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
