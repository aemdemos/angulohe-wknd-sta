/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tabs container
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels in array (preserving order)
  const tabList = tabs.querySelector('.cmp-tabs__tablist');
  const tabLabels = tabList ? Array.from(tabList.children).map(li => li.textContent.trim()) : [];
  const numTabs = tabLabels.length;

  // Get tab panel elements in label order
  const tabPanels = tabLabels.map((label, idx) => {
    const li = tabList.children[idx];
    const panelId = li.getAttribute('aria-controls');
    return tabs.querySelector('#' + panelId);
  });

  // Build the table structure exactly like the example
  // Row 1: header cell (single cell, one column)
  const headerRow = ['Tabs (tabs23)'];

  // Row 2: tab label cells (one cell per tab)
  const labelRow = tabLabels;

  // Row 3: tab content cells (one cell per tab), reference <article> in each panel if present, else all children
  const contentRow = tabPanels.map(panel => {
    if (!panel) return '';
    const article = panel.querySelector('article');
    if (article) return article;
    return Array.from(panel.childNodes);
  });

  // Compose the cells array. Header row is [header], then [label, label, ...], then [content, content, ...]
  const cells = [headerRow, labelRow, contentRow];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs element with the block
  tabs.replaceWith(block);
}
