import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { loadMarkdownFiles } from "@/utils/fileLoader";
import { useToast } from "@chakra-ui/react";

// Define types for our markdown files
export interface MarkdownFile {
  id: string;
  title: string;
  path: string;
  category: string;
  content: string;
  order?: number;
  type: "main" | "drawer"; // Distinguish between main content and drawer content
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

interface MarkdownContextProps {
  mainFiles: MarkdownFile[]; // Files to be shown in sidebar
  drawerFiles: MarkdownFile[]; // Files to be opened in drawer
  categories: Category[];
  currentFile: MarkdownFile | null;
  loadFile: (fileId: string) => Promise<void>;
  drawerContent: string | null;
  openDrawer: (markdownContent: string) => void;
  closeDrawer: () => void;
  isDrawerOpen: boolean;
  isLoading: boolean;
  getDrawerFileById: (id: string) => MarkdownFile | undefined;
  error: string | null;
  refreshFiles: () => Promise<void>;
}

const MarkdownContext = createContext<MarkdownContextProps | undefined>(
  undefined
);

export const MarkdownProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mainFiles, setMainFiles] = useState<MarkdownFile[]>([]);
  const [drawerFiles, setDrawerFiles] = useState<MarkdownFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentFile, setCurrentFile] = useState<MarkdownFile | null>(null);
  const [drawerContent, setDrawerContent] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Load all markdown files on initialization
  const loadFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load files from the filesystem using the fileLoader utility
      const { mainFiles, drawerFiles, categories } =
        await loadMarkdownFiles();

      if (mainFiles.length === 0) {
        setError("No main content files found.");
        toast({
          title: "Content loading warning",
          description: "No main content files were found. The application may not work correctly.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }

      setMainFiles(mainFiles);
      setDrawerFiles(drawerFiles);
      setCategories(categories);

      // Set the default file
      const defaultFile =
        mainFiles.find((file) => file.id === "algorithmic-fairness") ||
        (mainFiles.length > 0 ? mainFiles[0] : null);

      if (defaultFile) {
        setCurrentFile(defaultFile);
      } else if (mainFiles.length === 0) {
        setError("No default file found. Please add markdown content to the application.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load markdown files:", error);
      setError("Failed to load content. Please check the console for details.");
      setIsLoading(false);
      toast({
        title: "Error loading content",
        description: "Failed to load markdown files. Please try refreshing the page.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const loadFile = async (fileId: string) => {
    if (!fileId) {
      toast({
        title: "Navigation error",
        description: "Invalid file ID provided.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const file = mainFiles.find((f) => f.id === fileId);
      if (file) {
        setCurrentFile(file);
      } else {
        console.error(`File with ID ${fileId} not found`);
        toast({
          title: "File not found",
          description: `The file "${fileId}" could not be found.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(`Failed to load file with ID ${fileId}:`, error);
      toast({
        title: "Error loading file",
        description: "An unexpected error occurred while loading the file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDrawerFileById = useCallback((id: string) => {
    if (!id) return undefined;
    return drawerFiles.find((file) => file.id === id);
  }, [drawerFiles]);

  const openDrawer = useCallback((content: string) => {
    if (!content) {
      toast({
        title: "Warning",
        description: "Attempted to open drawer with empty content.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setDrawerContent(content);
    setIsDrawerOpen(true);
  }, [toast]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    // We'll keep the content in state until the drawer is closed for a smooth transition
    setTimeout(() => {
      setDrawerContent(null);
    }, 300);
  }, []);

  // Function to manually refresh files (useful for development or if files change)
  const refreshFiles = useCallback(async () => {
    await loadFiles();
    toast({
      title: "Content refreshed",
      description: "All content has been reloaded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  }, [loadFiles, toast]);

  return (
    <MarkdownContext.Provider
      value={{
        mainFiles,
        drawerFiles,
        categories,
        currentFile,
        loadFile,
        drawerContent,
        openDrawer,
        closeDrawer,
        isDrawerOpen,
        isLoading,
        getDrawerFileById,
        error,
        refreshFiles,
      }}
    >
      {children}
    </MarkdownContext.Provider>
  );
};

export const useMarkdown = (): MarkdownContextProps => {
  const context = useContext(MarkdownContext);
  if (context === undefined) {
    throw new Error("useMarkdown must be used within a MarkdownProvider");
  }
  return context;
};
