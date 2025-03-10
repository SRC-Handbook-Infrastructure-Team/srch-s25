import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorMode,
  Box,
  IconButton,
  Tooltip,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import MarkdownRenderer from "./MarkdownRenderer";

/**
 * Props for the ContentDrawer component
 */
interface ContentDrawerProps {
  isOpen: boolean;           // Whether the drawer is currently open
  onClose: () => void;       // Function to call when drawer should close
  content: string;           // Markdown content to display in the drawer
  width?: string;            // Width of the drawer (CSS value)
  onResizeStart?: (e: React.MouseEvent) => void; // Handler for resize operations
}

/**
 * ContentDrawer Component
 * 
 * A sliding drawer that displays supplementary markdown content.
 * Features:
 * 1. Resizable width with drag handle
 * 2. Renders markdown content with the same renderer as main content
 * 3. Smooth animations and transitions
 * 4. Theme-aware styling
 * 5. Accessibility support
 * 
 * This component is used to show additional information without
 * navigating away from the current page, enhancing the user experience
 * by keeping context while exploring related content.
 */
const ContentDrawer: React.FC<ContentDrawerProps> = ({
  isOpen,
  onClose,
  content,
  width = "400px",
  onResizeStart,
}) => {
  const { colorMode } = useColorMode();

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="md"
      closeOnEsc
      closeOnOverlayClick
      trapFocus
      preserveScrollBarGap
    >
      {/* Backdrop with blur effect for better visual hierarchy */}
      <DrawerOverlay backdropFilter="blur(2px)" />
      
      {/* Drawer container with dynamic width */}
      <DrawerContent
        bg={colorMode === "dark" ? "gray.800" : "white"}
        maxW={width}
        transition="none" // Disable transition for smooth resize
        role="region"
        aria-label="Supplementary content drawer"
        boxShadow="2xl"
      >
        {/* Close button with enhanced styling */}
        <DrawerCloseButton 
          zIndex="10"
          size="lg"
          borderRadius="full"
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          _hover={{
            bg: colorMode === "dark" ? "gray.600" : "gray.200",
          }}
          mt={2}
          mr={2}
          aria-label="Close drawer"
        />
        
        {/* Header with title */}
        <DrawerHeader 
          borderBottomWidth="1px" 
          borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          py={3}
          px={4}
          bg={colorMode === "dark" ? "gray.900" : "gray.50"}
        >
          <Heading size="md" fontWeight="medium">Additional Information</Heading>
        </DrawerHeader>
        
        {/* Content area with markdown renderer */}
        <DrawerBody p={5} position="relative">
          {/* Render markdown content using the same renderer as main content */}
          <MarkdownRenderer content={content} />

          {/* Resize handle for the drawer - only shown if resizing is enabled */}
          {onResizeStart && (
            <Box
              position="absolute"
              top="50%"
              left={0}
              transform="translateY(-50%)"
              h="80px"
              w="6px"
              cursor="col-resize"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              _hover={{ bg: colorMode === "dark" ? "blue.500" : "blue.300" }}
              _active={{ bg: colorMode === "dark" ? "blue.600" : "blue.400" }} 
              onMouseDown={onResizeStart}
              zIndex={10}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize drawer width"
              title="Drag to resize"
            >
              {/* Visual indicator for the resize handle */}
              <Flex
                h="40px"
                w="4px"
                borderRadius="full"
                bg={colorMode === "dark" ? "gray.600" : "gray.400"}
                alignItems="center"
                justifyContent="center"
              >
                {/* Tooltip to explain the resize functionality */}
                <Tooltip label="Resize drawer" placement="left" hasArrow>
                  <IconButton
                    aria-label="Resize drawer"
                    icon={<ChevronLeftIcon />}
                    size="xs"
                    variant="ghost"
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                  />
                </Tooltip>
              </Flex>
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ContentDrawer;
