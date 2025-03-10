import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, useDisclosure, useColorMode } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ContentDrawer from "@/components/ContentDrawer";
import { useTheme, ExtendedChakraTheme } from "@/context/ThemeContext";
import { useMarkdown } from "@/context/MarkdownContext";

/**
 * Props for the MainLayout component.
 */
interface MainLayoutProps {
  children: React.ReactNode; // Content to be displayed in the main content area
}

/**
 * MainLayout Component
 * 
 * The primary layout component for the application that provides:
 * 1. Responsive layout with sidebar, content area, and optional drawer
 * 2. Resizable panels with drag handles
 * 3. Collapsible sidebar
 * 4. Responsive adjustments for mobile/desktop
 * 5. Theme-aware styling
 * 
 * This component is a sophisticated, responsive container that forms the
 * foundation of the application's UI structure.
 * 
 * @param children - Content to render in the main content area
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const extendedTheme = theme as ExtendedChakraTheme; // Cast to access layout properties
  const { colorMode } = useColorMode();
  
  // Mobile sidebar disclosure state
  const {
    isOpen: isMobileSidebarOpen,
    onToggle: toggleMobileSidebar,
    onClose: closeMobileSidebar,
  } = useDisclosure();
  
  // Drawer state from MarkdownContext
  const { isDrawerOpen, closeDrawer, drawerContent } = useMarkdown();

  // Get layout dimensions from theme
  const defaultSidebarWidth = extendedTheme.layout.sidebarWidth;
  const defaultDrawerWidth = extendedTheme.layout.drawerWidth;
  const contentMaxWidth = extendedTheme.layout.contentWidth;

  // State for sidebar collapse toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // State for resizable panels - only sidebar and drawer are resizable
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  // State for resize drag operations
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingDrawer, setIsResizingDrawer] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState("");

  /**
   * Update sidebar width when collapse state changes.
   * Sets width to 0 when collapsed, restores to default when expanded.
   */
  useEffect(() => {
    if (isSidebarCollapsed) {
      setSidebarWidth("0px");
    } else {
      setSidebarWidth(defaultSidebarWidth);
    }
  }, [isSidebarCollapsed, defaultSidebarWidth]);

  /**
   * Handle mouse events for resizing panels.
   * This effect manages the drag operations for resizing the sidebar and drawer.
   * It adds global document listeners when a resize is in progress and cleans them up after.
   */
  useEffect(() => {
    /**
     * Handle mouse movement during resize operations.
     * Calculates new width based on mouse position and constraints.
     */
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        // Calculate new sidebar width with min/max constraints
        const newWidth = Math.max(
          180, // Minimum width
          Math.min(600, parseInt(startWidth) + (e.clientX - startX)) // Maximum width
        );
        setSidebarWidth(`${newWidth}px`);
      } else if (isResizingDrawer && isDrawerOpen) {
        // Calculate new drawer width with min/max constraints
        const newWidth = Math.max(
          250, // Minimum width
          Math.min(800, parseInt(startWidth) - (e.clientX - startX)) // Maximum width
        );
        setDrawerWidth(`${newWidth}px`);
      }
    };

    /**
     * Handle mouse up to end resize operations.
     */
    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingDrawer(false);
    };

    // Add event listeners only during active resize operations
    if (isResizingSidebar || isResizingDrawer) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    
    // Cleanup event listeners on unmount or when resize state changes
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingSidebar, isResizingDrawer, isDrawerOpen, startX, startWidth]);

  /**
   * Initiate sidebar resize operation on mousedown.
   * Captures starting position and width for the drag operation.
   */
  const handleSidebarResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    setStartX(e.clientX);
    setStartWidth(sidebarWidth.replace("px", ""));
  };

  /**
   * Initiate drawer resize operation on mousedown.
   * Captures starting position and width for the drag operation.
   */
  const handleDrawerResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingDrawer(true);
    setStartX(e.clientX);
    setStartWidth(drawerWidth.replace("px", ""));
  };

  return (
    <Flex direction="column" minH="100vh" overflow="hidden">
      {/* Application header with navigation controls */}
      <Header
        toggleSidebar={toggleMobileSidebar}
        toggleDesktopSidebarCollapse={() =>
          setIsSidebarCollapsed((prev) => !prev)
        }
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <Flex
        as="main"
        role="main"
        id="main-content"
        flex="1"
        position="relative"
        h="calc(100vh - 60px)"
        overflow="hidden"
      >
        {/* Desktop sidebar - hidden on mobile */}
        <Box
          display={{ base: "none", md: "block" }} // Hide on mobile
          position="fixed"
          left={0}
          top="60px"
          h="calc(100vh - 60px)"
          w={sidebarWidth}
          transition="width 0.2s ease"
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRightWidth={isSidebarCollapsed ? "0px" : "1px"}
          borderRightColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          overflowY="auto"
          zIndex="docked"
          shadow="sm"
        >
          {!isSidebarCollapsed && (
            <>
              <Sidebar />
              {/* Resize handle for the sidebar - allows width adjustment */}
              <Box
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                w="5px"
                cursor="col-resize"
                zIndex={9999}
                bg="transparent"
                _hover={{ bg: colorMode === "dark" ? "blue.500" : "blue.300" }}
                _active={{ bg: colorMode === "dark" ? "blue.600" : "blue.400" }}
                onMouseDown={handleSidebarResizeMouseDown}
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar"
              />
            </>
          )}
        </Box>

        {/* Mobile sidebar as overlay drawer - visible only on mobile */}
        <Sidebar
          isMobile
          isOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
        />

        {/* Main content area with dynamic margin adjustment */}
        <Box
          flex="1"
          ml={{ base: 0, md: isSidebarCollapsed ? 0 : sidebarWidth }}
          transition="margin-left 0.2s ease"
          p={{ base: 4, md: 6 }}
          bg={colorMode === "dark" ? "gray.900" : "gray.50"}
          h="full"
          overflowY="auto"
          position="relative"
        >
          {/* Content container with max width and centered layout */}
          <Box
            maxW={contentMaxWidth}
            w="100%"
            mx="auto"
            my={4}
            bg={colorMode === "dark" ? "gray.800" : "white"}
            borderRadius="lg"
            boxShadow="md"
            p={{ base: 4, md: 6 }}
            overflow="auto"
            transition="all 0.2s ease"
          >
            {children}
          </Box>
        </Box>

        {/* Right drawer for supplementary content - shown when triggered */}
        <ContentDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          content={drawerContent || ""}
          width={drawerWidth}
          onResizeStart={handleDrawerResizeMouseDown}
        />
      </Flex>
    </Flex>
  );
};

export default MainLayout;
