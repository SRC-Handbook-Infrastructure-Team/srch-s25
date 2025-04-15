import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Drawer, DrawerBody, DrawerHeader, DrawerContent, DrawerCloseButton, useMediaQuery, useToast } from '@chakra-ui/react';
import MarkdownRenderer, {  getSections, getDrawerFile, getContent, getSubsections } from '../util/MarkdownRenderer';

function MarkdownPage() {
  // Get parameters from URL and location for hash
  const { sectionId, subsectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  // State for content
  const [mainContent, setMainContent] = useState("");
  const [drawerContent, setDrawerContent] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState("/");
  const [isLoading, setIsLoading] = useState(false);

  // Store the current valid path whenever content loads successfully
  useEffect(() => {
    if (mainContent && !isLoading) {
      setPreviousPath(location.pathname);
    }
  }, [mainContent, location.pathname, isLoading]);

  // Load content based on URL parameters
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);

      // If no section specified, load the main index or redirect to first section
      if (!sectionId) {
        const sections = await getSections();
        if (sections.length > 0) {
          navigate(`/${sections[0].id}`);
        }
        setIsLoading(false);
        return;
      }

      // If section but no subsection specified
      if (sectionId && !subsectionId) {
        const content = await getContent(sectionId);

        if (content) {
          setMainContent(content);

          // Preload subsections in case we need them
          const subsections = await getSubsections(sectionId);

          // If no specific section content or it's very minimal, redirect to first subsection
          if (!content.trim() || content.trim().length < 50) {
            if (subsections.length > 0) {
              navigate(`/${sectionId}/${subsections[0].id}`);
            }
          }
        } else {
          // If section not found, show toast error and stay on the current page
          toast({
            title: "Section Not Found",
            description: `The section "${sectionId}" could not be found.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });

          // Navigate back to the previous valid path instead of changing the URL
          navigate(previousPath, { replace: true });
        }
        setIsLoading(false);
        return;
      }

      // If both section and subsection specified
      if (sectionId && subsectionId) {
        const content = await getContent(sectionId, subsectionId);
        if (content) {
          setMainContent(content);
        } else {
          // If subsection not found, show toast error and stay on the current page
          toast({
            title: "Subsection Not Found",
            description: `The subsection "${subsectionId}" in section "${sectionId}" could not be found.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });

          // Navigate back to the previous valid path instead of changing the URL
          navigate(previousPath, { replace: true });
        }
      }
      setIsLoading(false);
    }

    loadContent();
  }, [sectionId, subsectionId, navigate, toast, previousPath]);

  // Pre-check if content exists before navigating
  const checkAndNavigate = useCallback(
    async (path) => {
      // Don't do anything if we're already loading content
      if (isLoading) return;

      // Parse the path
      const pathParts = path.split("/").filter(Boolean);
      const targetSectionId = pathParts[0];
      const targetSubsectionId = pathParts[1] || null;

      // Check if the content exists before navigating
      try {
        let contentExists = false;

        if (targetSubsectionId) {
          // Check if the section and subsection exist
          contentExists =
            (await getContent(targetSectionId, targetSubsectionId)) !== null;
        } else {
          // Check if just the section exists
          contentExists = (await getContent(targetSectionId)) !== null;
        }

        if (contentExists) {
          // Content exists, navigate to it
          navigate(`/${path}`);
        } else {
          // Content doesn't exist, show error
          let errorTitle, errorDescription;

          if (targetSubsectionId) {
            errorTitle = "Subsection Not Found";
            errorDescription = `The subsection "${targetSubsectionId}" in section "${targetSectionId}" could not be found.`;
          } else {
            errorTitle = "Section Not Found";
            errorDescription = `The section "${targetSectionId}" could not be found.`;
          }

          toast({
            title: errorTitle,
            description: errorDescription,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      } catch (error) {
        console.error("Error checking content:", error);
        toast({
          title: "Navigation Error",
          description: "An error occurred while trying to navigate.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    },
    [isLoading, navigate, toast]
  );

  // Handle clicking drawer links
  function handleDrawerOpen(targetId) {
    // Load drawer content for the current section/subsection
    if (sectionId && subsectionId) {
      getDrawerFile(sectionId, subsectionId, targetId).then((content) => {
        if (content) {
          setDrawerContent(content);
          setIsDrawerOpen(true);
        } else {
          // Show error toast for missing drawer content
          toast({
            title: "Drawer Content Not Found",
            description: `The drawer content "${targetId}" could not be found.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      });
    }
  }

  // Handle clicking navigation links
  function handleNavigation(targetId) {
    // Close drawer if open
    setIsDrawerOpen(false);

    // Check if this is a path with section/subsection or just a section
    if (targetId.includes("/")) {
      // Full path format: "section/subsection"
      checkAndNavigate(targetId);
    } else {
      // Simple path - could be a subsection in current section or a different section

      // If we're already in a section, assume it's a subsection of current section
      if (sectionId && !subsectionId) {
        checkAndNavigate(`${sectionId}/${targetId}`);
      } else {
        // Otherwise treat it as a section
        checkAndNavigate(targetId);
      }
    }
  }

  // Handle hash links (anchor scrolling)
  useEffect(() => {
    if (!mainContent) return; // Don't try to scroll if content isn't loaded

    // Use a timeout to ensure DOM has updated with the new content
    const timer = setTimeout(() => {
      // Get hash from the location object (more reliable than window.location)
      if (location.hash) {
        // Remove the # symbol
        const id = location.hash.replace("#", "");

        // Find element and scroll to it
        const element = document.getElementById(id);
        if (element) {
          // Scroll with a slight delay to ensure rendering is complete
          element.scrollIntoView({ behavior: "smooth" });
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
