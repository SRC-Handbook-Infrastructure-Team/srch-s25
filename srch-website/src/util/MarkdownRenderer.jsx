/**
 * SRC Handbook Markdown System
 *
 * This file handles rendering markdown content with special features:
 * - Loading content from hierarchical section/subsection structure in /markdown/
 * - Loading drawer content from drawer folders in each subsection
 * - Rendering special [drawer:text](target) and [nav:text](target) links as buttons
 * - Supporting image references using ![Alt text](/src/assets/imagename.jpg)
 * - Parsing YAML frontmatter for title and order
 * - Generating sidebar navigation from markdown files and headers
 *
 */

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Text,
  Heading,
  Link,
  UnorderedList,
  OrderedList,
  ListItem,
  Box,
  Code,
  Button,
  Image,
} from "@chakra-ui/react";

// Helper function to create consistent ID from heading text
function createIdFromHeading(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

// Helper to parse YAML frontmatter from markdown content
function parseFrontmatter(content) {
  // Checks for --- CONTENT --- at the beginning of MD files, cross compatible w/ Windows chars
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;  
  const match = content.match(frontmatterRegex);

  if (!match) {
    return {
      content,
      frontmatter: {},
    };
  }

  const frontmatterBlock = match[1];
  const cleanContent = content.replace(frontmatterRegex, "");
  const frontmatter = {};

  // Parse the YAML lines
  frontmatterBlock.split("\n").forEach((line) => {
    if (line.trim() === "") return;

    const [key, ...valueParts] = line.split(":");
    const value = valueParts.join(":").trim();

    // Convert to appropriate type
    if (value === "true") frontmatter[key.trim()] = true;
    else if (value === "false") frontmatter[key.trim()] = false;
    else if (!isNaN(Number(value))) frontmatter[key.trim()] = Number(value);
    else frontmatter[key.trim()] = value;
  });

  return {
    content: cleanContent,
    frontmatter,
  };
}

// Import all markdown files at build time
const allMarkdownFiles = import.meta.glob("../markdown/**/*.md", {
  query: "?raw",
  import: "default",
});

// Get all sections (top-level folders)
export const getSections = async () => {
  try {
    const sections = [];
    const paths = Object.keys(allMarkdownFiles);
    const processedSections = new Set();
    // Find all top-level sections with their markdown files
    for (const path of paths) {
      const segments = path.split("/");

      // Skip the primers directory
      if (segments[2] === "primers") continue;

      // Only process files directly in a section folder (not in subfolders)
      if (segments.length === 4 && segments[3].endsWith(".md")) {
        const sectionId = segments[2];
        const fileName = segments[3];

        // Only include the main section file (same name as folder)
        if (
          fileName === `${sectionId}.md` &&
          !processedSections.has(sectionId)
        ) {
          processedSections.add(sectionId);

          const content = await allMarkdownFiles[path]();
          const { content: cleanContent, frontmatter } =
            parseFrontmatter(content);

          sections.push({
            id: sectionId,
            title:
              frontmatter.title ||
              cleanContent.split("\n")[0].replace("# ", ""),
            order: frontmatter.order || 999,
            content: cleanContent,
          });
        }
      }
    }

    // Sort by order
    return sections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Error loading sections:", error);
    return [];
  }
};

// Get all subsections for a specific section
export const getSubsections = async (sectionId) => {
  try {
    const subsections = [];
    const paths = Object.keys(allMarkdownFiles);
    const processedSubsections = new Set();

    // Find all subsection markdown files for this section
    for (const path of paths) {
      const segments = path.split("/");

      // Look for files in subfolders of the specified section
      if (
        segments.length === 5 &&
        segments[2] === sectionId &&
        segments[3] !== "drawer" &&
        segments[4].endsWith(".md")
      ) {
        const subsectionId = segments[3];
        const fileName = segments[4];

        // Only include files with the same name as their parent folder
        if (
          fileName === `${subsectionId}.md` &&
          !processedSubsections.has(subsectionId)
        ) {
          processedSubsections.add(subsectionId);

          const content = await allMarkdownFiles[path]();
          const { content: cleanContent, frontmatter } =
            parseFrontmatter(content);

          subsections.push({
            id: subsectionId,
            title:
              frontmatter.title ||
              cleanContent.split("\n")[0].replace("# ", ""),
            order: frontmatter.order || 999,
            content: cleanContent,
          });
        }
      }
    }

    // Sort by order
    return subsections.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(`Error loading subsections for ${sectionId}:`, error);
    return [];
  }
};

// Get specific content by section and subsection
export const getContent = async (sectionId, subsectionId) => {
  try {
    // If only section is provided, get section content
    if (sectionId && !subsectionId) {
      const path = `../markdown/${sectionId}/${sectionId}.md`;

      for (const filePath in allMarkdownFiles) {
        if (filePath.endsWith(path.slice(2))) {
          // Remove the leading ..
          const content = await allMarkdownFiles[filePath]();
          const { content: cleanContent } = parseFrontmatter(content);
          return cleanContent;
        }
      }
    }

    // If both section and subsection are provided, get subsection content
    if (sectionId && subsectionId) {
      const path = `../markdown/${sectionId}/${subsectionId}/${subsectionId}.md`;

      for (const filePath in allMarkdownFiles) {
        if (filePath.endsWith(path.slice(2))) {
          // Remove the leading ..
          const content = await allMarkdownFiles[filePath]();
          const { content: cleanContent } = parseFrontmatter(content);
          return cleanContent;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(
      `Failed to load content: ${sectionId}/${subsectionId}`,
      error
    );
    return null;
  }
};

// Get a specific drawer markdown file
export const getDrawerFile = async (sectionId, subsectionId, fileId) => {
  try {
    // Find the matching drawer file
    const drawerPath = `../markdown/${sectionId}/${subsectionId}/drawer/${fileId}.md`;

    for (const path in allMarkdownFiles) {
      if (path.endsWith(drawerPath.slice(2))) {
        // Remove the leading ..
        const content = await allMarkdownFiles[path]();
        const { content: cleanContent } = parseFrontmatter(content);
        return cleanContent;
      }
    }

    return null;
  } catch (error) {
    console.error(
      `Failed to load drawer file: ${sectionId}/${subsectionId}/drawer/${fileId}`,
      error
    );
    return null;
  }
};

// Parse subsections (h2 headings) from markdown content
export const parseSubsections = (content) => {
  if (!content) return [];

  // Get rid of Windows return character (\r)
  const normalizedContent = content.replace(/\r/g, "");
  const lines = normalizedContent.split("\n");
  const subsections = [];

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const title = line.replace("## ", "");
      subsections.push({
        title,
        id: createIdFromHeading(title),
      });
    }
  }

  console.log(JSON.stringify(content));
  console.log("SUBSECTIONS", subsections);

  return subsections;
};

// Process markdown content and render it
function MarkdownRenderer({ content, onDrawerOpen, onNavigation }) {
  // Process special links in the content
  const processedContent = useMemo(() => {
    if (!content) return "";

    // Replace drawer links with custom elements
    let processed = content.replace(
      /\[drawer:([^\]]+)\]\(([^)]+)\)/g,
      (match, text, target) => {
        return `<drawer-link text="${text}" target="${target}"></drawer-link>`;
      }
    );

    // Replace navigation links with custom elements
    processed = processed.replace(
      /\[nav:([^\]]+)\]\(([^)]+)\)/g,
      (match, text, target) => {
        return `<nav-link text="${text}" target="${target}"></nav-link>`;
      }
    );

    return processed;
  }, [content]);

  // Define component rendering for Markdown elements
  const components = useMemo(
    () => ({
      // Headings
      h1: (props) => <Heading as="h1" size="xl" mt={5} mb={3} {...props} />,
      h2: (props) => {
        // Create an ID from the heading for anchor links - use the same ID generation
        // as in parseSubsections to ensure they match exactly
        const id = createIdFromHeading(props.children);
        return (
          <Heading
            as="h2"
            id={id}
            size="lg"
            mt={4}
            mb={2}
            scrollMarginTop="20px" // Adds margin at top when scrolled to
            {...props}
          />
        );
      },
      h3: (props) => <Heading as="h3" size="md" mt={3} mb={2} {...props} />,
      h4: (props) => <Heading as="h4" size="sm" mt={2} mb={1} {...props} />,

      // Text elements
      p: (props) => <Text mb={3} {...props} />,
      a: (props) => <Link color="blue.500" {...props} />,

      // Lists
      ul: (props) => <UnorderedList pl={4} mb={3} {...props} />,
      ol: (props) => <OrderedList pl={4} mb={3} {...props} />,
      li: (props) => <ListItem {...props} />,

      // Code
      code: ({ inline, ...props }) =>
        inline ? (
          <Code {...props} />
        ) : (
          <Box
            as="pre"
            p={2}
            bg="gray.100"
            borderRadius="md"
            overflowX="auto"
            {...props}
          />
        ),

      // Images
      // img: (props) => {
      //   const src = props.src.startsWith("/src/assets/")
      //     ? props.src
      //     : `/src/assets/${props.src}`;
      //   return <Image src={src} alt={props.alt || ""} my={4} maxW="100%" />;
      // },

      // Custom components for interactive elements
      "drawer-link": ({ node }) => {
        const text = node.properties?.text;
        const target = node.properties?.target;
        return (
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => onDrawerOpen && onDrawerOpen(target)}
            mx={1}
          >
            {text}
          </Button>
        );
      },
      "nav-link": ({ node }) => {
        const text = node.properties?.text;
        const target = node.properties?.target;
        return (
          <Button
            colorScheme="teal"
            size="sm"
            onClick={() => onNavigation && onNavigation(target)}
            mx={1}
          >
            {text}
          </Button>
        );
      },
    }),
    [onDrawerOpen, onNavigation]
  );

  // Return ReactMarkdown component as specified.
  // rehypeRaw helps handle HTML parsing
  return (
    <div>
      <ReactMarkdown components={components} rehypePlugins={[rehypeRaw]}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
