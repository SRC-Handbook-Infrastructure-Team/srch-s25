import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loadMarkdownFiles } from "@/utils/fileLoader";

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

  // Load all markdown files on initialization
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoading(true);

        // Load files from the filesystem using the fileLoader utility
        const { mainFiles, drawerFiles, categories } =
          await loadMarkdownFiles();

        setMainFiles(mainFiles);
        setDrawerFiles(drawerFiles);
        setCategories(categories);

        // Set the default file
        const defaultFile =
          mainFiles.find((file) => file.id === "algorithmic-fairness") ||
          (mainFiles.length > 0 ? mainFiles[0] : null);

        if (defaultFile) {
          setCurrentFile(defaultFile);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load markdown files:", error);
        setIsLoading(false);
      }
    };

    loadFiles();
  }, []);

  const loadFile = async (fileId: string) => {
    setIsLoading(true);
    try {
      const file = mainFiles.find((f) => f.id === fileId);
      if (file) {
        setCurrentFile(file);
      } else {
        console.error(`File with ID ${fileId} not found`);
      }
    } catch (error) {
      console.error(`Failed to load file with ID ${fileId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDrawerFileById = (id: string) => {
    return drawerFiles.find((file) => file.id === id);
  };

  const openDrawer = (content: string) => {
    setDrawerContent(content);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    // We'll keep the content in state until the drawer is closed for a smooth transition
    setTimeout(() => {
      setDrawerContent(null);
    }, 300);
  };

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
