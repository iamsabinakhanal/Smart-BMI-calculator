import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SmartBMI from './component/SmartBMI'
import NutriPlanSuggest from './component/NutriPlanSuggest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
       <SmartBMI />
       <NutriPlanSuggest/>
    </>
  )
}

export default App
