import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, useMediaQuery } from '@chakra-ui/react';
import MarkdownRenderer, { getMainFiles, getDrawerFile } from '../util/MarkdownRenderer';

function MarkdownPage() {
  // Get current file ID from URL and location for hash
  const { fileId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  
  // State for content
  const [mainContent, setMainContent] = useState('');
  const [drawerContent, setDrawerContent] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Load main content
  useEffect(() => {
    // Simple function to load markdown content
    async function loadContent() {
      // Get all files
      const files = await getMainFiles();
      
      // Figure out which file to display
      let targetId = fileId;
      
      // If no file specified, use the first file
      if (!targetId && files.length > 0) {
        targetId = files[0].id;
      }
      
      // Find the file and set its content
      if (targetId) {
        const file = files.find(f => f.id === targetId);
        if (file) {
          setMainContent(file.content);
        }
      }
    }
    
    loadContent();
  }, [fileId]);
  
  // Handle clicking drawer links
  function handleDrawerOpen(targetId) {
    // Load drawer content
    getDrawerFile(targetId).then(content => {
      if (content) {
        setDrawerContent(content);
        setIsDrawerOpen(true);
      }
    });
  }
  
  // Handle clicking navigation links
  function handleNavigation(targetId) {
    // Close drawer if open
    setIsDrawerOpen(false);
    
    // Navigate to the new page
    navigate(`/${targetId}`);
  }
  
  // Handle hash links (anchor scrolling)
  // This runs when either the content changes or the URL hash changes
  useEffect(() => {
    if (!mainContent) return; // Don't try to scroll if content isn't loaded
    
    // Use a timeout to ensure DOM has updated with the new content
    const timer = setTimeout(() => {
      // Get hash from the location object (more reliable than window.location)
      if (location.hash) {
        // Remove the # symbol
        const id = location.hash.replace('#', '');
        
        // Find element and scroll to it
        const element = document.getElementById(id);
        if (element) {
          // Scroll with a slight delay to ensure rendering is complete
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If no hash, scroll to top
        window.scrollTo(0, 0);
      }
    }, 200); // Slightly longer timeout to ensure content is rendered
    
    return () => clearTimeout(timer);
  }, [mainContent, location.hash]); // Respond to both content changes and hash changes
  
  return (
    <div style={{ padding: '20px', marginLeft: isMobile ? '0' : '250px' }}>
      {/* Main content */}
      {mainContent && (
        <MarkdownRenderer 
          content={mainContent} 
          onDrawerOpen={handleDrawerOpen}
          onNavigation={handleNavigation}
        />
      )}
      
      {/* Drawer for additional content */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Additional Information</DrawerHeader>
          <DrawerBody>
            <MarkdownRenderer 
              content={drawerContent}
              onDrawerOpen={handleDrawerOpen}
              onNavigation={handleNavigation}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default MarkdownPage; 