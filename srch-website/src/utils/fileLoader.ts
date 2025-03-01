import { MarkdownFile, Category } from "@/context/MarkdownContext";

// This function loads all markdown files from the filesystem
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
        const content = (module as any).default as string;
        const id = path.split("/").pop()?.replace(".md", "") || "";

        // Extract and remove frontmatter
        const { cleanContent, metadata } = extractFrontmatter(content);

        // Get title from first heading or use filename
        const title = extractTitle(cleanContent) || formatTitle(id);

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
          type: "main" as const,
          order: metadata.order || categoryInfo.fileOrder || 1,
        };
      })
    );

    // Process drawer files
    const drawerFiles: MarkdownFile[] = await Promise.all(
      Object.entries(drawerFilesModules).map(async ([path, module]) => {
        const content = (module as any).default as string;
        const id = path.split("/").pop()?.replace(".md", "") || "";

        // Extract and remove frontmatter
        const { cleanContent, metadata } = extractFrontmatter(content);

        // Get title from first heading or use filename
        const title = extractTitle(cleanContent) || formatTitle(id);

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
          type: "drawer" as const,
          order: metadata.order || categoryInfo.fileOrder || 1,
        };
      })
    );

    // Convert categories map to sorted array
    const categories = Array.from(categoriesMap.values()).sort(
      (a, b) => a.order - b.order
    );

    return {
      mainFiles: mainFiles.sort((a, b) => a.order! - b.order!),
      drawerFiles: drawerFiles.sort((a, b) => a.order! - b.order!),
      categories,
    };
  } catch (error) {
    console.error("Error loading markdown files:", error);
    return { mainFiles: [], drawerFiles: [], categories: [] };
  }
}

// Helper function to extract and remove frontmatter
function extractFrontmatter(content: string): {
  cleanContent: string;
  metadata: Record<string, any>;
} {
  const frontmatterRegex = /^---\s+([\s\S]*?)\s+---/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { cleanContent: content, metadata: {} };
  }

  // Remove frontmatter from content
  const cleanContent = content.replace(frontmatterRegex, "").trim();

  // Parse frontmatter into metadata object
  const metadata: Record<string, any> = {};
  const frontmatter = match[1];

  frontmatter.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(":").trim();

      // Try to convert numeric values
      if (/^\d+$/.test(value)) {
        metadata[key] = parseInt(value, 10);
      } else {
        metadata[key] = value;
      }
    }
  });

  return { cleanContent, metadata };
}

// Helper function to extract title from the first H1 heading
function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^# (.*?)$/m);
  return titleMatch ? titleMatch[1] : null;
}

// Helper function to format a file ID into a readable title
function formatTitle(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper function to determine category information from metadata or infer it
function determineCategoryInfo(
  metadata: Record<string, any>,
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

// Helper function to infer category order
function inferCategoryOrder(categoryId: string): number {
  // Define a priority order for common categories
  const priorityOrder: Record<string, number> = {
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

  return priorityOrder[categoryId] || 100; // Default to high number if unknown
}

// Helper function to infer category from file ID
function inferCategoryFromId(id: string): {
  id: string;
  name: string;
  order: number;
  fileOrder?: number;
} {
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
