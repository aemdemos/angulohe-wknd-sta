/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs container
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;
  // Get all tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li'));
  // Get all tab panels (always in DOM, regardless of active)
  // Use direct children of tabsRoot with role="tabpanel"
  const tabPanels = Array.from(tabsRoot.querySelectorAll(':scope > [role="tabpanel"]'));

  // Compose the rows for the table
  const rows = [];
  // Header row (block name as in example)
  rows.push(['Tabs (tabs14)']);

  // For each tab, get label and tab content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i].textContent.trim();
    const panel = tabPanels[i];
    if (!panel) continue;
    // For tab content cell, reference all childNodes (to include elements and text)
    // We'll collect all children into an array
    const cellContent = [];
    panel.childNodes.forEach((node) => {
      // Ignore empty text nodes (whitespace)
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      cellContent.push(node);
    });
    rows.push([label, cellContent.length === 1 ? cellContent[0] : cellContent]);
  }

  // Create and replace table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
