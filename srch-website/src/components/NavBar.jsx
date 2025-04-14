import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Text,
  VStack,
  Divider,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useMediaQuery,
  Button
} from '@chakra-ui/react';
// import { HamburgerIcon } from '@chakra-ui/icons';
import { getMainFiles, parseSubsections } from '../util/MarkdownRenderer';
import { GiHamburgerMenu } from "react-icons/gi";
import { CiMenuBurger } from "react-icons/ci";


function NavBar() {
  const location = useLocation();
  const currPath = location.pathname;
  const currPathPruned = currPath.slice(currPath.lastIndexOf('/') + 1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  
  const [mainFiles, setMainFiles] = useState([]);
  const [subsections, setSubsections] = useState({});
  const [contentHeadings, setContentHeadings] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [hasFetchedData, setHasFetchedData] = useState(false);

  // Load all sections and their metadata
  useEffect(() => {
    async function loadAllData() {
      try {
        const files = await getMainFiles();
        setMainFiles(files);
        
        // Parse subsections for each file
        const subsectionMap = {};
        for (const file of files) {
          subsectionMap[file.id] = parseSubsections(file.content);
        }

        setSubsections(subsectionsMap);
        setExpandedSections(expandStateMap);

        // If we're on the root path, navigate to the first section
        if (!currentSectionId && sortedSections.length > 0 && !hasFetchedData) {
          navigate(`/${sortedSections[0].id}`);
        }

        // If we're viewing a subsection, load its content headings
        if (currentSectionId && currentSubsectionId) {
          const content = await getContent(
            currentSectionId,
            currentSubsectionId
          );
          if (content) {
            const headings = parseSubsections(content);
            setContentHeadings({
              [`${currentSectionId}/${currentSubsectionId}`]: headings,
            });
          }
        }

        setHasFetchedData(true);
      } catch (error) {
        console.error("Error loading navigation data:", error);
      }
    };
    
    loadMainFiles();
  }, []);
  
  // Determine which file is current (for home page or direct URL access)
  const getCurrentFileId = () => {
    if (currPathPruned === '') {
      return mainFiles.length > 0 ? mainFiles[0].id : '';
    }

    loadAllData();
  }, [currentSectionId, currentSubsectionId, navigate, hasFetchedData]);

  // Handle expanding/collapsing a section
  const toggleSection = (sectionId, event) => {
    // Only handle the expand/collapse icon click
    if (event.target.tagName === "svg" || event.target.closest("svg")) {
      event.preventDefault();
      setExpandedSections((prev) => ({
        ...prev,
        [sectionId]: !prev[sectionId],
      }));
    }
  };
  
  // Get the current section from the hash (if any)
  const currentSection = location.hash?.substring(1) || '';
  
  // The ID of the file that's currently active
  const currentFileId = getCurrentFileId();

  const NavContent = () => (
    <VStack align="stretch" spacing={2}>
      <Link to="/">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          SRC Handbook
        </Text>
      </Link>

      <Divider mb={4} />

      {/* Main navigation items */}
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
                      if (currentFileId === file.id) {
                        e.preventDefault();
                        const element = document.getElementById(subsection.id);
                        if (element) {
                          window.history.pushState(null, "", `/srch-s25/${file.id}#${subsection.id}`);
                          element.scrollIntoView({ behavior: "smooth" });
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

      {/* Acknowledgements section */}
      <Box mb={2}>
        <Link to="/acknowledgements">
          <Text p={2}>Acknowledgements</Text>
        </Link>
        <VStack align="stretch" pl={4} mt={1} spacing={0}>
          <Link to="/acknowledgements/ai">
            <Text>AI Team</Text>
          </Link>
          <Link to="/acknowledgements/privacy">
            <Text>Privacy Team</Text>
          </Link>
          <Link to="/acknowledgements/accessibility">
            <Text>Accessibility Team</Text>
          </Link>
          <Link to="/acknowledgements/product">
            <Text>Product Team</Text>
          </Link>
          <Link to="/acknowledgements/additional">
            <Text>Additional Contributors</Text>
          </Link>
        </VStack>
      </Box>
    </VStack>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          leftIcon={<GiHamburgerMenu size="40px" />}
          pl={6}
          onClick={onOpen}
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody>
              <NavContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

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
      <NavContent />
    </Box>
  );
}

export default NavBar;
