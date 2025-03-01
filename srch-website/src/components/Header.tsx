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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  HamburgerIcon,
  MoonIcon,
  SunIcon,
  SettingsIcon,
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
      position="sticky"
      top="0"
      zIndex="dropdown"
      bg={colorMode === "dark" ? "gray.800" : "white"}
      borderBottomWidth="1px"
      borderBottomColor={colorMode === "dark" ? "gray.700" : "gray.200"}
      h="60px"
      role="banner"
    >
      <Flex w="100%" h="100%" px={4} align="center" justify="space-between">
        <HStack spacing={3}>
          {isMobile ? (
            // Mobile hamburger opens the sidebar drawer
            <IconButton
              aria-label="Open sidebar navigation"
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={toggleSidebar}
              size="md"
            />
          ) : (
            // Desktop button toggles collapse
            <IconButton
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={toggleDesktopSidebarCollapse}
              size="md"
            />
          )}

          <Link to="/">
            <HStack spacing={2}>
              <Icon as={FaBookOpen} color="blue.500" boxSize={6} />
              <Heading
                size="md"
                display={{ base: "none", sm: "block" }}
                fontWeight="bold"
              >
                SRC Handbook
              </Heading>
            </HStack>
          </Link>
        </HStack>

        <HStack spacing={2}>
          <IconButton
            aria-label={`Switch to ${
              colorMode === "dark" ? "light" : "dark"
            } mode`}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            borderRadius="full"
          />

          <Link to="/settings">
            <Button
              aria-label="Settings"
              leftIcon={<SettingsIcon />}
              variant="ghost"
              size="sm"
            >
              Settings
            </Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Header;
