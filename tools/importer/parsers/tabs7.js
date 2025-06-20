/* global WebImporter */
export default function parse(element, { document }) {
  // Find the cmp-tabs block within the element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // 1. Extract tab labels (as text, from li.cmp-tabs__tab)
  const tabLabelElements = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  );
  const tabLabels = tabLabelElements.map(li => li.textContent.trim());

  // 2. Extract tab contents (from .cmp-tabs__tabpanel)
  const tabPanelElements = Array.from(
    tabs.querySelectorAll('.cmp-tabs__tabpanel')
  );

  // Defensive: Only pair up to the min length of labels/panels
  const tabCount = Math.min(tabLabels.length, tabPanelElements.length);

  // Table header row
  const headerRow = ['Tabs (tabs7)'];
  // Table subsequent rows: each row is [Tab Label, Tab Content Element]
  const rows = [];
  for(let i=0; i<tabCount; i++) {
    rows.push([tabLabels[i], tabPanelElements[i]]);
  }

  // Compose the table
  const tableData = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the tabs element only (not the whole parent)
  tabs.replaceWith(block);
}
