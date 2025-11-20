/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main row container
  const row = element.querySelector('.row');
  if (!row) return;

  // Helper to get direct children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // --- COLUMN 1: WhatsApp, ITC logo, Enduring Value, FSSAI logo, FSSAI License ---
  const leftCol = getChildByClass(row, 'col-lg-6'); // first left column
  let leftColContent = [];
  if (leftCol) {
    // WhatsApp icon
    const whatsappDiv = leftCol.querySelector('a[href*="wa.me"]');
    if (whatsappDiv) leftColContent.push(whatsappDiv.cloneNode(true));

    // ITC logo and 'Enduring Value' text
    const itcLogoBlock = leftCol.querySelector('.footer-itc-logo');
    if (itcLogoBlock) {
      const itcLogoImg = itcLogoBlock.querySelector('img');
      if (itcLogoImg) leftColContent.push(itcLogoImg.cloneNode(true));
      // Try to find 'Enduring Value' text
      const enduringValueText = Array.from(itcLogoBlock.querySelectorAll('*')).map(e => e.textContent.trim()).find(t => t.toLowerCase().includes('enduring value'));
      if (enduringValueText) leftColContent.push(document.createTextNode(enduringValueText));
    }

    // FSSAI logo and license
    const fssaiLogoBlock = leftCol.querySelector('.footer-fssai-logo');
    if (fssaiLogoBlock) {
      const fssaiLogoImg = fssaiLogoBlock.querySelector('img');
      if (fssaiLogoImg) leftColContent.push(fssaiLogoImg.cloneNode(true));
      // Try to find FSSAI License text
      const fssaiLicenseText = Array.from(fssaiLogoBlock.querySelectorAll('*')).map(e => e.textContent.trim()).find(t => /Lic\./.test(t));
      if (fssaiLicenseText) leftColContent.push(document.createTextNode(fssaiLicenseText));
    }
  }

  // --- COLUMN 2: Legal & Navigation Links ---
  let linksColContent = [];
  if (leftCol) {
    // Legal links (Terms & Conditions, Privacy Policy)
    const legalList = leftCol.querySelector('.list-4 ul');
    if (legalList) linksColContent.push(legalList.cloneNode(true));
    // Navigation links (Know Your Health, etc.)
    const navList = leftCol.querySelector('.list-3 ul');
    if (navList) linksColContent.push(navList.cloneNode(true));
  }

  // --- COLUMN 3: Subscribe Form ---
  const subscribeCol = element.querySelector('.subscribenow');
  let subscribeColContent = [];
  if (subscribeCol) {
    // Heading
    const heading = subscribeCol.querySelector('.cmp-footer__nav-text h3');
    if (heading) subscribeColContent.push(heading.cloneNode(true));
    // Form
    const form = subscribeCol.querySelector('form');
    if (form) subscribeColContent.push(form.cloneNode(true));
    // Button
    const buttonDiv = subscribeCol.querySelector('.button');
    if (buttonDiv) subscribeColContent.push(buttonDiv.cloneNode(true));
  }

  // --- COLUMN 4: Social Media & Copyright ---
  const rightCol = getChildByClass(row, 'itc-footer-link-right');
  let rightColContent = [];
  if (rightCol) {
    // Social icons
    const socialLists = rightCol.querySelectorAll('ul.list-unstyled');
    socialLists.forEach(list => {
      const iconLink = list.querySelector('a');
      if (iconLink) rightColContent.push(iconLink.cloneNode(true));
    });
    // Copyright text
    const copyright = rightCol.querySelector('.footer-link');
    if (copyright) rightColContent.push(copyright.cloneNode(true));
  }

  // --- Compose the block table ---
  const headerRow = ['Columns (columns4)'];
  const columnsRow = [leftColContent, linksColContent, subscribeColContent, rightColContent];
  const cells = [headerRow, columnsRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
