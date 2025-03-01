import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { MarkdownProvider } from "@/context/MarkdownContext";
import HomePage from "@/pages/HomePage";
import SettingsPage from "@/pages/SettingsPage";
import AboutPage from "@/pages/AboutPage";

/**
 * Renders the entire application with the custom Chakra theme
 * from ThemeContext and the MarkdownProvider for content.
 */

const ThemedApp: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

const App: React.FC = () => {
  return (
    <>
      <ColorModeScript initialColorMode="light" />
      <ThemeProvider>
        <MarkdownProvider>
          <ThemedApp />
        </MarkdownProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
