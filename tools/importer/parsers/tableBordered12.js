/* global WebImporter */
export default function parse(element, { document }) {
  // Table (bordered, tableBordered12) block parser
  // Defensive: find the bordered table with nutritional data

  // Helper: Find the nutritional table under the correct heading
  let table;
  // Find all h2s under this block
  const h2s = element.querySelectorAll('h2');
  let nutritionHeading;
  for (const h2 of h2s) {
    if (h2.textContent.trim().toLowerCase().includes('nutritional profile')) {
      nutritionHeading = h2;
      break;
    }
  }
  if (nutritionHeading) {
    // The table is the next sibling or nearby after this heading
    let next = nutritionHeading.nextElementSibling;
    while (next && next.tagName !== 'TABLE') {
      next = next.nextElementSibling;
    }
    if (next && next.tagName === 'TABLE') {
      table = next;
    }
  }

  // If not found, fallback: find first table in block
  if (!table) {
    table = element.querySelector('table');
  }
  if (!table) {
    // No table found, do nothing
    return;
  }

  // Parse the table into rows/cells
  const rows = [];
  const trs = table.querySelectorAll('tr');
  for (const tr of trs) {
    const cells = [];
    const tds = tr.querySelectorAll('td');
    for (const td of tds) {
      // If the td only contains a <p>, use that element
      if (td.children.length === 1 && td.firstElementChild.tagName === 'P') {
        cells.push(td.firstElementChild);
      } else {
        // Otherwise, use the td itself
        cells.push(td);
      }
    }
    rows.push(cells);
  }

  // Compose the block table
  // Header row: block name
  const headerRow = ['Table (bordered, tableBordered12)'];

  // The rest of the rows: preserve the table's structure
  // Defensive: If the first row is a header, keep it as-is
  // All rows must have the same number of columns
  const blockRows = [headerRow];
  for (const row of rows) {
    blockRows.push(row);
  }

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(blockRows, document);

  // Replace the original table with the block table
  table.replaceWith(blockTable);
}
