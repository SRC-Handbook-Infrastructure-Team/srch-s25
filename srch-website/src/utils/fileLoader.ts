import { MarkdownFile, Category } from "@/context/MarkdownContext";

// Constants for improved code organization
/**
 * Default category ordering value for categories that don't have explicit ordering
 */
const DEFAULT_CATEGORY_ORDER = 100;

/**
 * Priority ordering for common category types
 * Lower values appear first in navigation
 */
const CATEGORY_PRIORITIES: Record<string, number> = {
  introduction: 1,
  "getting-started": 2,
  basics: 3,
  "core-concepts": 4,
  "algorithmic-fairness": 5,
  "algorithmic-justice": 6,
  "fairness-metrics": 7,
  applications: 8,
  advanced: 9,
  "case-studies": 10,
  appendix: 11,
};

/**
 * Interface for the frontmatter metadata that can be present in markdown files
 */
interface FileMetadata {
  category?: string;        // Category identifier
  categoryName?: string;    // Display name for the category
  categoryOrder?: number;   // Order of the category in navigation
  order?: number;           // Order of this file within its category
  title?: string;           // Custom title for the file
  [key: string]: any;       // Other arbitrary metadata
}

/**
 * Loads all markdown files from the filesystem.
 * This is the main entry point for content loading in the application.
 * 
 * It does the following:
 * 1. Imports markdown files using Vite's import.meta.glob
 * 2. Processes frontmatter and content
 * 3. Categorizes files based on metadata or content
 * 4. Handles errors gracefully with placeholder content
 * 
 * @returns Promise with categorized main files, drawer files, and category metadata
 */
export async function loadMarkdownFiles(): Promise<{
  mainFiles: MarkdownFile[];
  drawerFiles: MarkdownFile[];
  categories: Category[];
}> {
  try {
    // Dynamically import all markdown files from their respective directories
    // This uses Vite's import.meta.glob feature for dynamic imports
    const mainFilesModules = import.meta.glob("/src/markdown/main_files/*.md", {
      eager: true,
    });
    const drawerFilesModules = import.meta.glob(
      "/src/markdown/drawer_files/*.md",
      { eager: true }
    );

    // Track unique categories found in the files
    const categoriesMap = new Map<string, Category>();

    // Process main files with error handling for each file
    const mainFiles: MarkdownFile[] = await Promise.all(
      Object.entries(mainFilesModules).map(async ([path, module]) => {
        try {
          return processMarkdownFile(path, module, "main", categoriesMap);
        } catch (error) {
          console.error(`Error processing main file ${path}:`, error);
          // Return a placeholder file with error information
          return createErrorFile(path, "main", error);
        }
      })
    );

    // Process drawer files with similar error handling
    const drawerFiles: MarkdownFile[] = await Promise.all(
      Object.entries(drawerFilesModules).map(async ([path, module]) => {
        try {
          return processMarkdownFile(path, module, "drawer", categoriesMap);
        } catch (error) {
          console.error(`Error processing drawer file ${path}:`, error);
          // Return a placeholder file with error information
          return createErrorFile(path, "drawer", error);
        }
      })
    );

    // Convert categories map to sorted array
    const categories = Array.from(categoriesMap.values()).sort(
      (a, b) => a.order - b.order
    );

    // Remove null/undefined entries and sort files by their order
    const validMainFiles = mainFiles
      .filter(Boolean)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    
    const validDrawerFiles = drawerFiles
      .filter(Boolean)
      .sort((a, b) => (a.order || 999) - (b.order || 999));

    return {
      mainFiles: validMainFiles,
      drawerFiles: validDrawerFiles,
      categories,
    };
  } catch (error) {
    console.error("Error loading markdown files:", error);
    return { mainFiles: [], drawerFiles: [], categories: [] };
  }
}

/**
 * Process a single markdown file and extract its content and metadata.
 * 
 * @param path - File path of the markdown file
 * @param module - Module object from import.meta.glob
 * @param type - File type (main content or drawer/supplementary content)
 * @param categoriesMap - Map to track and update categories
 * @returns Processed MarkdownFile object
 */
function processMarkdownFile(
  path: string, 
  module: any, 
  type: "main" | "drawer",
  categoriesMap: Map<string, Category>
): MarkdownFile {
  const content = (module as any).default as string;
  const id = path.split("/").pop()?.replace(".md", "") || generateRandomId();

  // Extract and remove frontmatter
  const { cleanContent, metadata } = extractFrontmatter(content);

  // Get title from metadata, first heading, or formatted id
  const title = metadata.title || extractTitle(cleanContent) || formatTitle(id);

  // Determine category from metadata or infer from content
  const categoryInfo = determineCategoryInfo(metadata, id);

  // Track this category if it's new
  if (!categoriesMap.has(categoryInfo.id)) {
    categoriesMap.set(categoryInfo.id, {
      id: categoryInfo.id,
      name: categoryInfo.name,
      order: categoryInfo.order,
    });
  }

  return {
    id,
    title,
    path,
    category: categoryInfo.id,
    content: cleanContent,
    type,
    order: metadata.order || categoryInfo.fileOrder || 999,
  };
}

