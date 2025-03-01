import React from "react";
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
  // Debounce for 500ms
  const debouncedSearch = useDebounce(searchValue, 500);

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
  const filesByCategory = categories.map((cat) => ({
    ...cat,
    files: mainFiles
      .filter((f) => f.category === cat.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  }));

  // Filter based on the debounced search input
  const filteredCategories = filesByCategory.map((cat) => {
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

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleFileClick = (fileId: string) => {
    loadFile(fileId);
    if (isMobile) onClose();
  };

  const SidebarContent = () => (
    <VStack
      align="stretch"
      spacing={6}
      p={4}
      overflowY="auto"
      role="navigation"
      aria-label="Main topic navigation"
      h="full"
    >
      <Heading size="md" mb={1}>
        Main Topics
      </Heading>

      {/* Search Box */}
      <Box mb={3}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search topics..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="outline"
            size="sm"
            aria-label="Search topics"
          />
        </InputGroup>
      </Box>

      {/* Categories & Files */}
      <VStack align="stretch" spacing={2}>
        {filteredCategories.map((cat) => {
          // Skip if no files after filtering
          if (!cat.files.length) return null;

          const isExpanded = expandedCategories[cat.id] || false;
          const isCatCurrent = currentFile?.category === cat.id;

          return (
            <Box key={cat.id}>
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
                      ? "gray.700"
                      : "gray.100"
                    : "transparent"
                }
                _hover={{
                  bg: colorMode === "dark" ? "gray.700" : "gray.100",
                }}
              >
                <Text>
                  {cat.name}
                  {isCatCurrent ? " (Current)" : ""}
                </Text>
                {isExpanded ? (
                  <Icon as={ChevronDownIcon} boxSize={5} />
                ) : (
                  <Icon as={ChevronRightIcon} boxSize={5} />
                )}
              </Flex>
              <Collapse in={isExpanded} animateOpacity>
                <List spacing={1} mt={1} ml={4}>
                  {cat.files.map((file) => (
                    <ListItem key={file.id}>
                      <Flex
                        p={2}
                        borderRadius="md"
                        cursor="pointer"
                        align="center"
                        bg={
                          currentFile?.id === file.id
                            ? colorMode === "dark"
                              ? "blue.800"
                              : "blue.50"
                            : "transparent"
                        }
                        color={
                          currentFile?.id === file.id
                            ? colorMode === "dark"
                              ? "blue.200"
                              : "blue.700"
                            : "inherit"
                        }
                        fontWeight={
                          currentFile?.id === file.id ? "medium" : "normal"
                        }
                        _hover={{
                          bg:
                            currentFile?.id === file.id
                              ? colorMode === "dark"
                                ? "blue.800"
                                : "blue.50"
                              : colorMode === "dark"
                              ? "gray.700"
                              : "gray.100",
                        }}
                        onClick={() => handleFileClick(file.id)}
                      >
                        {currentFile?.id === file.id && (
                          <ChevronRightIcon mr={2} boxSize={4} />
                        )}
                        <Text ml={currentFile?.id === file.id ? 0 : 6}>
                          {file.title}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </VStack>
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

  // Desktop
  return <SidebarContent />;
};

export default Sidebar;
