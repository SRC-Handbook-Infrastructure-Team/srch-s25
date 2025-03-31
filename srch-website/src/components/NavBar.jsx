import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Text,
  VStack,
  Divider
} from '@chakra-ui/react';
import { getMainFiles, parseSubsections } from '../util/MarkdownRenderer';

function NavBar() {
  const location = useLocation();
  const currPath = location.pathname;
  const currPathPruned = currPath.slice(currPath.lastIndexOf('/') + 1);
  
  const [mainFiles, setMainFiles] = useState([]);
  const [subsections, setSubsections] = useState({});
  
  // Load main files on component mount
  useEffect(() => {
    const loadMainFiles = async () => {
      try {
        const files = await getMainFiles();
        setMainFiles(files);
        
        // Parse subsections for each file
        const subsectionMap = {};
        for (const file of files) {
          subsectionMap[file.id] = parseSubsections(file.content);
        }
        setSubsections(subsectionMap);
      } catch (error) {
        console.error('Error loading markdown files:', error);
      }
    };
    
    loadMainFiles();
  }, []);
  
  // Determine which file is current (for home page or direct URL access)
  const getCurrentFileId = () => {
    if (currPathPruned === '') {
      // We're on the home page, so the first file should be considered current
      return mainFiles.length > 0 ? mainFiles[0].id : '';
    }
    return currPathPruned;
  };
  
  // Get the current section from the hash (if any)
  const currentSection = location.hash?.substring(1) || '';
  
  // The ID of the file that's currently active
  const currentFileId = getCurrentFileId();
  
  return (
    <Box 
      position="fixed" 
      left={0} 
      top={0} 
      width="250px" 
      height="100vh" 
      borderRight="1px solid" 
      borderColor="gray.200"
      bg="white"
      overflowY="auto"
      p={4}
      zIndex={10}
    >
      <Link to="/">
        <Text fontSize="xl" fontWeight="bold" mb={4}>SRC Handbook</Text>
      </Link>
      
      <Divider mb={4} />
      
      <VStack align="stretch" spacing={2}>
        {mainFiles.map((file) => (
          <Box key={file.id} mb={2}>
            <Link to={`/${file.id}`}>
              <Text 
                fontWeight="medium" 
                p={2}
                bg={currentFileId === file.id ? "gray.100" : "transparent"}
                borderRadius="md"
              >
                {file.title}
              </Text>
            </Link>
            
            {/* Show subsections if this is the current file */}
            {subsections[file.id] && currentFileId === file.id && (
              <VStack align="stretch" pl={4} mt={1} spacing={0}>
                {subsections[file.id].map((subsection) => (
                  <Link 
                    key={subsection.id} 
                    to={`/${file.id}#${subsection.id}`}
                    onClick={(e) => {
                      // If we're already on this page, force the scroll effect
                      if (currentFileId === file.id) {
                        e.preventDefault();
                        const element = document.getElementById(subsection.id);
                        if (element) {
                          // Update the URL without full navigation
                          window.history.pushState(null, '', `/${file.id}#${subsection.id}`);
                          // Scroll to the element
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                  >
                    <Text 
                      fontSize="sm" 
                      p={1}
                      fontWeight={currentSection === subsection.id ? "bold" : "normal"}
                      color={currentSection === subsection.id ? "blue.500" : "inherit"}
                    >
                      {subsection.title}
                    </Text>
                  </Link>
                ))}
              </VStack>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default NavBar;