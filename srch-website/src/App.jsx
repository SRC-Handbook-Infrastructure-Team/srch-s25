import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Demo from './components/Demo.jsx'
import './App.css'
import ResizableDrawer from './components/Drawer.jsx'

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <ResizableDrawer markdownPath="README.md"/>
      <h1>This is the entry point!</h1>
    </>
  )
}

export default App
