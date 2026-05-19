import { useState } from 'react'
import PWABadge from './PWABadge.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div classname="flex justify-center items-center">
        <h1>This is the first text on the site</h1>
       </div>
      <PWABadge />
    </>
  )
}

export default App
