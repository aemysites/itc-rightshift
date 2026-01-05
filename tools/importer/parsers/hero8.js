/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero8)'];

  // 2. Extract BOTH images (desktop and mobile)
  const container = element.querySelector('.container');
  let images = [];
  if (container) {
    images = Array.from(container.querySelectorAll('img'));
  }
  const imageCell = images.length ? images : [''];

  // 3. Extract ALL text content from the container (not just .text-wrapper)
  // If no non-empty elements, use an empty string
  let textContent = '';
  if (container) {
    // Collect all non-empty text from all descendants except images
    textContent = Array.from(container.querySelectorAll('*:not(img)'))
      .map(el => el.textContent.trim())
      .filter(Boolean)
      .join(' ');
  }
  const textCell = textContent ? textContent : '';

  // 4. Build the table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // 5. Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
