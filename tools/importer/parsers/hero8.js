/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero8) block: 1 column, 3 rows
  // Row 1: Header
  // Row 2: Background image(s)
  // Row 3: All text content from the original HTML (including alt attributes)

  // 1. Header row
  const headerRow = ['Hero (hero8)'];

  // 2. Image row
  // Collect all images (desktop and mobile)
  const imgs = Array.from(element.querySelectorAll('img'));
  const imageRow = [imgs.length ? imgs : ['']];

  // 3. Content row
  // Extract all text content from the HTML, including alt attributes
  let content = '';

  // Add all visible text from the element (including headings, paragraphs, divs, spans, etc.)
  // Use a less specific selector to get all text nodes
  function collectText(node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent.trim();
        if (text) {
          content += (content ? '\n' : '') + text;
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        collectText(child);
      }
    });
  }
  collectText(element);

  // Add alt text from all images (if not already included)
  imgs.forEach(img => {
    if (img.alt && img.alt.trim() && !content.includes(img.alt.trim())) {
      content += (content ? '\n' : '') + img.alt.trim();
    }
  });

  // Defensive: If no content, add empty string
  if (!content) {
    content = '';
  }
  const contentRow = [content];

  // Assemble table
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
