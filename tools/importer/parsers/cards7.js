/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards7) block parsing
  // 1. Find the parent container for cards
  const section = element.querySelector('.shop-category');
  if (!section) return;

  const ul = section.querySelector('ul');
  if (!ul) return;

  // 2. Find all card items
  const cardItems = ul.querySelectorAll('li.product-icon');
  if (!cardItems.length) return;

  // 3. Prepare header row
  const headerRow = ['Cards (cards7)'];
  const rows = [headerRow];

  // 4. Extract heading (e.g. 'Shop by category') and breadcrumb text
  // 4a. Heading
  const heading = section.querySelector('h2');
  if (heading && heading.textContent.trim()) {
    rows.push(['', heading.textContent.trim()]);
  }
  // 4b. Breadcrumb
  const breadcrumb = element.querySelector('.breadcrumb');
  if (breadcrumb) {
    const items = breadcrumb.querySelectorAll('li.cmp-breadcrumb__item');
    const breadcrumbText = Array.from(items)
      .map(li => {
        const span = li.querySelector('[itemprop="name"]');
        return span ? span.textContent.trim() : '';
      })
      .filter(Boolean)
      .join(' > ');
    if (breadcrumbText) {
      rows.push(['', breadcrumbText]);
    }
  }

  // 5. For each card, extract image and text
  cardItems.forEach((li) => {
    // Image or Icon (mandatory)
    const imgLink = li.querySelector('a');
    let imageCell = '';
    if (imgLink) {
      // Preserve the link wrapping the image
      const img = imgLink.querySelector('img');
      if (img) {
        const a = document.createElement('a');
        a.href = imgLink.href;
        a.appendChild(img.cloneNode(true));
        imageCell = a;
      }
    }
    // Title (optional)
    const title = li.querySelector('.product-icon__title');
    let textCell = [];
    if (title) {
      const heading = document.createElement('strong');
      heading.textContent = title.textContent.trim();
      textCell.push(heading);
    }
    rows.push([
      imageCell,
      textCell.length ? textCell : ''
    ]);
  });

  // 6. Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
