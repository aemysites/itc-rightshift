/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList.contains(className));
  }

  // Find the main row with two columns
  const row = element.querySelector('.row.section-wrapper');
  if (!row) return;

  // Find left and right columns
  const leftCol = getChildByClass(row, 'rich-foods-wrapper');
  const rightCol = getChildByClass(row, 'article-wrapper');
  if (!leftCol || !rightCol) return;

  // In left column, find the main article content
  let mainContent;
  // Prefer .blog-details if present
  const details = leftCol.querySelector('.blog-details');
  if (details) {
    mainContent = details;
  } else {
    // fallback: first .content-wrapper or leftCol itself
    mainContent = leftCol;
  }

  // In right column, find the related articles block
  let relatedArticles = rightCol.querySelector('.related-articles');
  if (!relatedArticles) {
    // fallback: use rightCol itself
    relatedArticles = rightCol;
  }

  // Columns2 block header row
  const headerRow = ['Columns (columns2)'];
  // Content row: left and right columns
  const contentRow = [mainContent, relatedArticles];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
