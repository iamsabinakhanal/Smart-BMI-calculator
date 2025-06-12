import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './component/Navbar';
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
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
