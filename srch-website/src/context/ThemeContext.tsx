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
      heading: `'Inter', sans-serif`,
      body: `'Inter', sans-serif`,
    },
    fontSizes: fontSizeMap[options.fontSize],
    styles: {
      global: (props: any) => ({
        body: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          color: props.colorMode === "dark" ? "gray.100" : "gray.800",
        },
      }),
    },
    components: {
      Button: {
        baseStyle: {
          fontWeight: "medium",
          _focus: {
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
          },
        },
        variants: {
          solid: (props: any) => ({
            bg:
              props.colorMode === "dark"
                ? `${options.primaryColor}.200`
                : `${options.primaryColor}.500`,
            color: props.colorMode === "dark" ? "gray.800" : "white",
            _hover: {
              bg:
                props.colorMode === "dark"
                  ? `${options.primaryColor}.300`
                  : `${options.primaryColor}.600`,
            },
            _focus: {
              boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)",
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
