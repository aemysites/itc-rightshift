/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero9)
  const headerRow = ['Hero (hero9)'];

  // --- IMAGE ROW ---
  // Find the main hero image (prefer desktop, fallback to mobile if needed)
  let image = null;
  const container = element.querySelector('.container');
  if (container) {
    image = container.querySelector('img.d-md-block');
    if (!image) image = container.querySelector('img');
  }
  // Create an image element for the cell
  let imageCell = '';
  if (image) {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt || '';
    imageCell = img;
  }
  const imageRow = [imageCell];

  // --- TEXT ROW ---
  // Extract breadcrumb text content from .cmp-breadcrumb__list
  let breadcrumbText = '';
  const breadcrumbList = element.querySelector('.cmp-breadcrumb__list');
  if (breadcrumbList) {
    const items = breadcrumbList.querySelectorAll('.cmp-breadcrumb__item');
    breadcrumbText = Array.from(items).map(item => {
      const nameSpan = item.querySelector('[itemprop="name"]');
      return nameSpan ? nameSpan.textContent.trim() : '';
    }).filter(Boolean).join(' > ');
  }
  // Fallback: Try to get all text from .cmp-breadcrumb if breadcrumbList is missing
  if (!breadcrumbText) {
    const breadcrumb = element.querySelector('.cmp-breadcrumb');
    if (breadcrumb) {
      breadcrumbText = breadcrumb.textContent.trim();
    }
  }
  const textRow = [breadcrumbText || ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create the table block and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
