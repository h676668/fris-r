import { useState } from 'react'
import {BrowserRouter as Router} from "rea"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
    </>
  )
}

export default App
