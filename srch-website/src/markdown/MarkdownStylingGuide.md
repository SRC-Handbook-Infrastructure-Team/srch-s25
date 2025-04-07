# Markdown Styling Guide

This guide explains how to format content for the SRC Handbook using Markdown, including our custom syntax for navigation and drawer links.

## File Organization

The SRC Handbook content is organized into two types of Markdown files:

1. **Main Files**: Content displayed as main pages
   - Stored in: `/src/markdown/main_files/`
   - Example: `fairness.md`, `data-ai.md`
   - Each main file becomes a section in the sidebar navigation

2. **Drawer Files**: Additional content displayed in side drawers
   - Stored in: `/src/markdown/drawer_files/`
   - Example: `individual-fairness.md`, `group-fairness.md`
   - Referenced from main files using custom drawer links

### Naming Conventions

- Use kebab-case for filenames (lowercase words separated by hyphens)
- Make names descriptive but concise
- Don't include spaces or special characters
- Don't include the `.md` extension when referencing files in links

## Basic Markdown Syntax

### Headings

```markdown
# Main Heading (H1)
## Section Heading (H2)
### Subsection Heading (H3)
#### Minor Heading (H4)
```

**Important**: Each main file must start with a single `# Heading` that becomes its title in the navigation.

### Text Formatting

```markdown
Regular paragraph text

**Bold text** for definitions and emphasis

*Italic text* for emphasis or terms

`Code` for technical terms or inline code
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

Standard Markdown links:
```markdown
[Link text](https://example.com)
```

## Custom Link Types

Our system supports two special types of links:

### 1. Drawer Links

Drawer links open additional content in a side drawer without navigating away from the current page.

```markdown
[drawer:Button Text](filename-without-extension)
```

Examples:
```markdown
[drawer:See Definition](individual-fairness)
[drawer:View Example](procedural-equality-example)
```

These will be displayed as blue buttons that open the referenced drawer file.

### 2. Navigation Links

Navigation links take the user to a different main content page.

```markdown
[nav:Button Text](filename-without-extension)
```

Examples:
```markdown
[nav:Data & AI](data-ai)
[nav:Continue to Communication](communication)
```

These will be displayed as teal buttons that navigate to the specified main file.

## Section Organization

### Main File Structure

Each main file should follow this structure:

1. Start with a single H1 heading (title)
2. Introduction paragraph
3. Multiple H2 sections
4. End with navigation links to related content

Example:
```markdown
# Fairness & Justice

Introduction paragraph about fairness and justice in AI systems.

## Procedural Equality vs. Equity

Content about procedural equality...

## Types of Fairness

Content about types of fairness...

Continue to [nav:Data & AI](data-ai) or learn about [nav:Communication](communication).
```

### Drawer File Structure

Drawer files should be concise and focused on a single topic:

1. Start with a single H1 heading (title)
2. Brief explanation
3. Optional H2 sections for additional detail
4. Keep content focused and supplementary

Example:
```markdown
# Individual Fairness

Individual fairness means similar individuals receive similar outcomes.

## Mathematical Definition

Formal definition details...

## Limitations

Content about limitations...
```

## Best Practices

1. **Keep Content Modular**: Break down complex topics into main files with supplementary drawer files

2. **Use Consistent Heading Levels**: Don't skip heading levels (e.g., don't go from H2 to H4)

3. **Navigation Flow**: 
   - Use drawer links for definitions, examples, and supplementary information
   - Use navigation links for continuing to new topics

4. **Subsections**: 
   - H2 headings become automatically listed as subsections in the sidebar
   - Keep H2 headings concise and descriptive

5. **Images**: 
   - Store images in `/src/assets/` directory
   - Reference with standard Markdown: `![Alt text](/path/to/image.jpg)`

6. **Code Blocks**:
   ```markdown
   ```language
   code here
   ```
   ```

## Examples

### Main File Example

```markdown
# Data & AI: Accuracy, Fairness, Justice

Data and AI systems are increasingly used to make important decisions. Understanding their accuracy, fairness, and justice implications is crucial.

## Accuracy vs. Fairness

When designing AI systems, there is often a tension between maximizing accuracy and ensuring fairness. [drawer:See Tradeoffs](accuracy-fairness-tradeoff)

**Accuracy**: How often the system makes correct predictions.

**Fairness**: How equitably the system treats different groups.

## Bias in Data

Data used to train AI systems often contains biases that get amplified:

- **Selection Bias**: [drawer:Learn More](selection-bias) When data collection is not representative
- **Measurement Bias**: [drawer:Learn More](measurement-bias) When measurements systematically differ across groups

Continue to [nav:Fairness & Justice](fairness) or learn about [nav:Communication](communication).
```

### Drawer File Example

```markdown
# Group Fairness

Group fairness refers to fairness measures that ensure different demographic groups receive equitable treatment.

## Key Concepts

Group fairness typically looks at statistical measures across protected groups such as:

- Race
- Gender
- Age
- Disability status

## Common Metrics

There are several metrics used to measure group fairness:

1. **Demographic Parity**: The proportion of positive decisions should be equal across groups.
2. **Equal Opportunity**: True positive rates should be equal across groups.
```

Remember that well-structured content with proper use of custom links will create a better experience for users navigating the handbook. 