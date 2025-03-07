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
      <DrawerOverlay backdropFilter="blur(2px)" />
      <DrawerContent
        bg={colorMode === "dark" ? "gray.800" : "white"}
        maxW={width}
        transition="none"
        role="region"
        aria-label="Supplementary content drawer"
        boxShadow="2xl"
      >
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
        />
        <DrawerHeader 
          borderBottomWidth="1px" 
          borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          py={3}
          px={4}
          bg={colorMode === "dark" ? "gray.900" : "gray.50"}
        >
          <Heading size="md" fontWeight="medium">Additional Information</Heading>
        </DrawerHeader>
        <DrawerBody p={5} position="relative">
          <MarkdownRenderer content={content} />

          {/* Resize handle for the drawer */}
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
            >
              <Flex
                h="40px"
                w="4px"
                borderRadius="full"
                bg={colorMode === "dark" ? "gray.600" : "gray.400"}
                alignItems="center"
                justifyContent="center"
              >
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
