import { useState } from 'react'
import './App.css'
import Header from './Components/Header'
import Hero from './Components/Hero'
import Contact from './Components/Contact'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
<div className="pt-20 lg:pt-24">
      
      <Hero />
      <section id="Omoss" className="min-h-screen bg-gray-50 flex items-center justify-center border-b">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Om Oss</h2>
            <p className="text-gray-600">Her kommer informasjon om frisørsalongen.</p>
          </div>
        </section>
        <Contact />
    </div>
    </>
  )
}

export default App
