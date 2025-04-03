import React from 'react'
import { Box, Heading } from '@chakra-ui/react'
import MarkdownRenderer from '../util/MarkdownRenderer'
import testMD from '../markdown/test.md?raw'

function Home() {
  return (
    <Box>
        <Heading as="h1" size="xl">
          This is the home page
        </Heading>
        <MarkdownRenderer content={testMD} />
        {/* TODO: Generally we want to show either the currently selected file (using markdown renderer) */}
        {/* Or the actual homepage (can just be a component here) */}
    </Box>
  )
}

export default Home
