/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards5)'];

  // --- Extract heading and subheading as a card row ---
  const leftCol = element.querySelector('.product-slider-detail-row .col-md-6:not(.text-center)');
  let headingRow = null;
  if (leftCol) {
    const textCell = document.createElement('div');
    const heading = leftCol.querySelector('h2');
    if (heading) textCell.appendChild(heading.cloneNode(true));
    const paragraphs = leftCol.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (p.textContent.trim()) textCell.appendChild(p.cloneNode(true));
    });
    headingRow = [null, textCell];
  }

  // --- Extract feature badges as individual cards (image + label only) ---
  const rightCol = element.querySelector('.product-slider-detail-row .col-md-6.text-center');
  const badgeDivs = rightCol ? Array.from(rightCol.children) : [];
  const badgeRows = badgeDivs.map(badge => {
    const img = badge.querySelector('img');
    const label = badge.querySelector('p');
    const textCell = document.createElement('div');
    if (label) textCell.appendChild(label.cloneNode(true));
    return [img, textCell];
  });

  // --- Extract product cards ---
  const cardsContainer = element.querySelector('.recommended-products .items');
  const cardEls = cardsContainer ? Array.from(cardsContainer.children) : [];
  const cardRows = cardEls.map(cardEl => {
    // Image (mandatory)
    const img = cardEl.querySelector('.card-header img');
    // Title (optional)
    const title = cardEl.querySelector('.card-slider-content h6');
    // Description (optional)
    const desc = cardEl.querySelector('.card-slider-content p');
    // Price (optional)
    const price = cardEl.querySelector('.card-slider-content h5');
    // CTA (optional)
    const cta = cardEl.querySelector('.btn-wrapper a');
    // Compose text cell (title, description, price, CTA)
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title.cloneNode(true));
    if (desc) {
      // Normalize &nbsp; in description
      const cleanDesc = desc.cloneNode(true);
      cleanDesc.innerHTML = cleanDesc.innerHTML.replace(/&nbsp;/g, ' ');
      textCell.appendChild(cleanDesc);
    }
    if (price) textCell.appendChild(price.cloneNode(true));
    if (cta) textCell.appendChild(cta.cloneNode(true));
    return [img, textCell];
  });

  // Build table
  const rows = [headerRow];
  if (headingRow) rows.push(headingRow);
  rows.push(...badgeRows);
  rows.push(...cardRows);
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
