/**
 * SRC Handbook Markdown System
 * 
 * This file handles rendering markdown content with special features:
 * - Loading main content files from /markdown/main_files/
 * - Loading drawer content files from /markdown/drawer_files/
 * - Rendering special [drawer:text](target) and [nav:text](target) links as buttons
 * - Generating sidebar navigation from markdown files and headers
 * 
 * For a complete guide on how to format markdown content for this system,
 * see the MarkdownStylingGuide.md file in the /src/markdown/ directory.
 */

import { useMemo, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import {
    Text,
    Heading,
    Link,
    UnorderedList,
    OrderedList,
    ListItem,
    Box,
    Code,
    Button
} from '@chakra-ui/react'

// Helper function to create consistent ID from heading text
function createIdFromHeading(text) {
    if (!text) return '';
    return text.toString()
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
}

// Get the list of main markdown files
export const getMainFiles = async () => {
    try {
        // Dynamically import all .md files from main_files directory
        const mainFiles = import.meta.glob('../markdown/main_files/*.md', { as: 'raw' });
        
        const files = [];
        for (const path in mainFiles) {
            const content = await mainFiles[path]();
            const fileName = path.split('/').pop().replace('.md', '');
            const title = content.split('\n')[0].replace('# ', '');
            
            files.push({
                id: fileName,
                title,
                content
            });
        }
        
        return files;
    } catch (error) {
        console.error('Error loading main files:', error);
        return [];
    }
};

// Get a specific drawer markdown file
export const getDrawerFile = async (fileId) => {
    try {
        const module = await import(`../markdown/drawer_files/${fileId}.md?raw`);
        return module.default;
    } catch (error) {
        console.error(`Failed to load drawer file: ${fileId}`, error);
        return null;
    }
};

// Parse subsections (h2 headings) from markdown content
export const parseSubsections = (content) => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const subsections = [];
    
    for (const line of lines) {
        if (line.startsWith('## ')) {
            const title = line.replace('## ', '');
            subsections.push({
                title,
                id: createIdFromHeading(title)
            });
        }
    }
    
    return subsections;
};

// Process markdown content and render it
function MarkdownRenderer({ content, onDrawerOpen, onNavigation }) {
    // Process special links in the content
    const processedContent = useMemo(() => {
        if (!content) return '';
        
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
    const components = useMemo(() => ({
        // Headings
        h1: (props) => (
            <Heading 
                as="h1" 
                fontFamily="'Lora', serif" 
                fontWeight="bold"  
                fontSize="36px" 
                lineHeight="1.2"
                mt={6} mb={2} 
                {...props} 
            />
        ),
        h2: (props) => {
            // Create an ID from the heading for anchor links - use the same ID generation
            // as in parseSubsections to ensure they match exactly
            const id = createIdFromHeading(props.children);
            return (
                <Heading 
                    as="h2" 
                    fontFamily="'Lora', serif" 
                    fontWeight="normal" 
                    fontSize="20px" 
                    lineHeight="1.4" 
                    mt={5} mb={3} 
                    scrollMarginTop="20px" 
                    {...props} 
                />
            );
        },
        h3: (props) => <Heading as="h3" size="md" mt={3} mb={2} {...props} />,
        h4: (props) => <Heading as="h4" size="sm" mt={2} mb={1} {...props} />,
        
        // Text elements
        p: (props) => (
            <Text 
            fontFamily="'Open Sans', sans-serif" 
            fontWeight="normal" 
            fontSize="16px" 
            lineHeight="1.6" 
            color="gray.700" 
            mb={4} 
            {...props} />
        ),
        a: (props) => <Link color="blue.500" {...props} />,
        
        // Lists
        ul: (props) => <UnorderedList pl={4} mb={3} {...props} />,
        ol: (props) => <OrderedList pl={4} mb={3} {...props} />,
        li: (props) => <ListItem {...props} />,
        
        // Code
        code: ({ inline, ...props }) => (
            inline 
                ? <Code {...props} /> 
                : <Box as="pre" p={2} bg="gray.100" borderRadius="md" overflowX="auto" {...props} />
        ),
        
        // Custom components for interactive elements
        'drawer-link': ({ node }) => {
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
        'nav-link': ({ node }) => {
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
        }
    }), [onDrawerOpen, onNavigation]);

    return (
        <div>
            <ReactMarkdown
                components={components}
                rehypePlugins={[rehypeRaw]}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}

export default MarkdownRenderer