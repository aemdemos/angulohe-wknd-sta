/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active "Overview" tabpanel for the hero content
  const tabPanel = element.querySelector('.cmp-tabs__tabpanel--active');
  let heroImage = null;
  let heroContent = [];

  // Helper: flatten all text/heading/paragraph/list content after the main heading
  function getHeroContent(panel) {
    let contentArr = [];
    if (!panel) return contentArr;
    const article = panel.querySelector('article');
    let root = article || panel;

    // Find the main heading (usually first h2, fallback to h1/h3)
    let heading = root.querySelector('h2') || root.querySelector('h1') || root.querySelector('h3');
    if (heading) {
      contentArr.push(heading);
    }
    // Find the first image (by class)
    let img = root.querySelector('.cmp-image');
    if (img) {
      heroImage = img;
    }
    // Get all elements after heading, omitting images (added separately)
    let startAdding = false;
    Array.from(root.childNodes).forEach((node) => {
      if (heading && node === heading) {
        startAdding = true;
        return;
      }
      if (!startAdding) return;
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip aem grid containers
        if (node.classList && node.classList.contains('aem-Grid')) return;
        // Skip the image
        if (heroImage && (node === heroImage || node.contains(heroImage))) return;
        // Accept paragraphs, lists, additional headings, divs with text
        if (
          node.tagName.match(/^H[1-6]$/) ||
          node.tagName === 'P' ||
          node.tagName === 'UL' ||
          node.tagName === 'OL' ||
          (node.tagName === 'DIV' && node.textContent.trim())
        ) {
          contentArr.push(node);
        }
      }
    });
    // Fallback: if only heading, add all <p> after heading
    if (contentArr.length <= (heading ? 1 : 0)) {
      const ps = Array.from(root.querySelectorAll('p'));
      ps.forEach((p) => {
        if (!contentArr.includes(p)) contentArr.push(p);
      });
    }
    return contentArr;
  }

  if (tabPanel) {
    heroContent = getHeroContent(tabPanel);
    // Remove image if present in content
    if (heroImage && heroContent.includes(heroImage)) {
      heroContent = heroContent.filter((el) => el !== heroImage);
    }
  }

  // Fallbacks
  if (!heroImage) {
    heroImage = element.querySelector('.cmp-image');
  }
  if (heroContent.length === 0) {
    // Try to get any heading and p from entire element
    const fallbackHeading = element.querySelector('h1, h2, h3');
    if (fallbackHeading) heroContent.push(fallbackHeading);
    const fallbackP = element.querySelector('p');
    if (fallbackP) heroContent.push(fallbackP);
  }

  // Compose table as in the example: header, image (optional), content
  const cells = [
    ['Hero'],
    [heroImage ? heroImage : ''],
    [heroContent.length > 0 ? heroContent : '']
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
