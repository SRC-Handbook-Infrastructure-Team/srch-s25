import React from 'react'
import MarkdownRenderer from '../util/MarkdownRenderer'
import testMD from '../markdown/test.md?raw'

function Home() {
  return (
    <div>
        <h1>This is the home page</h1>
        <MarkdownRenderer content={testMD} />
        {/* TODO: Generally we want to show either the currently selected file (using markdown renderer) */}
        {/* Or the actual homepage (can just be a component here) */}
    </div>
    
  )
}

export default Home