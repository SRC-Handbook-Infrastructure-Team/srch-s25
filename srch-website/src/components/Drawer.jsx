import React, { useState, useCallback, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Drawer, Button, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const defaultDrawerWidth = 240;
const minDrawerWidth = 50;
const maxDrawerWidth = 1000;

const CustomDrawer = styled(Drawer)(({ theme, drawerWidth }) => ({
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    transition: "width 0.2s ease-in-out",
  }
}));

const Dragger = styled("div")({
  width: "5px",
  cursor: "ew-resize",
  padding: "4px 0 0",
  borderTop: "1px solid #ddd",
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 100,
  backgroundColor: "#f4f7f9"
});

const MarkdownContainer = styled("div")({
  padding: "16px",
  overflowY: "auto",
  height: "calc(100% - 60px)",
});

export default function ResizableDrawer({ markdownPath }) {
  const [drawerWidth, setDrawerWidth] = useState(defaultDrawerWidth);
  const [open, setOpen] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    // Load markdown content from file or path
    if (markdownPath) {
      // If markdownPath is directly markdown content
      if (markdownPath.startsWith('#') || markdownPath.includes('\n')) {
        setMarkdownContent(markdownPath);
      } else {
        // If markdownPath is a file path, fetch it
        fetch(markdownPath)
          .then(response => response.text())
          .then(text => {
            setMarkdownContent(text);
          })
          .catch(error => {
            console.error("Error loading markdown file:", error);
            setMarkdownContent("## Error loading markdown content");
          });
      }
    }
  }, [markdownPath]);

  const handleMouseMove = useCallback((e) => {
    // For right drawer, calculate width from right side of screen
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
      setDrawerWidth(newWidth);
    }
  }, []);

  const handleMouseDown = () => {
    const onMouseMove = handleMouseMove;
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    // Start listening to mousemove and mouseup events
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const openDrawer = () => {
    setOpen(true);
  };

  return (
    <>
      <Typography variant="body1" onClick={openDrawer} style={{ cursor: 'pointer', color: 'blue' }}>
        Open Drawer
      </Typography>
      <CustomDrawer 
        anchor="right" 
        variant="persistent" 
        open={open} 
        drawerWidth={drawerWidth}
      >
        <Button onClick={closeDrawer} style={{ margin: '10px' }}>
          Close
        </Button>
        <Dragger onMouseDown={handleMouseDown} />
        <MarkdownContainer>
          <ReactMarkdown>
            {markdownContent}
          </ReactMarkdown>
        </MarkdownContainer>
      </CustomDrawer>
    </>
  );
}