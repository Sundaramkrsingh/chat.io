import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return <>
    <BrowserRouter>
      <Routes>
        <Route path="" element={} />
        <Route path="" element={} />
        <Route path="" element={} />
      </Routes>
    </BrowserRouter>
  </>
}

export default App
