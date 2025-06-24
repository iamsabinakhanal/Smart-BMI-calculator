<<<<<<< HEAD
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from './component/Navbar';
const SmartBMI = lazy(() => import('./component/SmartBMI'));
const NutriPlanSuggest = lazy(() => import('./component/NutriPlanSuggest'));
const BMICalculator = lazy(() => import('./component/BMICalculator'));
=======
import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Lazy load components
const SmartBMI = lazy(() => import('./component/SmartBMI'))
const NutriPlanSuggest = lazy(() => import('./component/NutriPlanSuggest'))
const Fitness = lazy(() => import('./component/Fitness'))
>>>>>>> Development

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SmartBMI />} />
<<<<<<< HEAD
          <Route path="/bmi" element={<BMICalculator />} />
          <Route path="/nutrition" element={<NutriPlanSuggest />} />
          <Route path="/navbar" element={<Navbar />} />
=======
          <Route path="/nutrition" element={<NutriPlanSuggest />} />
          <Route path="/fitness" element={<Fitness />} />
>>>>>>> Development
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App