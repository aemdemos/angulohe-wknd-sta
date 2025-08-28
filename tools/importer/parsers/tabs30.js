/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Header row as in example
  const headerRow = ['Tabs (tabs30)'];

  // Get tab labels (order matters)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('.cmp-tabs__tablist li.cmp-tabs__tab')
  );

  // Get all tab panels (order is important)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Build rows: [Tab Label, Tab Content]
  const rows = tabLabels.map((labelEl, idx) => {
    const label = labelEl.textContent.trim();
    let contentCell = '';
    const panel = tabPanels[idx];
    if (panel) {
      // Get the entire article element within the tab panel, if present
      const article = panel.querySelector('article');
      if (article) {
        contentCell = article;
      } else {
        // Fallback: all children of panel
        contentCell = Array.from(panel.childNodes).filter(n => n.nodeType !== 3 || n.textContent.trim() !== '');
      }
    }
    return [label, contentCell];
  });

  // Construct table
  const cells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs block with the generated table
  tabsBlock.replaceWith(blockTable);
}
