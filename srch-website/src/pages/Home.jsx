import React from 'react';
import MarkdownPage from './MarkdownPage';

// Home component is now just a wrapper for MarkdownPage
// It will display the default markdown content (first file)
function Home() {
  return <MarkdownPage />;
}

export default Home;