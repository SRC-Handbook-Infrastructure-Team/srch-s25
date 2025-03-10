import React, { useMemo, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Text,
  Link,
  ListItem,
  UnorderedList,
  OrderedList,
  Heading,
  Image,
  Code,
  Divider,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  useColorMode,
  Alert,
  AlertIcon,
  AlertTitle,
  useToast,
  ButtonGroup,
  IconButton,
  Tooltip,
  Kbd,
} from "@chakra-ui/react";
import { useMarkdown } from "@/context/MarkdownContext";
import { ExternalLinkIcon, InfoIcon } from "@chakra-ui/icons";

/**
 * Props interface for the MarkdownRenderer component.
 */
interface MarkdownRendererProps {
  content: string; // Raw markdown content to be rendered
}

/**
 * MarkdownRenderer Component
 * 
 * A sophisticated markdown renderer that:
 * 1. Renders standard markdown content with Chakra UI components
 * 2. Supports custom interactive button syntax for navigation and drawer content
 * 3. Provides error handling and user feedback through toasts
 * 4. Applies consistent styling with theme awareness
 * 
 * Custom button syntax supported:
 * - [sidebar:Button Text](file-id) - Opens a supplementary content in the drawer
 * - [nav:Button Text](file-id) - Navigates to another main markdown file
 * 
 * @param content - Raw markdown content to be rendered
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { colorMode } = useColorMode();
  const { loadFile, openDrawer, getDrawerFileById } = useMarkdown();
  const toast = useToast();
  const [renderError, setRenderError] = useState<string | null>(null);

  /**
   * Processes markdown content to find and replace custom button syntax.
   * Converts markdown-like syntax into HTML button elements that will be 
   * handled by rehypeRaw and our custom component overrides.
   * 
   * @param text - The raw markdown text to process
   * @returns Processed text with custom button syntax replaced with HTML
   */
  const findAndReplaceButtons = useCallback((text: string): string => {
    if (!text) return "";
    
    try {
      // Process sidebar buttons: [sidebar:Button Text](file-id)
      const sidebarRegex = /\[sidebar:(.*?)\]\(([\w-]+)\)/g;
      let newText = text.replace(sidebarRegex, (match, btnLabel, fileId) => {
        if (!btnLabel.trim() || !fileId.trim()) {
          console.warn(`Invalid sidebar button format: ${match}`);
          return match; // Keep original if invalid
        }
        return `<button type="sidebar" data-id="${fileId.trim()}">${btnLabel.trim()}</button>`;
      });

      // Process navigation buttons: [nav:Button Text](file-id)
      const navRegex = /\[nav:(.*?)\]\(([\w-]+)\)/g;
      newText = newText.replace(navRegex, (match, btnLabel, fileId) => {
        if (!btnLabel.trim() || !fileId.trim()) {
          console.warn(`Invalid navigation button format: ${match}`);
          return match; // Keep original if invalid
        }
        return `<button type="nav" data-id="${fileId.trim()}">${btnLabel.trim()}</button>`;
      });

      return newText;
    } catch (error) {
      console.error("Error processing custom buttons:", error);
      setRenderError("Failed to process custom button syntax.");
      return text; // Return original text on error
    }
  }, []);

  /**
   * Memoized processed content that includes all transformations.
   * Avoids redundant processing when content hasn't changed.
   */
  const processedContent = useMemo(() => {
    setRenderError(null); // Reset any previous errors
    if (!content) return "";
    try {
      return findAndReplaceButtons(content);
    } catch (error) {
      console.error("Error in content processing:", error);
      setRenderError("Failed to process markdown content.");
      return content; // Return original content on error
    }
  }, [content, findAndReplaceButtons]);

  /**
   * Handles clicks on custom buttons in the markdown content.
   * Provides error handling and user feedback for failures.
   * 
   * @param type - Button type ('sidebar' or 'nav')
   * @param fileId - ID of the target file to load or display
   * @param children - React nodes within the button (for error messages)
   */
  const handleButtonClick = useCallback((type: string, fileId: string, children: React.ReactNode) => {
    try {
      if (type === "sidebar") {
        // Handle sidebar button - open a drawer with supplementary content
        const drawerFile = getDrawerFileById(fileId);
        if (drawerFile) {
          openDrawer(drawerFile.content);
        } else {
          console.error(`Drawer content for ${fileId} not found`);
          toast({
            title: "Content not found",
            description: `The sidebar content for "${fileId}" could not be found.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else if (type === "nav") {
        // Handle navigation button - load a different main file
        loadFile(fileId).catch(error => {
          console.error(`Error loading file ${fileId}:`, error);
          toast({
            title: "Navigation failed",
            description: `Failed to navigate to "${fileId}".`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
      }
    } catch (error) {
      console.error("Error handling button click:", error);
      toast({
        title: "Action failed",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [getDrawerFileById, openDrawer, loadFile, toast]);

  /**
   * Custom component overrides for the ReactMarkdown renderer.
   * Maps standard markdown elements to Chakra UI components with
   * proper styling and theme awareness.
   */
  const components = useMemo(() => ({
    // Paragraph element with consistent spacing and line height
    p: (props: any) => <Text mb={4} lineHeight="tall" {...props} />,
    
    // Emphasized text with themed color
    em: (props: any) => <Text as="em" color={colorMode === "dark" ? "blue.200" : "blue.600"} {...props} />,
    
    // Bold text
    strong: (props: any) => <Text as="strong" fontWeight="bold" {...props} />,
    
    // Block quotes with themed styling
    blockquote: (props: any) => (
      <Box
        borderLeftWidth="4px"
        borderLeftColor={colorMode === "dark" ? "blue.400" : "blue.500"}
        pl={4}
        py={2}
        my={4}
        bg={colorMode === "dark" ? "blue.900" : "blue.50"}
        borderRadius="md"
        fontSize="md"
        fontStyle="italic"
        {...props}
      />
    ),
    
    // Code blocks and inline code with syntax highlighting
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "";

      // Code block (multi-line)
      return !inline ? (
        <Box my={4} borderRadius="md" overflow="hidden" shadow="md">
          <SyntaxHighlighter
            language={language}
            style={colorMode === "dark" ? vscDarkPlus : prism}
            PreTag="div"
            customStyle={{
              borderRadius: "0.375rem",
              fontSize: "0.9em",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </Box>
      ) : (
        // Inline code
        <Kbd
          px={2}
          py={1}
          borderRadius="md"
          fontSize="0.875em"
          fontFamily="mono"
          fontWeight="medium"
          bg={colorMode === "dark" ? "gray.700" : "gray.100"}
          color={colorMode === "dark" ? "gray.200" : "gray.800"}
          borderColor={colorMode === "dark" ? "gray.600" : "gray.300"}
          {...props}
        >
          {children}
        </Kbd>
      );
    },
    
    // Strikethrough text
    del: (props: any) => <Text as="del" textDecoration="line-through" opacity={0.6} {...props} />,
    
    // Horizontal rule with themed color
    hr: (props: any) => <Divider my={6} borderColor={colorMode === "dark" ? "gray.600" : "gray.300"} {...props} />,
    
    // Links with different styling for external vs internal
    a: (props: any) => {
      const { href, children } = props;
      if (!href) return <>{children}</>;

      // External link with indicator icon
      if (href.startsWith("http")) {
        return (
          <Link
            color={colorMode === "dark" ? "blue.300" : "blue.600"}
            href={href}
            isExternal
            _hover={{
              textDecoration: "none",
              color: colorMode === "dark" ? "blue.200" : "blue.700",
              borderBottom: "1px dotted",
              borderColor: colorMode === "dark" ? "blue.300" : "blue.600",
            }}
          >
            {children} <ExternalLinkIcon mx="2px" />
          </Link>
        );
      }
      // Internal link
      return (
        <Link
          color={colorMode === "dark" ? "blue.300" : "blue.600"}
          href={href}
          _hover={{
            textDecoration: "none",
            color: colorMode === "dark" ? "blue.200" : "blue.700",
          }}
        >
          {children}
        </Link>
      );
    },
    
    // Images with lazy loading and fallback
    img: (props: any) => (
      <Image
        my={4}
        borderRadius="md"
        maxW="100%"
        alt={props.alt || ""}
        loading="lazy" // Lazy loading for better performance
        fallbackSrc="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Tiny placeholder
        transition="opacity 0.2s"
        shadow="md"
        {...props}
      />
    ),
    
    // Lists with proper spacing
    ul: (props: any) => <UnorderedList pl={4} mb={4} spacing={2} {...props} />,
    ol: (props: any) => <OrderedList pl={4} mb={4} spacing={2} {...props} />,
    li: (props: any) => <ListItem lineHeight="tall" mb={1} {...props} />,
    
    // Headings with consistent hierarchy styling
    h1: (props: any) => <Heading as="h1" size="2xl" mt={8} mb={4} fontWeight="bold" {...props} />,
    h2: (props: any) => (
      <Heading
        as="h2"
        size="xl"
        mt={6}
        mb={3}
        fontWeight="semibold"
        pb={2}
        borderBottomWidth="1px"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        {...props}
      />
    ),
    h3: (props: any) => <Heading as="h3" size="lg" mt={5} mb={2} fontWeight="medium" {...props} />,
    h4: (props: any) => (
      <Heading
        as="h4"
        size="md"
        mt={4}
        mb={2}
        fontWeight="medium"
        color={colorMode === "dark" ? "blue.300" : "blue.700"}
        {...props}
      />
    ),
    h5: (props: any) => <Heading as="h5" size="sm" mt={3} mb={1} fontWeight="medium" {...props} />,
    h6: (props: any) => <Heading as="h6" size="xs" mt={2} mb={1} fontWeight="medium" {...props} />,

    // Custom button component handler for our special syntax
    button: (props: any) => {
      const { type, "data-id": fileId, children } = props;

      // Safety check for invalid buttons
      if (!type || !fileId) {
        return <Button isDisabled>{children || "Invalid Button"}</Button>;
      }

      // Sidebar button - opens content in drawer
      if (type === "sidebar") {
        return (
          <Tooltip label={`Open details about ${children} in sidebar`} hasArrow placement="top">
            <Button
              colorScheme="blue"
              size="sm"
              height="auto"
              minH="28px"
              px={3}
              py={1}
              mx={1}
              my={1}
              fontSize="sm"
              fontWeight="medium"
              borderRadius="full"
              lineHeight="normal"
              rightIcon={<InfoIcon fontSize="xs" />}
              _hover={{ 
                transform: "translateY(-1px)",
                boxShadow: "sm"
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={() => handleButtonClick("sidebar", fileId, children)}
              aria-label={`Open ${children} in sidebar`}
            >
              {children}
            </Button>
          </Tooltip>
        );
      }

      // Navigation button - loads a different main file
      if (type === "nav") {
        return (
          <Tooltip label={`Navigate to ${children}`} hasArrow placement="top">
            <Button
              colorScheme="teal"
              size="sm"
              mx={1}
              borderRadius="md"
              _hover={{ 
                transform: "translateY(-1px)",
                boxShadow: "sm"
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={() => handleButtonClick("nav", fileId, children)}
              aria-label={`Navigate to ${children}`}
            >
              {children}
            </Button>
          </Tooltip>
        );
      }

      // Fallback for unknown button types
      return <Button>{children}</Button>;
    },

    // Table elements with consistent styling
    table: (props: any) => (
      <TableContainer mb={4} mt={4} overflowX="auto" borderRadius="md" borderWidth="1px" borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}>
        <Table variant="simple" size="sm" {...props} />
      </TableContainer>
    ),
    thead: (props: any) => <Thead bg={colorMode === "dark" ? "gray.700" : "gray.50"} {...props} />,
    tbody: (props: any) => <Tbody {...props} />,
    tr: (props: any) => <Tr _odd={{bg: colorMode === "dark" ? "gray.800" : "gray.50"}} {...props} />,
    td: (props: any) => <Td py={2} px={4} borderColor={colorMode === "dark" ? "gray.700" : "gray.200"} fontSize="sm" {...props} />,
    th: (props: any) => <Th py={2} px={4} fontWeight="medium" fontSize="sm" {...props} />,
  }), [colorMode, handleButtonClick]);

  // Show error alert if markdown processing failed
  if (renderError) {
    return (
      <Alert status="error" variant="left-accent" my={4}>
        <AlertIcon />
        <AlertTitle>{renderError}</AlertTitle>
      </Alert>
    );
  }

  // Render processed markdown content with our custom components
  return (
    <Box className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown
        rehypePlugins={[rehypeRaw]} // Enables raw HTML in markdown
        components={components as any}
        skipHtml={false} // Allow HTML in markdown
      >
        {processedContent}
      </ReactMarkdown>
    </Box>
  );
};

// Memoize the entire component for better performance
export default React.memo(MarkdownRenderer);
