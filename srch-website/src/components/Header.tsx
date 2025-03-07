import React from "react";
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  Heading,
  HStack,
  Button,
  useBreakpointValue,
  Icon,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  HamburgerIcon,
  MoonIcon,
  SunIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { FaBookOpen } from "react-icons/fa";

interface HeaderProps {
  toggleSidebar: () => void; // Mobile-only drawer toggle
  toggleDesktopSidebarCollapse: () => void; // Desktop expand/collapse
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({
  toggleSidebar,
  toggleDesktopSidebarCollapse,
  isSidebarCollapsed,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      borderBottomWidth="1px"
      borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      h="60px"
      role="banner"
      transition="box-shadow 0.2s"
      boxShadow="sm"
    >
      <Flex w="100%" h="100%" px={4} align="center" justify="space-between">
        <HStack spacing={3}>
          {isMobile ? (
            // Mobile hamburger opens the sidebar drawer
            <Tooltip label="Open sidebar" placement="bottom" openDelay={500}>
              <IconButton
                aria-label="Open sidebar navigation"
                icon={<HamburgerIcon />}
                variant="ghost"
                onClick={toggleSidebar}
                size="md"
                borderRadius="md"
              />
            </Tooltip>
          ) : (
            // Desktop button toggles collapse
            <Tooltip
              label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              placement="bottom"
              openDelay={500}
            >
              <IconButton
                aria-label={
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
                icon={
                  isSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />
                }
                variant="ghost"
                onClick={toggleDesktopSidebarCollapse}
                size="md"
                borderRadius="md"
              />
            </Tooltip>
          )}

          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <HStack 
              spacing={2} 
              p={2} 
              _hover={{ 
                bg: colorMode === "dark" ? "gray.700" : "gray.100",
                borderRadius: "md",
              }}
              transition="all 0.2s"
            >
              <Icon 
                as={FaBookOpen} 
                color={colorMode === "dark" ? "blue.300" : "blue.500"} 
                boxSize={6}
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.1)" }}
              />
              <Heading
                size="md"
                display={{ base: "none", sm: "block" }}
                fontWeight="bold"
                bgGradient={
                  colorMode === "dark"
                    ? "linear(to-r, blue.400, teal.300)"
                    : "linear(to-r, blue.600, teal.500)"
                }
                bgClip="text"
              >
                SRC Handbook
              </Heading>
            </HStack>
          </Link>
        </HStack>

        <HStack spacing={2}>
          <Tooltip 
            label={`Switch to ${colorMode === "dark" ? "light" : "dark"} mode`} 
            placement="bottom" 
            openDelay={500}
          >
            <IconButton
              aria-label={`Switch to ${
                colorMode === "dark" ? "light" : "dark"
              } mode`}
              icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              borderRadius="full"
              size="md"
            />
          </Tooltip>

          <Link to="/settings">
            <Tooltip label="Settings" placement="bottom" openDelay={500}>
              <Button
                aria-label="Settings"
                leftIcon={<SettingsIcon />}
                variant="ghost"
                size="sm"
                borderRadius="md"
                fontWeight="medium"
              >
                Settings
              </Button>
            </Tooltip>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
