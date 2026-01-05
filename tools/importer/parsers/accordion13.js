/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find the accordion container
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Get all accordion items (cards)
  const cards = accordion.querySelectorAll('.card');
  cards.forEach(card => {
    // Title: find the button inside the card header
    const header = card.querySelector('.card-header');
    let titleText = '';
    if (header) {
      const btn = header.querySelector('button');
      if (btn) {
        // Remove arrow image and get only text content
        const arrow = btn.querySelector('img');
        if (arrow) arrow.remove();
        titleText = btn.textContent.trim();
      } else {
        // fallback to h3 or header text
        const h3 = header.querySelector('h3');
        if (h3) {
          titleText = h3.textContent.trim();
        } else {
          titleText = header.textContent.trim();
        }
      }
    }

    // Content: find the card-body
    const body = card.querySelector('.card-body');
    let contentEls = [];
    if (body) {
      // Get all direct children (preserve paragraphs, lists, etc.)
      contentEls = Array.from(body.childNodes).filter(node => {
        // Only keep Elements or non-empty text nodes
        return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
      });
    }

    // Add this accordion item as a row: [title, content]
    rows.push([
      titleText,
      contentEls.length === 1 ? contentEls[0] : contentEls
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
