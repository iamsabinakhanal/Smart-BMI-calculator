import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Lazy load components
const SmartBMI = lazy(() => import('./component/SmartBMI'))
const NutriPlanSuggest = lazy(() => import('./component/NutriPlanSuggest'))
const Fitness = lazy(() => import('./component/Fitness'))

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<SmartBMI />} />
          <Route path="/nutrition" element={<NutriPlanSuggest />} />
          <Route path="/fitness" element={<Fitness />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App