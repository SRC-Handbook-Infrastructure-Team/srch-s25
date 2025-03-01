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
} from "@chakra-ui/react";
import { FaBookOpen } from "react-icons/fa";
import MainLayout from "@/layouts/MainLayout";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useMarkdown } from "@/context/MarkdownContext";

const HomePage: React.FC = () => {
  const { currentFile, isLoading } = useMarkdown();

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

  return (
    <MainLayout>
      {isLoading ? (
        <Center minH="200px">
          <Spinner thickness="4px" speed="0.65s" size="xl" color="blue.500" />
        </Center>
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
