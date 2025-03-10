# Custom Syntax Example

This is an example of content that appears in the side drawer when a user clicks a sidebar button. Drawer content should be concise and focused on a single topic.

## Formatting in Drawer Content

Drawer content supports all the same markdown formatting as main content:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- `Code snippets` for technical terms
- Lists for organized information

## Code Examples

```javascript
// You can include code blocks
function example() {
  return "This is a code example";
}
```

## Images

You can include images, but keep them small to fit in the drawer:

![Small example image](https://via.placeholder.com/300x150)

## Best Practices for Drawer Content

1. **Keep it concise** - Drawer content should be supplementary
2. **Focus on one topic** - Each drawer file should cover a single concept
3. **Use clear headings** - Help users scan the content quickly
4. **Include visual elements** - When helpful, but sized appropriately
5. **Link sparingly** - Avoid too many links that might lead users away

---

Drawer content can be referenced from any main content file using the sidebar button syntax:

```markdown
[sidebar:See Example](custom-syntax-example)
``` 