import React from "react";
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Text,
  Grid,
  GridItem,
  useColorMode,
  RadioGroup,
  Radio,
  HStack,
  Card,
  CardBody,
  CardHeader,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import MainLayout from "@/layouts/MainLayout";
import { useTheme, FontFamily } from "@/context/ThemeContext";

/**
 * Helper function to extract a numerical value from a CSS pixel string.
 * Handles conversion of values like "280px" to the number 280.
 * 
 * @param val - CSS value string with px unit
 * @returns The number value without units, or 0 if parsing fails
 */
function parsePixelValue(val?: string): number {
  if (!val) return 0;
  return parseInt(val.replace("px", ""), 10) || 0;
}

/**
 * SettingsPage Component
 * 
 * Provides a user interface for customizing application theme and layout settings.
 * Includes controls for:
 * - Color theme selection
 * - Typography settings (font size and font family)
 * - Layout dimensions (sidebar, content, drawer)
 * 
 * Settings are applied in real-time and saved to localStorage via ThemeContext.
 */
const SettingsPage: React.FC = () => {
  const { colorMode } = useColorMode();
  const { themeOptions, updateThemeOptions } = useTheme();

  // Available color options for the primary color setting
  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "teal", label: "Teal" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
    { value: "orange", label: "Orange" },
    { value: "red", label: "Red" },
  ];

  // Available font options with descriptions for accessibility
  const fontOptions: { value: FontFamily; label: string; description: string }[] = [
    { 
      value: "system", 
      label: "System Default", 
      description: "Uses your system's default fonts" 
    },
    { 
      value: "inter", 
      label: "Inter", 
      description: "Modern, clean sans-serif font designed for screens" 
    },
    { 
      value: "atkinson", 
      label: "Atkinson Hyperlegible", 
      description: "Designed for maximum legibility, especially for readers with low vision" 
    },
    { 
      value: "openDyslexic", 
      label: "OpenDyslexic", 
      description: "Designed to help readers with dyslexia" 
    },
    { 
      value: "roboto", 
      label: "Roboto", 
      description: "Google's signature font with natural reading rhythm" 
    },
    { 
      value: "sourceSansPro", 
      label: "Source Sans Pro", 
      description: "Clear, readable font by Adobe designed for user interfaces" 
    },
  ];

  /**
   * Updates the primary color in theme options
   * @param value - Color name (blue, teal, etc.)
   */
  const handleColorChange = (value: string) => {
    updateThemeOptions({ primaryColor: value });
  };

  /**
   * Updates the font size scaling in theme options
   * @param value - Font size option (sm, md, lg)
   */
  const handleFontSizeChange = (value: string) => {
    updateThemeOptions({ fontSize: value as "sm" | "md" | "lg" });
  };

  /**
   * Updates the font family in theme options
   * @param value - Font family option (system, inter, atkinson, etc.)
   */
  const handleFontFamilyChange = (value: FontFamily) => {
    updateThemeOptions({ fontFamily: value });
  };

  // Parse current layout dimensions from theme options
  const currentSidebarWidth = parsePixelValue(themeOptions.sidebarWidth);
  const currentContentWidth = parsePixelValue(themeOptions.contentWidth);
  const currentDrawerWidth = parsePixelValue(themeOptions.drawerWidth);

  /**
   * Updates the sidebar width in theme options
   * @param value - Width in pixels
   */
  const handleSidebarWidthChange = (value: number) => {
    updateThemeOptions({ sidebarWidth: `${value}px` });
  };

  /**
   * Updates the content area width in theme options
   * @param value - Width in pixels
   */
  const handleContentWidthChange = (value: number) => {
    updateThemeOptions({ contentWidth: `${value}px` });
  };

  /**
   * Updates the drawer width in theme options
   * @param value - Width in pixels
   */
  const handleDrawerWidthChange = (value: number) => {
    updateThemeOptions({ drawerWidth: `${value}px` });
  };

  /**
   * Resets all theme options to default values
   */
  const resetToDefaults = () => {
    updateThemeOptions({
      colorMode: "light",
      primaryColor: "blue",
      fontSize: "md",
      fontFamily: "system",
      sidebarWidth: "280px",
      contentWidth: "800px",
      drawerWidth: "400px",
    });
  };

  return (
    <MainLayout>
      <Box>
        <Heading as="h1" size="xl" mb={6}>
          Theme Settings
        </Heading>

        {/* Settings grid layout - 2 columns on desktop, 1 on mobile */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          {/* Colors Section */}
          <GridItem>
            <Card variant="outline">
              <CardHeader pb={1}>
                <Heading size="md">Colors</Heading>
              </CardHeader>
              <CardBody>
                <FormControl mb={4}>
                  <FormLabel>Primary Color</FormLabel>
                  <RadioGroup
                    value={themeOptions.primaryColor}
                    onChange={handleColorChange}
                  >
                    <HStack spacing={3} wrap="wrap">
                      {colorOptions.map((color) => (
                        <Radio
                          key={color.value}
                          value={color.value}
                          colorScheme={color.value}
                          size="lg"
                        >
                          <Text fontSize="sm">{color.label}</Text>
                        </Radio>
                      ))}
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </CardBody>
            </Card>
          </GridItem>

          {/* Typography Section */}
          <GridItem>
            <Card variant="outline">
              <CardHeader pb={1}>
                <Heading size="md">Typography</Heading>
              </CardHeader>
              <CardBody>
                {/* Font Size Control */}
                <FormControl mb={4}>
                  <FormLabel>Font Size</FormLabel>
                  <Select
                    value={themeOptions.fontSize}
                    onChange={(e) => handleFontSizeChange(e.target.value)}
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </Select>
                </FormControl>

                {/* Font Family Control with Accessibility Options */}
                <FormControl>
                  <FormLabel>
                    Font Family 
                    <Text as="span" fontSize="sm" fontWeight="normal" ml={2} color="gray.500">
                      (Accessibility Options)
                    </Text>
                  </FormLabel>
                  <Box mb={3}>
                    <Text fontSize="sm" color="gray.500" mb={2}>
                      Choose a font that works best for your reading needs
                    </Text>
                  </Box>
                  <RadioGroup
                    value={themeOptions.fontFamily}
                    onChange={handleFontFamilyChange}
                  >
                    <VStack align="start" spacing={3} width="100%">
                      {/* Render each font option with a preview */}
                      {fontOptions.map((font) => (
                        <Box 
                          key={font.value} 
                          width="100%" 
                          p={2} 
                          borderWidth="1px" 
                          borderRadius="md"
                          borderColor={themeOptions.fontFamily === font.value 
                            ? colorMode === "dark" ? "blue.400" : "blue.500" 
                            : colorMode === "dark" ? "gray.700" : "gray.200"
                          }
                          bg={themeOptions.fontFamily === font.value 
                            ? colorMode === "dark" ? "blue.900" : "blue.50" 
                            : "transparent"
                          }
                        >
                          <Radio
                            value={font.value}
                            width="100%"
                          >
                            <Box>
                              {/* Font name in the actual font */}
                              <Text 
                                fontWeight="medium" 
                                fontFamily={font.value === "system" 
                                  ? undefined 
                                  : `${font.label}, sans-serif`
                                }
                              >
                                {font.label}
                              </Text>
                              {/* Description of the font's accessibility features */}
                              <Text 
                                fontSize="sm" 
                                color="gray.500" 
                                mt={1}
                                fontFamily={font.value === "system" 
                                  ? undefined 
                                  : `${font.label}, sans-serif`
                                }
                              >
                                {font.description}
                              </Text>
                              {/* Sample text in the font */}
                              <Box mt={1}>
                                <Text 
                                  fontSize="sm" 
                                  fontFamily={font.value === "system" 
                                    ? undefined 
                                    : `${font.label}, sans-serif`
                                  }
                                >
                                  Sample text with {font.label} font
                                </Text>
                              </Box>
                            </Box>
                          </Radio>
                        </Box>
                      ))}
                    </VStack>
                  </RadioGroup>
                </FormControl>
              </CardBody>
            </Card>
          </GridItem>

          {/* Layout Settings Section - spans full width */}
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <Card variant="outline">
              <CardHeader pb={1}>
                <Heading size="md">Layout</Heading>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  You can also drag the edges in the main UI to resize elements.
                </Text>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={6}>
                  {/* Sidebar Width Control */}
                  <FormControl>
                    <FormLabel>Sidebar Width</FormLabel>
                    <HStack spacing={4}>
                      <Box flex="1">
                        <Slider
                          aria-label="sidebar-width"
                          value={currentSidebarWidth}
                          onChange={handleSidebarWidthChange}
                          min={180}
                          max={600}
                          step={10}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                      <NumberInput
                        maxW="100px"
                        value={currentSidebarWidth}
                        onChange={(_, val) => handleSidebarWidthChange(val)}
                        min={180}
                        max={600}
                        step={10}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text>px</Text>
                    </HStack>
                  </FormControl>

                  {/* Content Width Control */}
                  <FormControl>
                    <FormLabel>Content Width</FormLabel>
                    <HStack spacing={4}>
                      <Box flex="1">
                        <Slider
                          aria-label="content-width"
                          value={currentContentWidth}
                          onChange={handleContentWidthChange}
                          min={400}
                          max={1600}
                          step={20}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                      <NumberInput
                        maxW="100px"
                        value={currentContentWidth}
                        onChange={(_, val) => handleContentWidthChange(val)}
                        min={400}
                        max={1600}
                        step={20}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text>px</Text>
                    </HStack>
                  </FormControl>

                  {/* Drawer Width Control */}
                  <FormControl>
                    <FormLabel>Drawer Width</FormLabel>
                    <HStack spacing={4}>
                      <Box flex="1">
                        <Slider
                          aria-label="drawer-width"
                          value={currentDrawerWidth}
                          onChange={handleDrawerWidthChange}
                          min={250}
                          max={800}
                          step={10}
                        >
                          <SliderTrack>
                            <SliderFilledTrack />
                          </SliderTrack>
                          <SliderThumb />
                        </Slider>
                      </Box>
                      <NumberInput
                        maxW="100px"
                        value={currentDrawerWidth}
                        onChange={(_, val) => handleDrawerWidthChange(val)}
                        min={250}
                        max={800}
                        step={10}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text>px</Text>
                    </HStack>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Reset Button */}
        <Box mt={8} textAlign="center">
          <Button colorScheme="red" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default SettingsPage;
