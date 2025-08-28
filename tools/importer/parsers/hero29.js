/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main hero image (top-most main image in the block)
  function findHeroImage() {
    // The hero image is always the top-most full-width image on the page
    // Typically the first .image .cmp-image img under the main .container
    const mainGrid = element.querySelector(':scope > .cmp-container > .aem-Grid');
    if (mainGrid) {
      const imgDiv = mainGrid.querySelector(':scope > .image .cmp-image img');
      if (imgDiv) return imgDiv;
    }
    // Fallback: first .cmp-image img in the block
    const firstImage = element.querySelector('.cmp-image img');
    if (firstImage) return firstImage;
    // Fallback: just first img in the element
    return element.querySelector('img');
  }

  // Find hero text content: h1, h4, and the first intro paragraph
  function findHeroTextContent() {
    // We'll collect h1, h4, and the first p after those elements, before main article/contentfragment
    const textEls = [];
    // 1. Find the main container that has the titles
    let titleContainer = null;
    const containers = element.querySelectorAll('.cmp-container');
    for (const container of containers) {
      // Find a .title containing h1
      if (container.querySelector('h1')) {
        titleContainer = container;
        break;
      }
    }
    if (titleContainer) {
      // Get h1 (title)
      const h1 = titleContainer.querySelector('h1');
      if (h1) textEls.push(h1);
      // Get h4 (author/subheading)
      const h4 = titleContainer.querySelector('h4');
      if (h4) textEls.push(h4);
      // Get first paragraph
      const mainContent = titleContainer.parentElement;
      // Look for first <p> after h1/h4, but before article.contentfragment
      let pFound = false;
      for (const node of mainContent.children) {
        if (node.classList.contains('title')) continue;
        if (node.tagName === 'ARTICLE' && node.classList.contains('contentfragment')) break;
        if (!pFound && node.querySelector('p')) {
          const p = node.querySelector('p');
          if (p && p.textContent.trim()) {
            textEls.push(p);
            pFound = true;
          }
        }
      }
      // Fallback: if no p found, get first paragraph in .cmp-container
      if (!pFound) {
        const fallbackP = titleContainer.querySelector('p');
        if (fallbackP) textEls.push(fallbackP);
      }
    } else {
      // Fallback: just grab first h1, h4, and first <p> in the block
      const h1 = element.querySelector('h1');
      if (h1) textEls.push(h1);
      const h4 = element.querySelector('h4');
      if (h4) textEls.push(h4);
      const p = element.querySelector('p');
      if (p) textEls.push(p);
    }
    // Ensure only non-empty elements
    return textEls.filter(el => el && el.textContent && el.textContent.trim()).length > 0 ? textEls.filter(el => el && el.textContent && el.textContent.trim()) : [''];
  }

  // Build the table according to example spec
  const headerRow = ['Hero (hero29)']; // Exact header match
  const imageRow = [findHeroImage() || ''];
  const textRow = [findHeroTextContent()];

  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
