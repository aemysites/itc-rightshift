/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get all banner images (desktop and mobile)
  function getBannerImages(container) {
    const imgs = container.querySelectorAll('img');
    return Array.from(imgs);
  }

  // Helper: Get breadcrumb links and plain text, preserving anchor tags
  function getBreadcrumbContent(element) {
    const breadcrumb = element.querySelector('.cmp-breadcrumb__list');
    if (breadcrumb) {
      const items = breadcrumb.querySelectorAll('.cmp-breadcrumb__item');
      const fragment = document.createDocumentFragment();
      items.forEach((item, idx) => {
        const link = item.querySelector('a');
        if (link) {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.textContent.trim();
          fragment.appendChild(a);
        }
        const span = item.querySelector('span[itemprop="name"]');
        if (span && !link) {
          const spanEl = document.createElement('span');
          spanEl.textContent = span.textContent.trim();
          fragment.appendChild(spanEl);
        }
        // Add separator except after last item
        if (idx < items.length - 1) {
          fragment.appendChild(document.createTextNode(' > '));
        }
      });
      const p = document.createElement('p');
      p.appendChild(fragment);
      return p;
    }
    return '';
  }

  // Row 1: Header
  const headerRow = ['Hero (hero9)'];

  // Row 2: Banner images (include both desktop and mobile)
  let bannerImgs = [];
  const section = element.querySelector('section.content-wrapper-section');
  if (section) {
    const container = section.querySelector('.container');
    if (container) {
      bannerImgs = getBannerImages(container);
    }
  }
  const imageRow = [bannerImgs.length ? bannerImgs : ''];

  // Row 3: Breadcrumb navigation (preserving links)
  const breadcrumbContent = getBreadcrumbContent(element);
  const contentRow = [breadcrumbContent ? breadcrumbContent : ''];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
