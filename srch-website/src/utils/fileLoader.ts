import { MarkdownFile, Category } from "@/context/MarkdownContext";

// Constants for improved code organization
const DEFAULT_CATEGORY_ORDER = 100;
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

// Interface for frontmatter metadata
interface FileMetadata {
  category?: string;
  categoryName?: string;
  categoryOrder?: number;
  order?: number;
  title?: string;
  [key: string]: any;
}

/**
 * Loads all markdown files from the filesystem
 * @returns Promise with main files, drawer files, and categories
 */
export async function loadMarkdownFiles(): Promise<{
  mainFiles: MarkdownFile[];
  drawerFiles: MarkdownFile[];
  categories: Category[];
}> {
  try {
    // Dynamically import all markdown files from their respective directories
    const mainFilesModules = import.meta.glob("/src/markdown/main_files/*.md", {
      eager: true,
    });
    const drawerFilesModules = import.meta.glob(
      "/src/markdown/drawer_files/*.md",
      { eager: true }
    );

    // Track unique categories found in the files
    const categoriesMap = new Map<string, Category>();

    // Process main files
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

    // Process drawer files
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

    // Remove null/undefined entries and sort files
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
 * Process a single markdown file and extract its content and metadata
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
 * Creates an error placeholder file when a file fails to load
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
 * Generate a random ID for files missing an ID
 */
function generateRandomId(): string {
  return `file-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper function to extract and remove frontmatter
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

      // Try to convert numeric values
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
 * Helper function to extract title from the first H1 heading
 */
function extractTitle(content: string): string | null {
  if (!content) return null;
  const titleMatch = content.match(/^# (.*?)$/m);
  return titleMatch ? titleMatch[1] : null;
}

/**
 * Helper function to format a file ID into a readable title
 */
function formatTitle(id: string): string {
  if (!id) return "Untitled";
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Helper function to determine category information from metadata or infer it
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
 * Helper function to infer category order
 */
function inferCategoryOrder(categoryId: string): number {
  if (!categoryId) return DEFAULT_CATEGORY_ORDER;
  return CATEGORY_PRIORITIES[categoryId] || DEFAULT_CATEGORY_ORDER;
}

/**
 * Helper function to infer category from file ID
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

  // Simple mapping based on filename
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
