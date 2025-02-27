import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import { Home } from './pages/Home.jsx'
import './App.css'
import Home from './pages/Home'
import Docs from "./pages/Docs.jsx";

function App() {
  return (
    <Router basename="/srch-s25/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </Router>
  );
}

export default App
