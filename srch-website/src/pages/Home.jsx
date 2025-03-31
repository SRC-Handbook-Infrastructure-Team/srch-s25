import React from 'react'
import MarkdownRenderer from '../util/MarkdownRenderer'


function Home() {
  return (
    <div>
        <h1>This is the home page</h1>
        <MarkdownRenderer>
        </MarkdownRenderer>
        {/* TODO: Generally we want to show either the currently selected file (using markdown renderer) */}
        {/* Or the actual homepage (can just be a component here) */}
    </div>
    
  )
}

export default Home