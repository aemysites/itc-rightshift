/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row container
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct column divs
  const columns = Array.from(row.children).filter((el) => el.classList.contains('col-lg-6') || el.classList.contains('col-lg-3'));

  // --- COLUMN 1: WhatsApp, ITC logo, Enduring Value, FSSAI logo, FSSAI License, Terms, Privacy ---
  const col1 = columns[0];
  const col1Content = [];
  // WhatsApp icon
  const whatsappDiv = col1.querySelector('a[href^="https://wa.me/"]');
  if (whatsappDiv) col1Content.push(whatsappDiv);
  // ITC logo (image)
  const itcLogoImg = col1.querySelector('.footer-itc-logo img');
  if (itcLogoImg) col1Content.push(itcLogoImg.cloneNode(true));
  // ITC logo text (Enduring Value)
  const itcLogoText = col1.querySelector('.footer-itc-logo');
  if (itcLogoText) {
    // Look for .footer-itc-logo's next sibling text node for 'Enduring Value'
    let foundText = false;
    itcLogoText.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        col1Content.push(document.createTextNode(node.textContent.trim()));
        foundText = true;
      }
    });
    // If not found, try parent
    if (!foundText && itcLogoText.parentNode) {
      itcLogoText.parentNode.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          col1Content.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
  }
  // FSSAI logo (image)
  const fssaiLogoImg = col1.querySelector('.footer-fssai-logo img');
  if (fssaiLogoImg) col1Content.push(fssaiLogoImg.cloneNode(true));
  // FSSAI license number (text)
  const fssaiLogoText = col1.querySelector('.footer-fssai-logo');
  if (fssaiLogoText) {
    // Look for .footer-fssai-logo's next sibling text node for license number
    let foundText = false;
    fssaiLogoText.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        col1Content.push(document.createTextNode(node.textContent.trim()));
        foundText = true;
      }
    });
    // If not found, try parent
    if (!foundText && fssaiLogoText.parentNode) {
      fssaiLogoText.parentNode.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          col1Content.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
  }
  // Terms & Privacy links (in .list-4.list)
  const leftLinksCol = element.querySelector('.itc-footer-link-left');
  if (leftLinksCol) {
    const list4 = leftLinksCol.querySelector('.list-4.list');
    if (list4) col1Content.push(list4);
  }

  // --- COLUMN 2: Main nav links (Know Your Health, etc) ---
  const col2Content = [];
  if (leftLinksCol) {
    const list3 = leftLinksCol.querySelector('.list-3.list');
    if (list3) col2Content.push(list3);
  }

  // --- COLUMN 3: Subscribe form ---
  const subscribeDiv = element.querySelector('.subscribenow');
  const col3Content = [];
  if (subscribeDiv) col3Content.push(subscribeDiv);

  // --- COLUMN 4: Social icons + copyright ---
  const rightLinksCol = element.querySelector('.itc-footer-link-right');
  const col4Content = [];
  if (rightLinksCol) {
    const socialDiv = rightLinksCol.querySelector('div');
    if (socialDiv) col4Content.push(socialDiv);
    const copyrightSpan = rightLinksCol.querySelector('.footer-link');
    if (copyrightSpan) col4Content.push(copyrightSpan);
  }

  // Build table
  const cells = [
    ['Columns (columns4)'],
    [col1Content, col2Content, col3Content, col4Content],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
