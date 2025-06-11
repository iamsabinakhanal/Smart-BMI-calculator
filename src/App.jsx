import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SmartBMI from './component/SmartBMI'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <SmartBMI />
    </>
  )
}

export default App
