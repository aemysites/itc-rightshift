/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards7) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // Find the cards container: look for <ul> with <li class="product-icon">
  const ul = element.querySelector('ul');
  if (ul) {
    ul.querySelectorAll('li.product-icon').forEach((li) => {
      // Image (mandatory, first cell)
      let imgCell = null;
      const a = li.querySelector('a');
      const img = li.querySelector('img');
      if (a && img) {
        // Wrap image in link if present
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.appendChild(img.cloneNode(true));
        imgCell = link;
      } else if (img) {
        imgCell = img.cloneNode(true);
      }
      // Text content (mandatory, second cell)
      const textCell = document.createElement('div');
      const title = li.querySelector('.product-icon__title');
      if (title) {
        const heading = document.createElement('h6');
        heading.textContent = title.textContent.trim();
        textCell.appendChild(heading);
      }
      rows.push([imgCell, textCell]);
    });
  }

  // Create the cards block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
