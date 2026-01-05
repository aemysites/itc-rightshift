/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract only the content nodes from a column (no outer layout divs)
  function extractContent(col) {
    if (!col) return '';
    // Find the main content container inside the column
    // For main: .blog-details .content-wrapper.blog-description
    // For sidebar: .related-articles
    const mainContent = col.querySelector('.blog-details .content-wrapper.blog-description');
    if (mainContent) {
      return Array.from(mainContent.childNodes);
    }
    const related = col.querySelector('.related-articles');
    if (related) {
      return [related];
    }
    // Fallback: all children
    return Array.from(col.childNodes);
  }

  // Find the main row
  const row = element.querySelector('.row.section-wrapper');
  if (!row) return;
  // Get all direct children with col-lg-8 or col-lg-4
  const cols = Array.from(row.children).filter(
    (col) => col.classList.contains('col-lg-8') || col.classList.contains('col-lg-4')
  );
  if (cols.length < 2) return;

  // Extract content for each column
  const leftContent = extractContent(cols[0]);
  const rightContent = extractContent(cols[1]);

  // Table structure: header row, then columns row
  const cells = [
    ['Columns (columns2)'], // header row
    [leftContent, rightContent] // columns row
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
