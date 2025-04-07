import { useState } from 'react'
import './App.css'

import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import MarkdownPage from './pages/MarkdownPage'
import Home from './pages/Home'

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter basename="/srch-s25/">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:fileId" element={<MarkdownPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App
