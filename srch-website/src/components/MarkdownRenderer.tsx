import React, { useMemo } from "react";
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
} from "@chakra-ui/react";
import { useMarkdown } from "@/context/MarkdownContext";
import { ExternalLinkIcon } from "@chakra-ui/icons";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const { colorMode } = useColorMode();
  const { loadFile, openDrawer, getDrawerFileById } = useMarkdown();

  // Replace custom link syntax with <button> placeholders
  const findAndReplaceButtons = (text: string): string => {
    // [sidebar:Button Text](file-id)
    const sidebarRegex = /\[sidebar:(.*?)\]\((.*?)\)/g;
    let newText = text.replace(sidebarRegex, (_, btnLabel, fileId) => {
      return `<button type="sidebar" data-id="${fileId}">${btnLabel}</button>`;
    });

    // [nav:Button Text](file-id)
    const navRegex = /\[nav:(.*?)\]\((.*?)\)/g;
    newText = newText.replace(navRegex, (_, btnLabel, fileId) => {
      return `<button type="nav" data-id="${fileId}">${btnLabel}</button>`;
    });

    return newText;
  };

  // Process the content for custom syntax
  const processedContent = useMemo(() => {
    return findAndReplaceButtons(content);
  }, [content]);

  // Chakra-friendly overrides for markdown components
  const components = {
    p: (props: any) => <Text mb={4} lineHeight="tall" {...props} />,
    em: (props: any) => <Text as="em" {...props} />,
    blockquote: (props: any) => (
      <Box
        borderLeftWidth="4px"
        borderLeftColor={colorMode === "dark" ? "gray.600" : "gray.200"}
        pl={4}
        py={2}
        my={4}
        bg={colorMode === "dark" ? "gray.700" : "gray.50"}
        borderRadius="md"
        {...props}
      />
    ),
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match && match[1] ? match[1] : "";

      return !inline ? (
        <Box my={4} borderRadius="md" overflow="hidden">
          <SyntaxHighlighter
            language={language}
            style={colorMode === "dark" ? vscDarkPlus : prism}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </Box>
      ) : (
        <Code
          colorScheme={colorMode === "dark" ? "gray" : "blue"}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="0.875em"
          {...props}
        >
          {children}
        </Code>
      );
    },
    del: (props: any) => <Text as="del" {...props} />,
    hr: (props: any) => <Divider my={6} {...props} />,
    a: (props: any) => {
      const { href, children } = props;
      if (!href) return <>{children}</>;

      // External link
      if (href.startsWith("http")) {
        return (
          <Link color="blue.500" href={href} isExternal>
            {children} <ExternalLinkIcon mx="2px" />
          </Link>
        );
      }
      // Internal or other link
      return (
        <Link color="blue.500" href={href}>
          {children}
        </Link>
      );
    },
    img: (props: any) => (
      <Image
        my={4}
        borderRadius="md"
        maxW="100%"
        alt={props.alt || ""}
        {...props}
      />
    ),
    ul: (props: any) => <UnorderedList pl={4} mb={4} spacing={2} {...props} />,
    ol: (props: any) => <OrderedList pl={4} mb={4} spacing={2} {...props} />,
    li: (props: any) => <ListItem {...props} />,
    h1: (props: any) => <Heading as="h1" size="2xl" mt={8} mb={4} {...props} />,
    h2: (props: any) => <Heading as="h2" size="xl" mt={6} mb={3} {...props} />,
    h3: (props: any) => <Heading as="h3" size="lg" mt={5} mb={2} {...props} />,
    h4: (props: any) => <Heading as="h4" size="md" mt={4} mb={2} {...props} />,
    h5: (props: any) => <Heading as="h5" size="sm" mt={3} mb={1} {...props} />,
    h6: (props: any) => <Heading as="h6" size="xs" mt={2} mb={1} {...props} />,

    // Custom "button" elements from the raw HTML after findAndReplaceButtons
    button: (props: any) => {
      const { type, "data-id": fileId, children } = props;

      if (type === "sidebar") {
        // Drawer link
        const drawerFile = getDrawerFileById(fileId);
        return (
          <Button
            colorScheme="blue"
            size="sm"
            height="auto"
            minH="24px"
            px={2}
            py={1}
            mx={1}
            my={0}
            fontSize="sm"
            fontWeight="normal"
            lineHeight="normal"
            onClick={() => {
              if (drawerFile) {
                openDrawer(drawerFile.content);
              } else {
                console.error(`Drawer content for ${fileId} not found`);
              }
            }}
          >
            {children}
          </Button>
        );
      }

      if (type === "nav") {
        // Navigation to another main file
        return (
          <Button
            colorScheme="teal"
            size="sm"
            mx={1}
            onClick={() => loadFile(fileId)}
          >
            {children}
          </Button>
        );
      }

      // Fallback
      return <Button>{children}</Button>;
    },

    table: (props: any) => (
      <TableContainer mb={4} mt={4}>
        <Table variant="simple" size="sm" {...props} />
      </TableContainer>
    ),
    thead: (props: any) => <Thead {...props} />,
    tbody: (props: any) => <Tbody {...props} />,
    tr: (props: any) => <Tr {...props} />,
    td: (props: any) => <Td {...props} />,
    th: (props: any) => <Th {...props} />,
  };

  return (
    <Box>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components as any}
      >
        {processedContent}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownRenderer;
