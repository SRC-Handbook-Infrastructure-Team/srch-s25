import React from 'react'
import { Box, Heading, Text, Divider } from '@chakra-ui/react'

function Newpage() {
  return (
    <Box maxW="800px" m="0" p="2rem" textAlign="left">
      {/* Section heading */}
      <Heading as="h1" size="lg" fontWeight="bold" fontFamily="heading">
        2.c.i - Abbrv Name
      </Heading>

      {/* Last updated label */}
      <Text fontSize="sm" color="gray.500" mt={1}>
        Last updated on
      </Text>

      {/* Divider below heading */}
      <Divider my={4} borderColor="gray.200" />

      {/* TODO: Markdown content here */}
      {/* <MarkdownRenderer content={} /> */}
    </Box>
  )
}

export default Newpage
