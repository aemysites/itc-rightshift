/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Find the accordion container
  const accordion = element.querySelector('.accordion');
  if (!accordion) {
    // Defensive: If not found, do nothing
    return;
  }

  // Get all accordion items (cards)
  const cards = accordion.querySelectorAll(':scope > .card');
  cards.forEach((card) => {
    // Title cell: Find the button inside the card-header
    const cardHeader = card.querySelector('.card-header');
    let titleEl = null;
    if (cardHeader) {
      // The button contains the title and the arrow image
      const btn = cardHeader.querySelector('button');
      if (btn) {
        // Clone the button, but remove the arrow image for clarity
        const btnClone = btn.cloneNode(true);
        const arrow = btnClone.querySelector('img');
        if (arrow) arrow.remove();
        titleEl = document.createElement('div');
        // Use only the text content for the title
        titleEl.textContent = btnClone.textContent.trim();
      } else {
        // Fallback: Use text content of cardHeader
        titleEl = document.createElement('div');
        titleEl.textContent = cardHeader.textContent.trim();
      }
    }

    // Content cell: Find the card-body inside the collapse div
    let contentEl = null;
    const collapse = card.querySelector('[class*="collapse"]');
    if (collapse) {
      const cardBody = collapse.querySelector('.card-body');
      if (cardBody) {
        // Use the card-body directly (reference, don't clone)
        contentEl = cardBody;
      } else {
        // Fallback: Use collapse content
        contentEl = document.createElement('div');
        contentEl.innerHTML = collapse.innerHTML;
      }
    }

    // Add row if both title and content are present
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  });

  // Add the FAQs heading as a separate row as the first accordion item
  const faqsTitle = element.querySelector('.faqs-title');
  if (faqsTitle && faqsTitle.textContent.trim()) {
    // Insert as first data row after header
    rows.splice(1, 0, [faqsTitle.textContent.trim(), '']);
  }

  // Add the food image from the right column as a separate row (second column only)
  const rightCol = element.querySelector('.col-md-6.col-12:not(.px-md-0)');
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) {
      rows.push(['', img]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
