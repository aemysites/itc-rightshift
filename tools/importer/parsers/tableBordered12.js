/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nutrition table in the article
  const table = element.querySelector('table');
  if (!table) return;

  // Get all rows from the source table
  const rows = Array.from(table.rows);
  if (rows.length === 0) return;

  // Block header row (CRITICAL: must be exactly one column with the block name)
  const headerRow = ['Table (bordered, tableBordered12)'];

  // Extract column headers from the first row (should be two columns)
  const tableHeaderCells = Array.from(rows[0].cells).map(cell => cell.textContent.trim());

  // Extract data rows (each row should have two columns)
  const dataRows = rows.slice(1).map(tr => {
    return Array.from(tr.cells).map(td => {
      const p = td.querySelector('p');
      return p ? p : td.textContent.trim();
    });
  });

  // Compose the final table cells array
  const cells = [
    headerRow,
    tableHeaderCells,
    ...dataRows,
  ];

  // Create the new block table using DOMUtils and set border attribute
  const block = WebImporter.DOMUtils.createTable(cells, document);
  block.setAttribute('border', '1');

  // Replace the original table with the new block table
  table.replaceWith(block);
}
