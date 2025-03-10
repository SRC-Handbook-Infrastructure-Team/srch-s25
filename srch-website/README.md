# Markdown Knowledge Base

A modern, accessible knowledge base application that renders custom Markdown content with interactive navigation elements.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Using the Application](#using-the-application)
- [Custom Markdown Syntax](#custom-markdown-syntax)
- [Accessibility Features](#accessibility-features)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Custom Theming](#custom-theming)
- [Contributing](#contributing)

## Features

- **Interactive Markdown Rendering**: Renders markdown with custom syntax for interactive UI elements
- **Accessible Typography**: Multiple font options including specialized fonts for users with visual impairments and dyslexia
- **Responsive Layout**: Works on all screen sizes with mobile-specific optimizations
- **Theme Customization**: Light/dark modes and color theme options
- **Hierarchical Navigation**: Content organized by categories with expandable/collapsible sections
- **Search Functionality**: Real-time searching across all content
- **Resizable Panels**: Customizable layout with draggable dividers
- **Supplementary Content Drawers**: Display related content without leaving the current page

## Technology Stack

- **React 18**: UI component library
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast, modern build tool
- **Chakra UI**: Accessible component library with built-in dark mode
- **React Router**: Client-side routing
- **React Markdown**: Markdown parsing and rendering
- **Remark/Rehype**: Markdown processing plugins
- **React Syntax Highlighter**: Code syntax highlighting

## Project Structure

```
src/
├── assets/         # Static assets (images, etc.)
├── components/     # Reusable UI components
│   ├── Header.tsx           # App header with navigation controls
│   ├── Sidebar.tsx          # Navigation sidebar with categories and search
│   ├── MarkdownRenderer.tsx # Custom markdown renderer with interactive elements
│   ├── ContentDrawer.tsx    # Right-side drawer for supplementary content
│   └── ...
├── context/        # React context providers
│   ├── MarkdownContext.tsx  # Content loading and state management
│   └── ThemeContext.tsx     # Theme configuration and font settings
├── hooks/          # Custom React hooks
├── layouts/        # Page layout components
│   └── MainLayout.tsx       # Primary application layout with sidebar/content structure
├── markdown/       # Markdown content files
│   ├── main_files/          # Primary content markdown files
│   └── drawer_files/        # Supplementary content for the drawer
├── pages/          # Page components
│   ├── HomePage.tsx         # Main content viewing page
│   ├── SettingsPage.tsx     # User preferences and theme settings
│   └── AboutPage.tsx        # About information
├── utils/          # Utility functions
│   └── fileLoader.ts        # Markdown file loading and processing
├── App.tsx         # Application root component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/markdown-knowledge-base.git
   cd markdown-knowledge-base
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Build for production:
   ```bash
   npm run build
   # or
   yarn build
   ```

## Using the Application

### Navigation
- Use the sidebar to browse through categories and topics
- Click on category headers to expand/collapse sections
- Use the search box to filter content by keywords
- Click the sidebar toggle button in the header to collapse/expand the sidebar

### Content Viewing
- The main content area displays the selected markdown file
- Interactive buttons within content can:
  - Load different pages ([nav] buttons)
  - Open supplementary content in the drawer ([sidebar] buttons)
- The drawer panel on the right shows supplementary information when triggered

### Customization
- Visit the Settings page to customize:
  - Color theme
  - Font size
  - Font family (including accessible options)
  - Layout dimensions (panel widths)
- All settings are saved to localStorage for persistence
- Resize panels by dragging their edges

## Custom Markdown Syntax

The application supports standard Markdown plus custom extensions:

### Navigation Buttons
Load a different main content file:
```markdown
[nav:Button Text](file-id)
```

### Sidebar Buttons
Open supplementary content in the right drawer:
```markdown
[sidebar:Button Text](file-id)
```

### Examples
```markdown
# Main Heading

This is a paragraph with a [sidebar:See Definition](definition-123) button that opens
the definition in the side drawer.

To continue to the next topic, click [nav:Next Topic](next-topic-456).
```

## Accessibility Features

### Font Options
- **System Default**: Uses system fonts
- **Inter**: Modern sans-serif font
- **Atkinson Hyperlegible**: Designed for maximum legibility, especially for low vision users
- **OpenDyslexic**: Specially designed for readers with dyslexia
- **Roboto**: Google's clean, readable font
- **Source Sans Pro**: Adobe's UI-optimized font

### Other Accessibility Features
- Fully keyboard navigable interface
- Proper heading hierarchy
- Semantic HTML structure
- High contrast mode support
- Screen reader optimizations
- Resizable text and layout
- ARIA attributes throughout

## Component Architecture

### Core Components

#### MainLayout
The primary layout component that structures the application with:
- Fixed header
- Collapsible sidebar
- Main content area
- Optional drawer

#### MarkdownRenderer
Custom component that:
- Renders standard markdown as Chakra UI components
- Processes custom syntax for interactive elements
- Handles code highlighting, links, and images

#### Sidebar
Navigation component that:
- Organizes content by categories
- Provides search functionality
- Shows visual cues for current location
- Adapts to mobile as a drawer

#### ContentDrawer
Supplementary content panel that:
- Shows related information without page navigation
- Can be resized by the user
- Maintains good UX with smooth transitions

### Context Providers

#### MarkdownContext
Manages content state:
- Loads markdown files on initialization
- Organizes content into categories
- Provides functions to navigate between files
- Controls the drawer state

#### ThemeContext
Manages appearance settings:
- Light/dark mode
- Color theme
- Typography options
- Layout dimensions
- Font accessibility options

## State Management

The application uses React Context for state management:

1. **Theme State**:
   - User preferences for appearance
   - Saved to localStorage for persistence
   - Accessible throughout the app via useTheme hook

2. **Content State**:
   - Current file being displayed
   - Available files and categories
   - Drawer state and content
   - Loading states
   - Accessible via useMarkdown hook

## Custom Theming

The app extends Chakra UI's theming system with:

- Custom color schemes
- Extended font options for accessibility
- Layout dimension controls
- Dynamic style generation based on user preferences

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
