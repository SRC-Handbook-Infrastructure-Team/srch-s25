import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Newpage from './pages/Newpage'



function App() {
  return (
    <ChakraProvider>
      <BrowserRouter basename="/srch-s25/">
        {/* <Home */}
        {/* TODO: add more paths for everything */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Newpage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App
