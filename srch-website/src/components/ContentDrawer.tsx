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
} from "@chakra-ui/react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ContentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  width?: string;
  onResizeStart?: (e: React.MouseEvent) => void;
}

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
      <DrawerOverlay />
      <DrawerContent
        bg={colorMode === "dark" ? "gray.800" : "white"}
        maxW={width}
        transition="none"
        role="region"
        aria-label="Supplementary content drawer"
      >
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Additional Information
        </DrawerHeader>
        <DrawerBody p={4} position="relative">
          <MarkdownRenderer content={content} />

          {/* Resize handle for the drawer */}
          {onResizeStart && (
            <Box
              position="absolute"
              top="50%"
              left={0}
              transform="translateY(-50%)"
              h="40px"
              w="12px"
              cursor="col-resize"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="sm"
              _hover={{ bg: colorMode === "dark" ? "blue.300" : "blue.100" }}
              onMouseDown={onResizeStart}
              zIndex={10}
              role="separator"
              aria-orientation="vertical"
            >
              <Box
                w="2px"
                h="20px"
                bg={colorMode === "dark" ? "gray.600" : "gray.400"}
                borderRadius="full"
              />
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ContentDrawer;
