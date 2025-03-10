import React, { useMemo } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  List,
  ListItem,
  Flex,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useColorMode,
  Icon,
  Collapse,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { useMarkdown } from "@/context/MarkdownContext";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
} from "@chakra-ui/icons";

/**
 * Custom hook for debouncing values.
 * Useful for delaying search operations until the user stops typing.
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value that updates only after the delay
 */
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  isMobile?: boolean;    // Whether this is rendering as a mobile drawer
  isOpen?: boolean;      // For mobile: whether the drawer is open
  onClose?: () => void;  // For mobile: callback to close the drawer
}

/**
 * Sidebar Component
 * 
 * Provides navigation for markdown files organized by categories.
 * Features:
 * 1. Expandable/collapsible categories
 * 2. Real-time search filtering
 * 3. Visual indicators for current selection
 * 4. Responsive design (works as fixed sidebar or mobile drawer)
 * 5. Theme-aware styling
 * 
 * This component is a key navigation element that allows users
 * to browse through the structured content of the application.
 */
const Sidebar: React.FC<SidebarProps> = ({
  isMobile = false,
  isOpen = false,
  onClose = () => {},
}) => {
  const { colorMode } = useColorMode();
  const { categories, mainFiles, loadFile, currentFile } = useMarkdown();

  // Track which categories are expanded/collapsed
  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, boolean>
  >({});
  
  // Search functionality
  const [searchValue, setSearchValue] = React.useState("");
  // Debounce search to improve performance
  const debouncedSearch = useDebounce(searchValue, 300);

  /**
   * Automatically expand the category of the current file
   * This helps users see the context of the current document
   */
  React.useEffect(() => {
    if (currentFile) {
      setExpandedCategories((prev) => ({
        ...prev,
        [currentFile.category]: true,
      }));
    }
  }, [currentFile]);

  /**
   * Organize files by their categories.
   * Memoized to prevent unnecessary recalculation.
   */
  const filesByCategory = useMemo(() => categories.map((cat) => ({
    ...cat,
    files: mainFiles
      .filter((f) => f.category === cat.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  })), [categories, mainFiles]);

  /**
   * Filter files based on search input.
   * If search is empty, show all files.
   * Memoized to prevent filtering on every render.
   */
  const filteredCategories = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return filesByCategory;
    }
    
    return filesByCategory.map((cat) => {
      const filteredFiles = cat.files.filter((file) => {
        // Combine title and category for searching
        const combined = (file.title + file.category)
          .toLowerCase()
          .replace(/\s+/g, "");
        return combined.includes(
          debouncedSearch.toLowerCase().replace(/\s+/g, "")
        );
      });
      return { ...cat, files: filteredFiles };
    });
  }, [filesByCategory, debouncedSearch]);

  /**
   * Toggle a category's expanded/collapsed state
   * 
   * @param catId - ID of the category to toggle
   */
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  /**
   * Handle clicking on a file in the sidebar
   * Loads the selected file and closes the drawer on mobile
   * 
   * @param fileId - ID of the file to load
   */
  const handleFileClick = (fileId: string) => {
    if (currentFile?.id === fileId) return; // Don't reload if already active
    loadFile(fileId);
    if (isMobile) onClose();
  };

  /**
   * The shared sidebar content between desktop and mobile versions
   */
  const SidebarContent = () => (
    <VStack
      align="stretch"
      spacing={4}
      p={4}
      overflowY="auto"
      role="navigation"
      aria-label="Main topic navigation"
      h="full"
    >
      <Heading size="md" mb={1} fontWeight="bold">
        Main Topics
      </Heading>

      {/* Search Box */}
      <Box mb={2}>
        <InputGroup size="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search topics..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="filled"
            size="md"
            aria-label="Search topics"
            borderRadius="md"
            _focus={{
              boxShadow: "outline",
              borderColor: "blue.500",
            }}
          />
        </InputGroup>
      </Box>

      {/* Search indicator - shows only when searching */}
      {debouncedSearch.trim() && (
        <Box mb={2}>
          <Text fontSize="sm" color="gray.500">
            Search results for: <Badge colorScheme="blue">{debouncedSearch}</Badge>
          </Text>
        </Box>
      )}

      <Divider />

      {/* Categories & Files List */}
      <VStack align="stretch" spacing={1}>
        {filteredCategories.map((cat) => {
          // Skip empty categories (e.g., no matches in search)
          if (!cat.files.length) return null;

          const isExpanded = expandedCategories[cat.id] || false;
          const isCatCurrent = currentFile?.category === cat.id;

          return (
            <Box key={cat.id} mb={1}>
              {/* Category header - clickable to expand/collapse */}
              <Flex
                p={3}
                borderRadius="md"
                cursor="pointer"
                fontWeight="semibold"
                align="center"
                justify="space-between"
                onClick={() => toggleCategory(cat.id)}
                bg={
                  isExpanded
                    ? colorMode === "dark"
                      ? "blue.900"
                      : "blue.50"
                    : "transparent"
                }
                color={
                  isExpanded
                    ? colorMode === "dark"
                      ? "blue.200"
                      : "blue.700"
                    : colorMode === "dark"
                    ? "gray.200"
                    : "gray.700"
                }
                _hover={{
                  bg: colorMode === "dark" ? "gray.700" : "gray.100",
                }}
                transition="all 0.2s"
                aria-expanded={isExpanded}
                role="button"
              >
                <Text>
                  {cat.name}
                  {/* Show badge for current category */}
                  {isCatCurrent && !debouncedSearch.trim() && (
                    <Badge ml={2} colorScheme="blue" variant="subtle">
                      Current
                    </Badge>
                  )}
                </Text>
                {/* Chevron icon indicates expanded/collapsed state */}
                <Icon 
                  as={isExpanded ? ChevronDownIcon : ChevronRightIcon} 
                  boxSize={5}
                  transition="transform 0.2s"
                  aria-hidden="true"
                />
              </Flex>
              
              {/* Expandable file list within category */}
              <Collapse in={isExpanded} animateOpacity>
                <List spacing={1} mt={1} ml={2}>
                  {cat.files.map((file) => {
                    const isActive = currentFile?.id === file.id;
                    
                    return (
                      <ListItem key={file.id}>
                        <Flex
                          p={2}
                          pl={4}
                          borderRadius="md"
                          cursor="pointer"
                          align="center"
                          bg={
                            isActive
                              ? colorMode === "dark"
                                ? "blue.800"
                                : "blue.100"
                              : "transparent"
                          }
                          color={
                            isActive
                              ? colorMode === "dark"
                                ? "blue.200"
                                : "blue.700"
                              : "inherit"
                          }
                          fontWeight={isActive ? "medium" : "normal"}
                          _hover={{
                            bg: isActive
                              ? colorMode === "dark"
                                ? "blue.700"
                                : "blue.100"
                              : colorMode === "dark"
                              ? "gray.700"
                              : "gray.100",
                          }}
                          onClick={() => handleFileClick(file.id)}
                          borderLeftWidth={isActive ? "3px" : "0px"}
                          borderLeftColor={isActive ? "blue.500" : "transparent"}
                          transition="all 0.2s"
                          role="button"
                          aria-pressed={isActive}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Text>
                            {file.title}
                          </Text>
                        </Flex>
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </VStack>

      {/* No results message */}
      {filteredCategories.every(cat => cat.files.length === 0) && (
        <Box textAlign="center" py={8} color="gray.500">
          <Text>No matching topics found</Text>
          <Text fontSize="sm" mt={2}>
            Try adjusting your search terms
          </Text>
        </Box>
      )}
    </VStack>
  );

  // Render as a mobile drawer when on small screens
  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation drawer"
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Navigation</DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sidebar
  return <SidebarContent />;
};

export default Sidebar;
