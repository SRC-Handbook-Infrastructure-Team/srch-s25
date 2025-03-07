import React from "react";
import {
  Box,
  Heading,
  Flex,
  Spinner,
  Center,
  Text,
  VStack,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import { FaBookOpen, FaExclamationTriangle, FaSync } from "react-icons/fa";
import MainLayout from "@/layouts/MainLayout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useMarkdown } from "@/context/MarkdownContext";

const HomePage: React.FC = () => {
  const { currentFile, isLoading, error, refreshFiles } = useMarkdown();

  // Welcome page if no file is selected
  const WelcomePage = () => (
    <VStack spacing={6} py={8} textAlign="center">
      <Icon as={FaBookOpen} boxSize={12} color="blue.500" />
      <Heading as="h1" size="2xl">
        Welcome to the Knowledge Base
      </Heading>
      <Text fontSize="xl" maxW="600px">
        Please select a topic from the sidebar to get started.
      </Text>
    </VStack>
  );

  // Error page if there's an error
  const ErrorPage = () => (
    <VStack spacing={6} py={8} textAlign="center">
      <Icon as={FaExclamationTriangle} boxSize={12} color="red.500" />
      <Heading as="h1" size="xl">
        Error Loading Content
      </Heading>
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
      </Alert>
      <Button 
        leftIcon={<FaSync />} 
        colorScheme="blue" 
        onClick={() => refreshFiles()}
      >
        Refresh Content
      </Button>
    </VStack>
  );

  return (
    <MainLayout>
      {isLoading ? (
        <Center minH="200px">
          <Spinner thickness="4px" speed="0.65s" size="xl" color="blue.500" />
        </Center>
      ) : error ? (
        <ErrorPage />
      ) : currentFile ? (
        <Box>
          <MarkdownRenderer content={currentFile.content} />
        </Box>
      ) : (
        <WelcomePage />
      )}
    </MainLayout>
  );
};

export default HomePage;
