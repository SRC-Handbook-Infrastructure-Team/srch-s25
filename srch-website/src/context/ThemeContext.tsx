import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  extendTheme,
  ChakraTheme,
  ThemeConfig,
  // We import defaultTheme if needed, or we can skip it
} from "@chakra-ui/react";

/**
 * Supported font family options with a focus on accessibility.
 * Includes specialized fonts like Atkinson Hyperlegible for low vision
 * and OpenDyslexic for users with dyslexia.
 */
export type FontFamily = 
  | 'system'        // System default fonts
  | 'inter'         // Clean, modern sans-serif
  | 'atkinson'      // Atkinson Hyperlegible - optimized for low vision
  | 'openDyslexic'  // Designed specifically for dyslexic readers
  | 'roboto'        // Google's signature font
  | 'sourceSansPro'; // Adobe's clean, readable UI font

/**
 * Core theme options that can be customized by the user.
 * These settings control the visual appearance and layout of the application.
 */
export interface ThemeOptions {
  colorMode: "light" | "dark";       // Color theme (light/dark)
  primaryColor: string;              // Primary accent color
  fontSize: "sm" | "md" | "lg";      // Base font size scale
  fontFamily: FontFamily;            // Font family selection (accessibility)
  sidebarWidth: string;              // Width of the navigation sidebar
  contentWidth: string;              // Maximum width of the main content area
  drawerWidth: string;               // Width of the supplementary drawer
}

/**
 * Extends the standard Chakra theme with our custom layout properties.
 * This makes layout dimensions available throughout the theme object.
 */
export interface ExtendedChakraTheme extends ChakraTheme {
  layout: {
    sidebarWidth: string;
    contentWidth: string;
    drawerWidth: string;
  };
}

/**
 * Props for the ThemeContext Provider.
 * Provides access to current theme options, a way to update them,
 * and the generated Chakra theme object.
 */
interface ThemeContextProps {
  themeOptions: ThemeOptions;                              // Current theme options
  updateThemeOptions: (options: Partial<ThemeOptions>) => void; // Function to update options
  theme: ExtendedChakraTheme;                             // Generated Chakra theme
}

/**
 * Default theme settings used as fallback and for reset functionality.
 */
const defaultThemeOptions: ThemeOptions = {
  colorMode: "light",
  primaryColor: "blue",
  fontSize: "md",
  fontFamily: "system",
  sidebarWidth: "280px",
  contentWidth: "800px",
  drawerWidth: "400px",
};

// Create context with undefined default - will be populated by provider
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

/**
 * Maps font size settings (sm, md, lg) to actual pixel values for different
 * text size variants.
 */
const fontSizeMap = {
  sm: {
    sm: "0.75rem",
    md: "0.875rem",
    lg: "1rem",
    xl: "1.125rem",
    "2xl": "1.25rem",
    "3xl": "1.5rem",
    "4xl": "1.875rem",
  },
  md: {
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  lg: {
    sm: "1rem",
    md: "1.125rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.75rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
  },
};

/**
 * Maps font family types to actual CSS font-family strings.
 * Each entry includes appropriate fallbacks for system compatibility.
 */
const fontFamilyMap: Record<FontFamily, string> = {
  system: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
  inter: `'Inter', sans-serif`,
  atkinson: `'Atkinson Hyperlegible', sans-serif`,
  openDyslexic: `'OpenDyslexic', sans-serif`,
  roboto: `'Roboto', sans-serif`,
  sourceSansPro: `'Source Sans Pro', sans-serif`,
};

/**
 * Generates a complete Chakra theme based on the provided options.
 * This function transforms our simplified theme options into a fully-featured
 * Chakra theme with all necessary style definitions.
 * 
 * @param options - User-defined theme options
 * @returns A complete Chakra theme extended with our custom layout properties
 */
function generateTheme(options: ThemeOptions): ExtendedChakraTheme {
  // Set up initial Chakra config
  const config: ThemeConfig = {
    initialColorMode: options.colorMode,
    useSystemColorMode: false,
  };

  // Get the font family string from our map
  const fontFamily = fontFamilyMap[options.fontFamily];

  // 1) Create a base Chakra theme with our customizations
  const baseTheme = extendTheme({
    config,
    colors: {
      brand: {
        50: `${options.primaryColor}.50`,
        100: `${options.primaryColor}.100`,
        200: `${options.primaryColor}.200`,
        300: `${options.primaryColor}.300`,
        400: `${options.primaryColor}.400`,
        500: `${options.primaryColor}.500`,
        600: `${options.primaryColor}.600`,
        700: `${options.primaryColor}.700`,
        800: `${options.primaryColor}.800`,
        900: `${options.primaryColor}.900`,
      },
    },
    fonts: {
      heading: fontFamily,
      body: fontFamily,
      mono: `'JetBrains Mono', 'SF Mono', 'Roboto Mono', Menlo, Consolas, Monaco, monospace`,
    },
    fontSizes: fontSizeMap[options.fontSize],
    styles: {
      global: (props: any) => ({
        body: {
          bg: props.colorMode === "dark" ? "gray.900" : "white",
          color: props.colorMode === "dark" ? "gray.100" : "gray.800",
          transitionProperty: "background-color",
          transitionDuration: "normal",
        },
        "*::selection": {
          bg: props.colorMode === "dark"
            ? `${options.primaryColor}.700`
            : `${options.primaryColor}.100`,
        },
      }),
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: "medium",
          borderRadius: "md",
          _focus: {
            boxShadow: `0 0 0 3px ${options.primaryColor}.300`,
          },
        },
        variants: {
          solid: (props: any) => ({
            bg: props.colorMode === "dark"
              ? `${options.primaryColor}.500`
              : `${options.primaryColor}.500`,
            color: "white",
            _hover: {
              bg: props.colorMode === "dark"
                ? `${options.primaryColor}.400`
                : `${options.primaryColor}.600`,
              transform: "translateY(-1px)",
              boxShadow: "sm",
            },
            _active: {
              bg: props.colorMode === "dark"
                ? `${options.primaryColor}.600`
                : `${options.primaryColor}.700`,
              transform: "translateY(0)",
            },
          }),
          outline: (props: any) => ({
            borderColor: props.colorMode === "dark"
              ? `${options.primaryColor}.400`
              : `${options.primaryColor}.500`,
            color: props.colorMode === "dark"
              ? `${options.primaryColor}.300`
              : `${options.primaryColor}.500`,
            _hover: {
              bg: props.colorMode === "dark"
                ? `${options.primaryColor}.900`
                : `${options.primaryColor}.50`,
              borderColor: props.colorMode === "dark"
                ? `${options.primaryColor}.300`
                : `${options.primaryColor}.600`,
              transform: "translateY(-1px)",
              boxShadow: "sm",
            },
          }),
          ghost: (props: any) => ({
            color: props.colorMode === "dark" ? "gray.300" : "gray.600",
            _hover: {
              bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
              color: props.colorMode === "dark" ? "white" : "gray.800",
            },
            _active: {
              bg: props.colorMode === "dark" ? "gray.600" : "gray.200",
            },
          }),
        },
        sizes: {
          sm: {
            h: "32px",
            fontSize: "sm",
            px: "12px",
          },
          md: {
            h: "40px",
            fontSize: "md",
            px: "16px",
          },
        },
      },
      Link: {
        baseStyle: (props: any) => ({
          color: props.colorMode === "dark"
            ? `${options.primaryColor}.300`
            : `${options.primaryColor}.600`,
          _hover: {
            textDecoration: "none",
            color: props.colorMode === "dark"
              ? `${options.primaryColor}.200`
              : `${options.primaryColor}.700`,
          },
        }),
      },
      Heading: {
        baseStyle: {
          fontWeight: "600",
        },
      },
      Input: {
        variants: {
          filled: (props: any) => ({
            field: {
              bg: props.colorMode === "dark" ? "gray.700" : "gray.100",
              _hover: {
                bg: props.colorMode === "dark" ? "gray.600" : "gray.200",
              },
              _focus: {
                bg: props.colorMode === "dark" ? "gray.600" : "gray.200",
                borderColor: `${options.primaryColor}.500`,
              },
            },
          }),
        },
      },
    },
  }) as ChakraTheme;

  // 2) Return that theme plus our custom layout property
  const extendedTheme: ExtendedChakraTheme = {
    ...baseTheme,
    layout: {
      sidebarWidth: options.sidebarWidth,
      contentWidth: options.contentWidth,
      drawerWidth: options.drawerWidth,
    },
  };
  return extendedTheme;
}

