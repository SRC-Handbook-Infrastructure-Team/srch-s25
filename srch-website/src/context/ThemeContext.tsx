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

export interface ThemeOptions {
  colorMode: "light" | "dark";
  primaryColor: string;
  fontSize: "sm" | "md" | "lg";
  sidebarWidth: string;
  contentWidth: string;
  drawerWidth: string;
}

/**
 * We extend ChakraTheme with our own "layout" field.
 * Now TypeScript will let us do `theme.layout.sidebarWidth`.
 */
export interface ExtendedChakraTheme extends ChakraTheme {
  layout: {
    sidebarWidth: string;
    contentWidth: string;
    drawerWidth: string;
  };
}

interface ThemeContextProps {
  themeOptions: ThemeOptions;
  updateThemeOptions: (options: Partial<ThemeOptions>) => void;
  theme: ExtendedChakraTheme;
}

const defaultThemeOptions: ThemeOptions = {
  colorMode: "light",
  primaryColor: "blue",
  fontSize: "md",
  sidebarWidth: "280px",
  contentWidth: "800px",
  drawerWidth: "400px",
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Map "sm", "md", "lg" to actual numeric sizes
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

/** Generate an ExtendedChakraTheme with extra "layout" property. */
function generateTheme(options: ThemeOptions): ExtendedChakraTheme {
  const config: ThemeConfig = {
    initialColorMode: options.colorMode,
    useSystemColorMode: false,
  };

  // 1) Create a base Chakra theme
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
      heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
      body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
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

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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

  const [theme, setTheme] = useState<ExtendedChakraTheme>(() =>
    generateTheme(themeOptions)
  );

  /** Called to update partial fields in themeOptions and re-generate theme */
  const updateThemeOptions = (updates: Partial<ThemeOptions>) => {
    setThemeOptions((prev) => {
      const newOptions = { ...prev, ...updates };
      localStorage.setItem("themeOptions", JSON.stringify(newOptions));
      return newOptions;
    });
  };

  useEffect(() => {
    // Re-generate the theme whenever themeOptions changes
    const newTheme = generateTheme(themeOptions);
    setTheme(newTheme);
  }, [themeOptions]);

  return (
    <ThemeContext.Provider value={{ themeOptions, updateThemeOptions, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
};
