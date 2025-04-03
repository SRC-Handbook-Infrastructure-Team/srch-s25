import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import theme from './theme'
import Home from './pages/Home'
import Newpage from './pages/Newpage'
import NavBar from './components/NavBar'



function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename="/srch-s25/">
        {/* TODO: add the navbar on the App so it appears on every page */}
        <NavBar/>
        {/* <Home */}
        {/* TODO: add more paths for everything */}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai" element={<Newpage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App