/**
 * ThemeProvider component that manages theme state and provides theme context.
 * Responsible for:
 * 1. Loading saved theme from localStorage
 * 2. Generating the Chakra theme from options
 * 3. Providing theme update capabilities
 * 4. Loading necessary web fonts
 * 
 * @param children - Child components that will have access to theme context
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize theme options from localStorage or defaults
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(() => {
    // Merge default with localStorage to avoid undefined
    const saved = localStorage.getItem("themeOptions");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultThemeOptions, ...parsed };
      } catch (err) {
        console.warn("Error parsing themeOptions from localStorage:", err);
        return defaultThemeOptions;
      }
    }
    return defaultThemeOptions;
  });

  // Generate the actual theme from options
  const [theme, setTheme] = useState<ExtendedChakraTheme>(() =>
    generateTheme(themeOptions)
  );

  /**
   * Updates theme options and saves to localStorage.
   * Allows partial updates - only changed properties need to be specified.
   * 
   * @param updates - Partial theme options to update
   */
  const updateThemeOptions = (updates: Partial<ThemeOptions>) => {
    setThemeOptions((prev) => {
      const newOptions = { ...prev, ...updates };
      localStorage.setItem("themeOptions", JSON.stringify(newOptions));
      return newOptions;
    });
  };

  // Regenerate theme when options change
  useEffect(() => {
    // Re-generate the theme whenever themeOptions changes
    const newTheme = generateTheme(themeOptions);
    setTheme(newTheme);
  }, [themeOptions]);

  // Inject font links for custom fonts
  useEffect(() => {
    // Only add the font link if it's not already present
    const linkIds = [
      'atkinson-font',
      'opendyslexic-font',
      'roboto-font',
      'sourcesanspro-font',
      'inter-font'
    ];

    // Remove any existing font links to avoid duplication
    linkIds.forEach(id => {
      const existingLink = document.getElementById(id);
      if (existingLink) {
        existingLink.remove();
      }
    });

    /**
     * Creates and appends a link element to load an external font.
     * 
     * @param id - Unique ID for the link element
     * @param href - URL to the font resource
     */
    const addFontLink = (id: string, href: string) => {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    // Add all our font links
    addFontLink('inter-font', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    addFontLink('atkinson-font', 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');
    addFontLink('roboto-font', 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
    addFontLink('sourcesanspro-font', 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
    
    // OpenDyslexic isn't available on Google Fonts, so we can link to a CDN or self-host it
    // This is a placeholder - you would need to provide the correct URL for OpenDyslexic
    addFontLink('opendyslexic-font', 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css');
  }, []);

  return (
    <ThemeContext.Provider value={{ themeOptions, updateThemeOptions, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access theme context.
 * Provides a typed interface to the current theme settings and updater function.
 * 
 * @returns ThemeContextProps with current theme state and update function
 * @throws Error if used outside of ThemeProvider
 */
export const useTheme = (): ThemeContextProps => {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};
