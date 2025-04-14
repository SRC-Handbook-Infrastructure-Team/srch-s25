import { useState } from "react";
import "./App.css";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme";
import NavBar from "./components/NavBar";
import MarkdownPage from "./pages/MarkdownPage";
import Home from "./pages/Home";
import { Acknowledgements, Team, AdditionalContributors } from "./pages/Acknowledgements";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename="/srch-s25/">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:fileId" element={<MarkdownPage />} />
          {/* TODO: fix these paths*/}
          <Route path="/acknowledgements" element={<Acknowledgements />} />
          <Route path="/acknowledgements/ai" element={<Team teamName="ai" />} />
          <Route
            path="/acknowledgements/privacy"
            element={<Team teamName="privacy" />}
          />
          <Route
            path="/acknowledgements/accessibility"
            element={<Team teamName="accessibility" />}
          />
          <Route
            path="/acknowledgements/product"
            element={<Team teamName="product" />}
          />
          <Route
            path="/acknowledgements/additional"
            element={<AdditionalContributors />}
          />
          {/* TODO: Add additional contributors for this...  */}
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
