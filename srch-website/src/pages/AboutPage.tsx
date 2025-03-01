import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Divider,
  List,
  ListItem,
  ListIcon,
  useColorMode,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import MainLayout from "@/layouts/MainLayout";

const AboutPage: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <MainLayout>
      <VStack align="stretch" spacing={6}>
        <Heading as="h1" size="xl">
          About This Application
        </Heading>

        <Text fontSize="lg">
          This knowledge base application is designed to provide an elegant and
          user-friendly way to browse markdown documentation with interactive
          features.
        </Text>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Features
          </Heading>

          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="medium">
                Interactive Navigation
              </Text>
              : Easy sidebar navigation between main topics
            </ListItem>

            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="medium">
                Drawer System
              </Text>
              : Open auxiliary content in side drawers without losing your place
            </ListItem>

            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="medium">
                Custom Theme Settings
              </Text>
              : Personalize your experience with custom colors, font sizes, and
              layout options
            </ListItem>

            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="medium">
                Markdown Support
              </Text>
              : Full support for rich markdown content with syntax highlighting
            </ListItem>

            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <Text as="span" fontWeight="medium">
                Dark &amp; Light Modes
              </Text>
              : Comfortable reading in any lighting environment
            </ListItem>
          </List>
        </Box>

        <Divider />

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Technical Details
          </Heading>

          <Card variant="outline" mb={4}>
            <CardBody>
              <VStack align="stretch" spacing={2}>
                <Text>
                  <strong>Frontend Framework:</strong> React with TypeScript
                </Text>
                <Text>
                  <strong>Build Tool:</strong> Vite
                </Text>
                <Text>
                  <strong>UI Library:</strong> Chakra UI
                </Text>
                <Text>
                  <strong>Markdown:</strong> react-markdown with remark and
                  rehype plugins
                </Text>
                <Text>
                  <strong>Routing:</strong> React Router
                </Text>
                <Text>
                  <strong>State Management:</strong> React Context API
                </Text>
              </VStack>
            </CardBody>
          </Card>

          <Text
            fontSize="sm"
            color={colorMode === "dark" ? "gray.400" : "gray.600"}
          >
            This application is designed to load markdown files from your
            project's
            <code>src/markdown</code> directory. Custom markdown syntax allows
            for interactive elements like navigation links and drawer buttons.
          </Text>
        </Box>
      </VStack>
    </MainLayout>
  );
};

export default AboutPage;
