import {useMemo} from 'react'
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
    Divider
} from '@chakra-ui/react'

// TODO: separate "main.MD" files from "drawer.MD" files
function MarkdownRenderer({ content }) {
    // If no content is provided, use empty string
    const markdownContent = content || '';
    
    // Component overrides for markdown elements
    const components = useMemo(() => ({
        h1: (props) => <Heading as="h1" size="xl" mt={6} mb={4} fontWeight="bold" {...props} />,
        h2: (props) => <Heading as="h2" size="lg" mt={5} mb={3} fontWeight="semibold" {...props} />,
        h3: (props) => <Heading as="h3" size="md" mt={4} mb={2} fontWeight="medium" {...props} />,
        h4: (props) => <Heading as="h4" size="sm" mt={3} mb={2} fontWeight="medium" {...props} />,
        p: (props) => <Text mb={4} fontSize="md" lineHeight="1.7" {...props} />,
        a: (props) => <Link color="blue.500" textDecoration="underline" isExternal {...props} />,
        ul: (props) => <UnorderedList pl={4} mb={4} spacing={2} {...props} />,
        ol: (props) => <OrderedList pl={4} mb={4} spacing={2} {...props} />,
        li: (props) => <ListItem fontSize="md" {...props} />,
        blockquote: (props) => (
            <Box 
                borderLeftWidth="4px" 
                borderLeftColor="gray.200" 
                pl={4} 
                py={2} 
                my={4} 
                bg="gray.50"
                {...props} 
            />
        ),
        code: ({ inline, ...props }) => {
            if (inline) {
                return <Code px={2} py={1} borderRadius="md" bg="gray.100" {...props} />;
            }
            return (
                <Box 
                    as="pre" 
                    p={4} 
                    my={4} 
                    borderRadius="md" 
                    bg="gray.100" 
                    overflowX="auto"
                    whiteSpace="pre"
                    fontSize="sm"
                    {...props}
                />
            );
        },
        hr: () => <Divider my={6} borderColor="gray.300" />,
        strong: (props) => <Text as="strong" fontWeight="bold" {...props} />,
        em: (props) => <Text as="em" fontStyle="italic" {...props} />,
        img: (props) => (
            <Box my={4}>
                <img style={{ maxWidth: '100%' }} {...props} alt={props.alt || ''} />
            </Box>
        ),
        table: (props) => (
            <Box overflowX="auto" my={4}>
                <Box as="table" width="full" {...props} />
            </Box>
        ),
        th: (props) => <Box as="th" p={2} borderWidth="1px" fontWeight="bold" {...props} />,
        td: (props) => <Box as="td" p={2} borderWidth="1px" {...props} />
    }))

    return (
        <ReactMarkdown
            components={components}
            rehypePlugins={[rehypeRaw]}
        >
            {markdownContent}
        </ReactMarkdown>
    )
}

export default MarkdownRenderer