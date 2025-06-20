/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area (the one with the contentfragment/article)
  // 'element' is the top-level <main> for the whole page
  // We'll find the main content (with article) and the sidebar (with upnext etc)

  // Find all top-level immediate children: may be <main> or <aside>
  const mainCandidates = Array.from(element.querySelectorAll(':scope > main'));
  let contentMain = null;
  let sidebarAside = null;

  // Find main content <main> (should contain .contentfragment) and sidebar <aside>
  mainCandidates.forEach((mc) => {
    if (mc.querySelector('article.contentfragment')) {
      contentMain = mc;
    }
  });
  // Also get sidebar: direct <aside> child
  const asideEls = Array.from(element.querySelectorAll(':scope > aside'));
  if (asideEls.length > 0) {
    sidebarAside = asideEls[0];
  }

  if (!contentMain) return; // Safety: if no main content, do nothing

  // Within contentMain, find the main content block
  const topContainer = contentMain.querySelector(':scope > div.cmp-container');
  if (!topContainer) return;

  // Find the two title blocks and the article
  const titles = Array.from(topContainer.querySelectorAll(':scope > div.title'));
  const article = topContainer.querySelector('article.contentfragment');

  // The structure for the columns block (based on example):
  //   - left column: the titles and main article (as array)
  //   - right column: the sidebar aside (as a single element)

  // Only add non-null, non-empty entries for columns
  const leftCol = [];
  titles.forEach(t => { if (t && t.textContent.trim().length > 0) leftCol.push(t); });
  if (article) leftCol.push(article);

  // For right column, just include the entire aside if it exists
  const rightCol = sidebarAside ? [sidebarAside] : [''];

  // Table header as per spec
  const headerRow = ['Columns (columns33)'];
  const columnsRow = [leftCol, rightCol];
  const cells = [headerRow, columnsRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
