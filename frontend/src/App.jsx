import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './component/Navbar';
import FitnessPlan from './component/FitnessPlan';
import AdminDashboard from './component/AdminDashboard';
import Homepage from './component/Homepage';
const SmartBMI = lazy(() => import('./component/Homepage'));
const NutriPlanSuggest = lazy(() => import('./component/NutriPlanSuggest'));
const BMICalculator = lazy(() => import('./component/BMICalculator'));

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/nutrition" element={<NutriPlanSuggest />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/fitness" element={<FitnessPlan />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
