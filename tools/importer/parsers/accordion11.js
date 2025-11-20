/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion11)'];
  const rows = [headerRow];

  // Find the accordion container
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Get all accordion items (cards)
  const cards = accordion.querySelectorAll('.card');

  // For each card, extract title and content
  cards.forEach(card => {
    // Title: usually inside button in card-header
    const headerBtn = card.querySelector('.card-header button');
    let titleCell;
    if (headerBtn) {
      // Clone the button, remove images (arrow icons)
      const btnClone = headerBtn.cloneNode(true);
      btnClone.querySelectorAll('img').forEach(img => img.remove());
      // Use innerHTML to preserve formatting (bold, links, etc.)
      titleCell = document.createElement('div');
      titleCell.innerHTML = btnClone.innerHTML.trim();
    } else {
      // Fallback: use header text
      const h3 = card.querySelector('.card-header h3');
      titleCell = document.createElement('div');
      titleCell.textContent = h3 ? h3.textContent.trim() : '';
    }

    // Content: inside .card-body
    const body = card.querySelector('.card-body');
    let contentCell = document.createElement('div');
    if (body) {
      Array.from(body.childNodes).forEach(node => {
        contentCell.appendChild(node.cloneNode(true));
      });
    }
    rows.push([titleCell, contentCell]);
  });

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
