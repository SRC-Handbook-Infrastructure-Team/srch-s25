import MarkdownPage from './MarkdownPage';

// Home component is now just a wrapper for MarkdownPage
// It will display the default markdown content (first file)
function Home() {
  return <MarkdownPage />;
  // return (
  //   <Box>
  //       <Heading as="h1" size="xl">
  //         This is the home page
  //       </Heading>
  //       <MarkdownRenderer content={testMD} />
  //       {/* TODO: Generally we want to show either the currently selected file (using markdown renderer) */}
  //       {/* Or the actual homepage (can just be a component here) */}
  //   </Box>
  // )
}

export default Home
  
// }