/**
 * Creates an error placeholder file when a file fails to load.
 * This ensures the application still works even if some files have issues.
 * 
 * @param path - Path of the file that failed
 * @param type - Whether this was a main or drawer file
 * @param error - The error that occurred
 * @returns A placeholder MarkdownFile with error information
 */
function createErrorFile(
  path: string,
  type: "main" | "drawer",
  error: any
): MarkdownFile {
  const id = path.split("/").pop()?.replace(".md", "") || generateRandomId();
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    id,
    title: `Error: ${id}`,
    path,
    category: "errors",
    content: `# Error Loading File\n\nThere was an error loading this file:\n\n\`\`\`\n${errorMessage}\n\`\`\`\n\nPath: ${path}`,
    type,
    order: 9999, // Put error files at the end
  };
}

/**
 * Generate a random ID for files missing an ID.
 * Used as a fallback to ensure all files have unique IDs.
 * 
 * @returns Random string ID
 */
function generateRandomId(): string {
  return `file-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract and remove frontmatter from markdown content.
 * Supports YAML-style frontmatter between --- markers.
 * 
 * @param content - Raw markdown content
 * @returns Object with clean content and parsed metadata
 */
function extractFrontmatter(content: string): {
  cleanContent: string;
  metadata: FileMetadata;
} {
  if (!content) {
    return { cleanContent: "", metadata: {} };
  }

  const frontmatterRegex = /^---\s+([\s\S]*?)\s+---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { cleanContent: content, metadata: {} };
  }

  // Remove frontmatter from content
  const cleanContent = content.replace(frontmatterRegex, "").trim();

  // Parse frontmatter into metadata object
  const metadata: FileMetadata = {};
  const frontmatter = match[1];

  frontmatter.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(":").trim();

      // Try to convert numeric values or booleans
      if (/^\d+$/.test(value)) {
        metadata[key] = parseInt(value, 10);
      } else if (value === "true") {
        metadata[key] = true;
      } else if (value === "false") {
        metadata[key] = false;
      } else {
        metadata[key] = value;
      }
    }
  });

  return { cleanContent, metadata };
}

/**
 * Extract title from the first H1 heading in the content.
 * 
 * @param content - Markdown content
 * @returns Title text or null if no H1 heading found
 */
function extractTitle(content: string): string | null {
  if (!content) return null;
  const titleMatch = content.match(/^# (.*?)$/m);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Format a file ID into a readable title by converting
 * kebab-case to Title Case.
 * 
 * @param id - File ID (typically the filename without extension)
 * @returns Formatted title
 */
function formatTitle(id: string): string {
  if (!id) return "Untitled";
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Determine category information from file metadata or infer it from content.
 * Uses explicit metadata if available, otherwise tries to categorize based on filename.
 * 
 * @param metadata - File frontmatter metadata
 * @param id - File ID
 * @returns Category information: id, name, order, and optional fileOrder
 */
function determineCategoryInfo(
  metadata: FileMetadata,
  id: string
): {
  id: string;
  name: string;
  order: number;
  fileOrder?: number;
} {
  // If metadata contains category info, use it
  if (metadata.category) {
    return {
      id: metadata.category,
      name: metadata.categoryName || formatTitle(metadata.category),
      order: metadata.categoryOrder || inferCategoryOrder(metadata.category),
      fileOrder: metadata.order || 1,
    };
  }

  // Otherwise infer from filename
  return inferCategoryFromId(id);
}

/**
 * Helper function to infer category order from category ID.
 * Uses predefined priorities for known categories.
 * 
 * @param categoryId - Category identifier
 * @returns Numeric ordering value (lower appears first)
 */
function inferCategoryOrder(categoryId: string): number {
  if (!categoryId) return DEFAULT_CATEGORY_ORDER;
  return CATEGORY_PRIORITIES[categoryId] || DEFAULT_CATEGORY_ORDER;
}

/**
 * Infer category from file ID by looking for key terms in the filename.
 * This is a fallback when no explicit category is defined in frontmatter.
 * 
 * @param id - File ID (typically the filename without extension)
 * @returns Category information derived from the filename
 */
function inferCategoryFromId(id: string): {
  id: string;
  name: string;
  order: number;
  fileOrder?: number;
} {
  if (!id) {
    return {
      id: "uncategorized",
      name: "Uncategorized",
      order: DEFAULT_CATEGORY_ORDER,
    };
  }

  // Simple heuristic mapping based on filename patterns
  if (id.includes("fairness-metric") || id.includes("equalized-odds")) {
    return {
      id: "fairness-metrics",
      name: "Fairness Metrics",
      order: inferCategoryOrder("fairness-metrics"),
    };
  } else if (
    id.includes("justice") ||
    id.includes("participatory") ||
    id.includes("accountability")
  ) {
    return {
      id: "algorithmic-justice",
      name: "Algorithmic Justice",
      order: inferCategoryOrder("algorithmic-justice"),
    };
  } else if (
    id.includes("high-impact") ||
    id.includes("credit") ||
    id.includes("child")
  ) {
    return {
      id: "applications",
      name: "Applications",
      order: inferCategoryOrder("applications"),
    };
  } else {
    return {
      id: "algorithmic-fairness",
      name: "Algorithmic Fairness",
      order: inferCategoryOrder("algorithmic-fairness"),
    };
  }
}
