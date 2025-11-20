/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Accordion (accordion13)'];
  const rows = [];

  // Extract the section heading
  const heading = element.querySelector('.faqs-title');
  let headingText = '';
  if (heading) {
    headingText = heading.textContent.trim();
  }

  // Find the FAQ accordion wrapper
  const accordion = element.querySelector('.accordion');
  if (!accordion) return;

  // Find all accordion items (cards)
  const cards = accordion.querySelectorAll('.card');

  cards.forEach(card => {
    // Title cell: find the button inside card-header
    const header = card.querySelector('.card-header button');
    let titleContent = null;
    if (header) {
      // Clone the button's child nodes except the arrow image
      const titleFragment = document.createDocumentFragment();
      header.childNodes.forEach(node => {
        if (node.nodeType === 1 && node.tagName === 'IMG') return; // skip arrow
        titleFragment.append(node.cloneNode(true));
      });
      titleContent = titleFragment.childNodes.length ? titleFragment : header.textContent.trim();
    } else {
      // Fallback: use text from header
      const h3 = card.querySelector('.card-header h3');
      titleContent = h3 ? h3.textContent.trim() : '';
    }

    // Content cell: get all children of card-body
    const body = card.querySelector('.card-body');
    let contentCell = '';
    if (body) {
      // If multiple paragraphs, put all in cell
      const bodyChildren = Array.from(body.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
      if (bodyChildren.length === 1) {
        contentCell = bodyChildren[0];
      } else if (bodyChildren.length > 1) {
        contentCell = bodyChildren;
      } else {
        contentCell = body.textContent.trim();
      }
    }

    rows.push([titleContent, contentCell]);
  });

  // Compose table data
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Place the heading above the block if present
  if (headingText) {
    const headingEl = document.createElement('h2');
    headingEl.textContent = headingText;
    element.replaceWith(headingEl, block);
  } else {
    element.replaceWith(block);
  }
}
