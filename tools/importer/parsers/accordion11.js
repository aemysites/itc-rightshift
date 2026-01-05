/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion container
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all accordion items (cards)
  const cards = accordion.querySelectorAll('.card');
  const rows = [];

  // Header row as required by the block spec
  rows.push(['Accordion (accordion11)']);

  cards.forEach(card => {
    // Title extraction: from the button inside .card-header
    let title = '';
    const header = card.querySelector('.card-header');
    if (header) {
      const btn = header.querySelector('button');
      if (btn) {
        // Remove arrow icon (img) if present
        const btnClone = btn.cloneNode(true);
        btnClone.querySelectorAll('img').forEach(img => img.remove());
        title = btnClone.textContent.trim();
      }
    }

    // Content extraction: from .card-body inside .collapse
    let contentCell = '';
    const collapse = card.querySelector('.collapse');
    if (collapse) {
      const body = collapse.querySelector('.card-body');
      if (body) {
        // Remove screen-reader-only spans from links
        body.querySelectorAll('.cmp-link__screen-reader-only').forEach(el => el.remove());
        // Use all child nodes to preserve structure (lists, paragraphs, etc)
        contentCell = Array.from(body.childNodes);
      }
    }

    rows.push([
      title || '',
      contentCell && contentCell.length ? contentCell : ''
    ]);
  });

  // Create the accordion table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
