# SRC Handbook: Writing Guide for Socially Responsible Computing Primers

This comprehensive guide will help you create effective, accessible, and interactive Socially Responsible Computing (SRC) primers for our knowledge base. This guide is designed for contributors of all experience levels, including those who are new to Markdown.

## Table of Contents

1. [Introduction](#introduction)
2. [Style Guidelines](#style-guidelines)
3. [Basic Markdown Syntax](#basic-markdown-syntax)
4. [Interactive Button Features](#interactive-button-features)
5. [Creating Effective Content](#creating-effective-content)
6. [Best Practices](#best-practices)
7. [Examples and Templates](#examples-and-templates)
8. [Publishing Process](#publishing-process)

## Introduction

The SRC Handbook serves as a knowledge base for topics related to socially responsible computing, algorithmic fairness, and ethics in technology. Each primer should:

- Focus on a specific concept or topic
- Explain complex ideas in accessible language
- Include interactive elements for deeper exploration
- Follow our style guidelines for visual consistency

## Style Guidelines

Our style guide ensures visual consistency across all primers:

### Typography

- **Primary Headings (H1)**: Lora (bold), 36pt
  - Used for main page titles
  - Example: `# Main Title of the Primer`

- **Secondary Headings (H2)**: Lora (bold), 20pt
  - Used for major sections
  - Example: `## Major Section Title`

- **Body Text**: Inter, 16pt
  - Used for regular paragraph text

- **Definitions**: Inter (bold), 16pt
  - Used to highlight key terms
  - Example: `**Algorithmic fairness**`

- **Emphasis**: Inter (italic), 16pt
  - Used for emphasis or to highlight important points
  - Example: `*This concept is particularly important*`

### Content Structure

Each primer should follow this general structure:

1. **Title** (H1): Clear, descriptive title
2. **Introduction**: Brief overview of the topic (1-2 paragraphs)
3. **Main Sections** (H2): Logical divisions of content
4. **Subsections** (H3): When needed for clarity
5. **Related Topics**: Links to other relevant primers
6. **References**: When applicable

## Basic Markdown Syntax

If you're new to Markdown, here are the basics you'll need:

### Headings

```markdown
# Level 1 Heading (Primary: Lora bold, 36pt)
## Level 2 Heading (Secondary: Lora bold, 20pt)
### Level 3 Heading
#### Level 4 Heading
```

### Text Formatting

```markdown
Regular paragraph text (Tertiary: Inter, 16pt)

**Bold text for definitions** (Inter bold, 16pt)

*Italic text for emphasis* (Inter italic, 16pt)

`Code or technical terms`
```

### Lists

Unordered lists:
```markdown
- First item
- Second item
  - Nested item
  - Another nested item
- Third item
```

Ordered lists:
```markdown
1. First item
2. Second item
3. Third item
```

### Links

Standard links:
```markdown
[Link text](https://example.com)
```

### Images

```markdown
![Alt text for image](path/to/image.jpg "Optional title")
```

### Blockquotes

```markdown
> This is a blockquote
> It can span multiple lines
```

### Tables

```markdown
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

## Interactive Button Features

Our platform supports two types of interactive buttons that enhance the reading experience:

### 1. Navigation Buttons

Navigation buttons allow readers to move between different main content pages.

#### Syntax:
```markdown
[nav:Button Text](file-id)
```

#### Example:
```markdown
[nav:Introduction to Fairness](intro-fairness)
```

This creates a **teal button** that loads a different main content file when clicked.

### 2. Sidebar Buttons

Sidebar buttons open supplementary content in a side drawer without navigating away from the current page.

#### Syntax:
```markdown
[sidebar:Button Text](file-id)
```

#### Example:
```markdown
[sidebar:See Definition](algorithmic-fairness)
```

This creates a **blue button** that opens related content in a side drawer when clicked.

### Using Buttons in Context

#### Within Paragraphs:

```markdown
Algorithmic fairness [sidebar:See Definition](fairness-definition) refers to the absence of bias in automated decision-making systems.
```

#### In Lists:

```markdown
- **Demographic Parity**: [sidebar:See Formula](demographic-parity) Ensures equal selection rates across groups
- **Equal Opportunity**: [sidebar:See Formula](equal-opportunity) Ensures equal true positive rates
```

#### Sequential Navigation:

```markdown
## Next Steps

Continue to [nav:Measuring Fairness](measuring-fairness) or learn about [nav:Bias Mitigation](bias-mitigation).
```

### Important Rules for Buttons

1. **File References**: 
   - Navigation buttons reference files in `/src/markdown/main_files/`
   - Sidebar buttons reference files in `/src/markdown/drawer_files/`

2. **No Spaces in Prefixes**:
   - Correct: `[nav:Button Text]`
   - Incorrect: `[nav: Button Text]`

3. **File IDs**:
   - Don't include the `.md` extension
   - Use the exact filename (case-sensitive)
   - Example: For file `algorithmic-fairness.md`, use `algorithmic-fairness`

## Creating Effective Content

### Defining Terms

When introducing technical terms:

```markdown
**Procedural Equality**: Everyone is subject to the same decision-making process. [sidebar:See Example](procedural-equality-example)
```

### Explaining Concepts

When explaining complex concepts:

```markdown
## Procedural Equality vs. Equity

One common criteria for fairness within the technical community is procedural equality.

**Procedural Equality**: Everyone is subject to the same decision-making process.

For example, ATS, or applicant tracking systems, are automated decision-making systems that employers use to screen resumes for hiring. Procedural equality is achieved when the system runs every application in the same way.

However, *decision-making does not happen in a vacuum*. Rather, it exists within a societal context of [sidebar:systems of oppression](oppression-systems) such as racism and sexism that result in inequalities.
```

### Creating Comparisons

For comparing related concepts:

```markdown
| Approach | Focus | Limitations |
|----------|-------|-------------|
| Procedural Equality | Same process for all | Ignores existing inequities |
| Equity | Adjusts for differences | May require additional resources |
```

## Best Practices

### Content Organization

1. **Use Clear Headings**: Structure content with descriptive headings that follow the heading hierarchy (H1 → H2 → H3)

2. **Keep Paragraphs Concise**: Aim for 3-5 sentences per paragraph for readability

3. **Use Lists and Tables**: Break down complex information into lists and tables

4. **Add Visual Breaks**: Use horizontal rules (`---`) to separate major sections

### Interactive Elements

1. **Navigation Buttons**: 
   - Use at the end of sections to guide the reading flow
   - Example: `Continue to [nav:Next Section](next-section)`

2. **Sidebar Buttons**:
   - Keep sidebar content focused and concise
   - Use for definitions, examples, and supplementary information
   - Example: `[sidebar:See Example](example-id)`

### Accessibility

1. **Descriptive Button Text**:
   - Good: `[nav:Learn about fairness metrics](fairness-metrics)`
   - Avoid: `[nav:Click here](fairness-metrics)`

2. **Image Descriptions**:
   - Always include descriptive alt text for images
   - Example: `![Bar chart comparing demographic parity across algorithms](chart.png)`

3. **Heading Hierarchy**:
   - Don't skip heading levels (e.g., don't go from H2 to H4)
   - Start with H1 and use consecutive levels

## Examples and Templates

### Example 1: Basic Concept Primer

```markdown
# Algorithmic Fairness

## Introduction

Algorithmic fairness refers to the absence of bias or discrimination in automated decision-making systems. As algorithms increasingly influence high-stakes decisions, ensuring their fairness becomes critical.

## Why Algorithmic Fairness Matters

When machines replace humans in [sidebar:making decisions](automated-decisions), it is important for their outcomes to remain fair and just. But what is algorithmic fairness and justice?

## Types of Fairness

There are several types of fairness measures:

- **Individual Fairness**: [sidebar:See Definition](individual-fairness) Similar individuals receive similar outcomes
- **Group Fairness**: [sidebar:See Definition](group-fairness) Groups receive equitable treatment
- **Procedural Fairness**: [sidebar:See Definition](procedural-fairness) Fair decision-making process

## Next Steps

Continue to [nav:Fairness Metrics](fairness-metrics) or learn about [nav:Bias Mitigation](bias-mitigation).
```

### Example 2: Supplementary Drawer Content

This would be placed in the `/drawer_files/` directory:

```markdown
# Individual Fairness

Individual fairness is a fairness criterion that states:

**Similar individuals should receive similar outcomes.**

## Mathematical Definition

Formally, for a decision function f, distance metrics d_X and d_Y, and individuals x and z:

```
d_Y(f(x), f(z)) ≤ d_X(x, z)
```

This means the difference in outcomes should be no greater than the difference between individuals.

## Limitations

- Requires defining similarity metrics
- May not address structural inequalities
- Can conflict with group fairness notions
```

## Publishing Process

1. **Prepare Your Files**:
   - Main content files go in `/src/markdown/main_files/`
   - Drawer content files go in `/src/markdown/drawer_files/`
   - Use descriptive filenames with kebab-case (e.g., `algorithmic-fairness.md`)

2. **Add Frontmatter** (optional):
   ```markdown
   ---
   title: Algorithmic Fairness
   category: core-concepts
   order: 2
   ---
   ```

3. **Test Your Content**:
   - Verify all links and buttons work correctly
   - Check formatting on both desktop and mobile views
   - Ensure all images display properly

4. **Submit for Review**:
   - Follow the standard pull request process
   - Address any feedback from reviewers

---

By following this guide, you'll create high-quality, interactive SRC primers that effectively communicate complex concepts while maintaining consistency with our style guidelines. If you have questions or need assistance, please contact the editorial team. 