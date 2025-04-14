// import React from 'react'

// import {
//   Link as RouterLink,
//   useLocation
// } from 'react-router-dom'
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerBody,
//   List,
//   ListItem,
//   Link,
//   Text
// } from '@chakra-ui/react'

// function NavBar() {
//   const currLocation = useLocation()
//   // TODO: Maybe cut the front of this to just get the current path
//   const currPath = location.pathname
//   // cuts the first '/srch-s25'
//   const currPathPruned = currPath.slice(9)

//   console.log(currPathPruned);
//   return (
//     <>
//       {/* Always want this drawer to be open */}
//       <Drawer isOpen={true} placement="left">
//         {/* Styling of border */}
//         <DrawerContent borderRight="1px solid #E2E8F0" maxW="260px">
//           <RouterLink to="/">
//             <DrawerHeader fontSize="lg" fontWeight="bold" color="gray.800" fontFamily="heading" pt={6} pb={4}>
//               SRC Handbook
//             </DrawerHeader>
//           </RouterLink>

//           <DrawerBody>
//             {/* TODO: Probably want this to parse MD somehow to get the file structure */}
//             {/* TODO: Background: make it more extensible (a function to automatically set background) + Styling */}
//             <List spacing={1}>
//               <ListItem bg={currPathPruned === "/" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
//                 <Link as={RouterLink} to="/" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
//                   <Text fontSize="sm" fontWeight="normal" color="gray.700" fontFamily="body">
//                     Home
//                   </Text>
//                 </Link>
//               </ListItem>
//               <ListItem bg={currPathPruned === "/ai" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
//                 <Link as={RouterLink} to="/ai" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
//                   <Text fontSize="sm" fontWeight="normal" color="gray.700" fontFamily="body">
//                     1. Fairness and Justice
//                   </Text>
//                 </Link>
//               </ListItem>
//               {/* Styling of sublist */}
//               <List pl={4} mt="1">
//                 <ListItem bg={currPathPruned === "/1ci" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
//                   <Link as={RouterLink} to="/1ci" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
//                     <Text fontSize="sm" color="gray.600" fontFamily="body">
//                       1.c.i Subitem 1
//                     </Text>
//                   </Link>
//                 </ListItem>
//                 <ListItem bg={currPathPruned === "/1cii" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
//                   <Link as={RouterLink} to="/1cii" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
//                     <Text fontSize="sm" color="gray.600" fontFamily="body">
//                       1.c.ii Subitem 2
//                     </Text>
//                   </Link>
//                 </ListItem>
//               </List>
//             </List>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </>
//   );
// }

// export default NavBar

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
        console.log("LOGGING FILES")
        console.log(files)
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

  console.log("FILE ID", currPath)
  
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
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          SRC Handbook
        </Text>
      </Link>

      <Divider mb={4} />

      <VStack align="stretch" spacing={2}>
        {/* Exclude the Home page file */}
        {mainFiles
          .filter((file) => file.order > 0)
          .map((file) => (
            <Box key={file.id} mb={2}>
              <Link to={`/${file.id}`}>
                <Text
                  fontWeight="medium"
                  p={2}
                  bg={currentFileId === file.id ? "gray.100" : "transparent"}
                  borderRadius="md"
                >
                  {file.order}. {file.title}
                </Text>
              </Link>

              {/* Show subsections if this is the current file */}
              {subsections[file.id] && currentFileId === file.id && (
                <VStack align="stretch" pl={4} mt={1} spacing={0}>
                  {subsections[file.id].map((subsection) => (
                    <Link
                      key={subsection.id}
                      to={`/srch-s25/${file.id}#${subsection.id}`}
                      onClick={(e) => {
                        // If we're already on this page, force the scroll effect
                        if (currentFileId === file.id) {
                          e.preventDefault();
                          const element = document.getElementById(
                            subsection.id
                          );
                          if (element) {
                            // Update the URL without full navigation
                            window.history.pushState(
                              null,
                              "",
                              `/srch-s25/${file.id}#${subsection.id}`
                            );
                            // Scroll to the element
                            element.scrollIntoView({ behavior: "smooth" });
                          }
                        }
                      }}
                    >
                      <Text
                        fontSize="sm"
                        p={1}
                        fontWeight={
                          currentSection === subsection.id ? "bold" : "normal"
                        }
                        color={
                          currentSection === subsection.id
                            ? "blue.500"
                            : "inherit"
                        }
                      >
                        {subsection.title}
                      </Text>
                    </Link>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        <Box mb={2}>
          {/* TODO: only make the sub menus show if it is selected*/}
          <Link to="/acknowledgements">
            <Text p={2}>Acknowledgements</Text>
          </Link>
          {currPath.includes("acknowledgements") && (
            <VStack align="stretch" pl={4} mt={1} spacing={0}>
              <Link to="/acknowledgements/ai">
                <Text fontSize="sm" p={1}>
                  AI Team
                </Text>
              </Link>
              <Link to="/acknowledgements/privacy">
                <Text fontSize="sm" p={1}>
                  Privacy Team
                </Text>
              </Link>
              <Link to="/acknowledgements/accessibility">
                <Text fontSize="sm" p={1}>
                  Accessibility Team
                </Text>
              </Link>
              <Link to="/acknowledgements/product">
                <Text fontSize="sm" p={1}>
                  Product Team
                </Text>
              </Link>
              <Link to="/acknowledgements/additional">
                <Text fontSize="sm" p={1}>
                  Additional Contributors
                </Text>
              </Link>
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default NavBar;