import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, useDisclosure, useColorMode } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ContentDrawer from "@/components/ContentDrawer";
import { useTheme, ExtendedChakraTheme } from "@/context/ThemeContext";
import { useMarkdown } from "@/context/MarkdownContext";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const extendedTheme = theme as ExtendedChakraTheme; // So we can access .layout
  const { colorMode } = useColorMode();
  const {
    isOpen: isMobileSidebarOpen,
    onToggle: toggleMobileSidebar,
    onClose: closeMobileSidebar,
  } = useDisclosure();
  const { isDrawerOpen, closeDrawer, drawerContent } = useMarkdown();

  // We read from extendedTheme.layout
  const defaultSidebarWidth = extendedTheme.layout.sidebarWidth;
  const defaultDrawerWidth = extendedTheme.layout.drawerWidth;
  const contentMaxWidth = extendedTheme.layout.contentWidth;

  // Collapsible sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // We only enable resizing for the sidebar and drawer now,
  // removing the content resizing for a simpler layout.
  const [sidebarWidth, setSidebarWidth] = useState(defaultSidebarWidth);
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);

  // For the drag interactions
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingDrawer, setIsResizingDrawer] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState("");

  // If the user collapses, set sidebar to 0
  useEffect(() => {
    if (isSidebarCollapsed) {
      setSidebarWidth("0px");
    } else {
      setSidebarWidth(defaultSidebarWidth);
    }
  }, [isSidebarCollapsed, defaultSidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar) {
        const newWidth = Math.max(
          180,
          Math.min(600, parseInt(startWidth) + (e.clientX - startX))
        );
        setSidebarWidth(`${newWidth}px`);
      } else if (isResizingDrawer && isDrawerOpen) {
        const newWidth = Math.max(
          250,
          Math.min(800, parseInt(startWidth) - (e.clientX - startX))
        );
        setDrawerWidth(`${newWidth}px`);
      }
    };

    const handleMouseUp = () => {
      setIsResizingSidebar(false);
      setIsResizingDrawer(false);
    };

    if (isResizingSidebar || isResizingDrawer) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingSidebar, isResizingDrawer, isDrawerOpen, startX, startWidth]);

  // Initiate the sidebar drag
  const handleSidebarResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    setStartX(e.clientX);
    setStartWidth(sidebarWidth.replace("px", ""));
  };

  // Initiate the drawer drag
  const handleDrawerResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingDrawer(true);
    setStartX(e.clientX);
    setStartWidth(drawerWidth.replace("px", ""));
  };

  return (
    <Flex direction="column" minH="100vh">
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
        overflow="hidden"
      >
        {/* Desktop sidebar */}
        <Box
          display={{ base: "none", md: "block" }}
          position="relative"
          left={0}
          top={0}
          h="calc(100vh - 60px)"
          w={sidebarWidth}
          transition="width 0.2s ease"
          bg={colorMode === "dark" ? "gray.800" : "white"}
          borderRightWidth={isSidebarCollapsed ? "0px" : "1px"}
          borderRightColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          overflowY="auto"
          style={{ marginTop: "60px" }}
          zIndex="docked"
        >
          {!isSidebarCollapsed && (
            <>
              <Sidebar />
              {/* Resizing handle for the sidebar */}
              <Box
                position="absolute"
                top={0}
                right={0}
                bottom={0}
                w="12px"
                cursor="col-resize"
                zIndex={9999}
                bg="transparent"
                _hover={{ bg: colorMode === "dark" ? "blue.300" : "blue.100" }}
                onMouseDown={handleSidebarResizeMouseDown}
                role="separator"
                aria-orientation="vertical"
              />
            </>
          )}
        </Box>

        {/* Mobile sidebar as a Drawer */}
        <Sidebar
          isMobile
          isOpen={isMobileSidebarOpen}
          onClose={closeMobileSidebar}
        />

        {/* Main content area (not resizable here) */}
        <Box
          flex="1"
          ml={{ base: 0, md: isSidebarCollapsed ? 0 : sidebarWidth }}
          transition="margin-left 0.2s ease"
          p={{ base: 4, md: 6 }}
          bg={colorMode === "dark" ? "gray.900" : "gray.50"}
          minH="calc(100vh - 60px)"
          position="relative"
        >
          {/* We center the content with maxW from user settings */}
          <Box
            maxW={contentMaxWidth}
            w="100%"
            mx="auto"
            bg={colorMode === "dark" ? "gray.800" : "white"}
            borderRadius="lg"
            boxShadow="md"
            p={{ base: 4, md: 6 }}
            overflow="auto"
          >
            {children}
          </Box>
        </Box>

        {/* Right drawer for supplementary content */}
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
