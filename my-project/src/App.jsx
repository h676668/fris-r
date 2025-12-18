import React from 'react';
import './App.css';
import Header from './Components/Header';
import Hero from './Components/Hero';
import Contact from './Components/Contact';
import OmOss from './Components/OmOss';
import Tjenester from './Components/Tjenester';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Container for innholdet under Header */}
      <main className="pt-20 lg:pt-24">
        <Hero />
        <Tjenester/>
        <OmOss/>
        
        <Contact />
      </main>
    </div>
  );
}

export default App;