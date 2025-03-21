import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Newpage from './pages/Newpage'
import NavBar from './components/NavBar'
import About from './pages/About'



function App() {
  return (
    <ChakraProvider>
      <BrowserRouter basename="/srch-s25/">
        <NavBar/>
        {/* TODO: with the markdown parser, this can pull from the structure.json */}
        {/* Create a path for all the link */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Newpage />} />
          <Route path="/about" element={<About/>}/>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App
