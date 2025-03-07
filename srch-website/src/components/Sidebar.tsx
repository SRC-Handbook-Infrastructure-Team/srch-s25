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

/** Debounce Hook */
function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMobile = false,
  isOpen = false,
  onClose = () => {},
}) => {
  const { colorMode } = useColorMode();
  const { categories, mainFiles, loadFile, currentFile } = useMarkdown();

  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, boolean>
  >({});
  const [searchValue, setSearchValue] = React.useState("");
  // Debounce for 300ms
  const debouncedSearch = useDebounce(searchValue, 300);

  // Expand category of the current file by default
  React.useEffect(() => {
    if (currentFile) {
      setExpandedCategories((prev) => ({
        ...prev,
        [currentFile.category]: true,
      }));
    }
  }, [currentFile]);

  // Group main files by category
  const filesByCategory = useMemo(() => categories.map((cat) => ({
    ...cat,
    files: mainFiles
      .filter((f) => f.category === cat.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  })), [categories, mainFiles]);

  // Filter based on the debounced search input
  const filteredCategories = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return filesByCategory;
    }
    
    return filesByCategory.map((cat) => {
      const filteredFiles = cat.files.filter((file) => {
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

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleFileClick = (fileId: string) => {
    if (currentFile?.id === fileId) return; // Don't reload if already active
    loadFile(fileId);
    if (isMobile) onClose();
  };

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

      {debouncedSearch.trim() && (
        <Box mb={2}>
          <Text fontSize="sm" color="gray.500">
            Search results for: <Badge colorScheme="blue">{debouncedSearch}</Badge>
          </Text>
        </Box>
      )}

      <Divider />

      {/* Categories & Files */}
      <VStack align="stretch" spacing={1}>
        {filteredCategories.map((cat) => {
          // Skip if no files after filtering
          if (!cat.files.length) return null;

          const isExpanded = expandedCategories[cat.id] || false;
          const isCatCurrent = currentFile?.category === cat.id;

          return (
            <Box key={cat.id} mb={1}>
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
              >
                <Text>
                  {cat.name}
                  {isCatCurrent && !debouncedSearch.trim() && (
                    <Badge ml={2} colorScheme="blue" variant="subtle">
                      Current
                    </Badge>
                  )}
                </Text>
                <Icon 
                  as={isExpanded ? ChevronDownIcon : ChevronRightIcon} 
                  boxSize={5}
                  transition="transform 0.2s"
                />
              </Flex>
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

  // Mobile Drawer
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
