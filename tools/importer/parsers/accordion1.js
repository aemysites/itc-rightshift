/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion1)'];
  const rows = [headerRow];

  // Find the accordion container
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all accordion items (cards)
  const cards = accordion.querySelectorAll('.card');
  cards.forEach(card => {
    // Title: get the button inside the card-header
    const header = card.querySelector('.card-header button');
    let titleContent = '';
    if (header) {
      // Clone the button, remove the arrow image, and get the inner HTML
      const btnClone = header.cloneNode(true);
      const arrow = btnClone.querySelector('img');
      if (arrow) arrow.remove();
      titleContent = btnClone.innerHTML.trim();
    }
    // Create a div for the title to preserve formatting
    const titleDiv = document.createElement('div');
    titleDiv.innerHTML = titleContent;

    // Content: get the .card-body
    const body = card.querySelector('.card-body');
    let contentDiv = document.createElement('div');
    if (body) {
      // Move all children of card-body into contentDiv
      Array.from(body.childNodes).forEach(node => {
        contentDiv.appendChild(node.cloneNode(true));
      });
    }
    rows.push([titleDiv, contentDiv]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
