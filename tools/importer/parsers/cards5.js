/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Cards (cards5) block
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  // --- 0. Extract heading and description as a card ---
  const leftCol = element.querySelector('.col-md-6');
  if (leftCol) {
    const contentDiv = document.createElement('div');
    // Heading
    const h2 = leftCol.querySelector('h2');
    if (h2) contentDiv.appendChild(h2.cloneNode(true));
    // All <p> elements with non-empty text
    leftCol.querySelectorAll('p').forEach(p => {
      if (p.textContent.trim()) {
        contentDiv.appendChild(p.cloneNode(true));
      }
    });
    if (contentDiv.childNodes.length > 0) {
      // Use a visually empty span as placeholder for image cell
      const placeholder = document.createElement('span');
      placeholder.textContent = '\u200B'; // zero-width space
      rows.push([
        placeholder,
        contentDiv
      ]);
    }
  }

  // --- 1. Extract feature icons as cards ---
  const featureCol = element.querySelector('.col-md-6.text-center');
  if (featureCol) {
    featureCol.querySelectorAll('div').forEach(featureDiv => {
      const img = featureDiv.querySelector('img');
      const label = featureDiv.querySelector('p');
      if (img && label) {
        const textDiv = document.createElement('div');
        textDiv.appendChild(label.cloneNode(true));
        rows.push([
          img,
          textDiv
        ]);
      }
    });
  }

  // --- 2. Extract product cards ---
  const cardContainer = element.querySelector('.recommended-products .items');
  if (cardContainer) {
    const cardEls = cardContainer.querySelectorAll('.card');
    cardEls.forEach(card => {
      const img = card.querySelector('img');
      const content = document.createElement('div');
      const title = card.querySelector('.card-slider-content h6');
      if (title) content.appendChild(title.cloneNode(true));
      const desc = card.querySelector('.card-slider-content p');
      if (desc) content.appendChild(desc.cloneNode(true));
      const price = card.querySelector('.card-slider-content h5');
      if (price) content.appendChild(price.cloneNode(true));
      const cta = card.querySelector('.card-header .btn-wrapper a');
      if (cta) content.appendChild(cta.cloneNode(true));
      rows.push([
        img,
        content
      ]);
    });
  }

  // --- Create and replace block table ---
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
