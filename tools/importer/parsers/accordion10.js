/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left column containing the FAQ accordion
  const leftCol = element.querySelector('.col-md-6.col-12.px-md-0');
  if (!leftCol) return;

  // Find the accordion container
  const accordion = leftCol.querySelector('.accordion');
  if (!accordion) return;

  // Get all accordion items (cards)
  const cards = accordion.querySelectorAll('.card');
  if (!cards.length) return;

  // Prepare the rows array for the block table
  const rows = [];

  // Header row (must match block name exactly)
  rows.push(['Accordion (accordion10)']);

  // For each card, extract the title and content
  cards.forEach(card => {
    // Title: the button inside .card-header
    const header = card.querySelector('.card-header button');
    let titleCell = '';
    if (header) {
      // Clone the button's child nodes except the arrow image
      const titleFrag = document.createDocumentFragment();
      Array.from(header.childNodes).forEach(node => {
        if (!(node.tagName === 'IMG')) {
          titleFrag.appendChild(node.cloneNode(true));
        }
      });
      titleCell = titleFrag.childNodes.length ? titleFrag : header.textContent.trim();
    }

    // Content: the .card-body inside the collapse
    const collapse = card.querySelector('.collapse');
    let contentCell = '';
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        // Use the body element's children directly (not the wrapper div)
        const frag = document.createDocumentFragment();
        Array.from(body.childNodes).forEach(node => {
          frag.appendChild(node.cloneNode(true));
        });
        contentCell = frag.childNodes.length ? frag : body.textContent.trim();
      }
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
