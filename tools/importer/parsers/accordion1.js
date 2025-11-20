/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left column containing the accordion
  const accordionCol = Array.from(element.querySelectorAll(':scope section .row > div')).find(
    col => col.querySelector('.accordion')
  );
  if (!accordionCol) return;

  const accordion = accordionCol.querySelector('.accordion');
  if (!accordion) return;

  // Get all accordion items (cards)
  const cards = Array.from(accordion.querySelectorAll(':scope > .card'));
  if (!cards.length) return;

  // Block header row as per spec
  const headerRow = ['Accordion (accordion1)'];
  const rows = [headerRow];

  // For each card, extract title and content
  cards.forEach(card => {
    // Title cell: Find the button inside card-header
    const cardHeader = card.querySelector('.card-header');
    let titleText = '';
    if (cardHeader) {
      const btn = cardHeader.querySelector('button');
      if (btn) {
        // Only get the question text, not the chevron image
        titleText = btn.childNodes[0].textContent.trim();
      } else {
        const h3 = cardHeader.querySelector('h3');
        if (h3) {
          titleText = h3.textContent.trim();
        } else {
          titleText = cardHeader.textContent.trim();
        }
      }
    }
    const titleEl = document.createElement('span');
    titleEl.textContent = titleText;

    // Content cell: Find the card-body
    const cardBody = card.querySelector('.card-body');
    let contentEl = null;
    if (cardBody) {
      if (cardBody.children.length === 1) {
        contentEl = cardBody.firstElementChild;
      } else {
        const frag = document.createDocumentFragment();
        Array.from(cardBody.children).forEach(child => frag.appendChild(child));
        contentEl = frag;
      }
    } else {
      contentEl = document.createElement('span');
      contentEl.textContent = '';
    }

    rows.push([titleEl, contentEl]);
  });

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
