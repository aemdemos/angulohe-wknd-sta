/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs element inside the provided element
  const tabsEl = element.querySelector('.cmp-tabs');
  if (!tabsEl) return;

  // Find tab labels in order
  const tabLabels = Array.from(
    tabsEl.querySelectorAll('.cmp-tabs__tablist .cmp-tabs__tab')
  ).map(tab => tab.textContent.trim());

  // Find tab panels in order (assume order matches tabLabels)
  const tabPanels = Array.from(
    tabsEl.querySelectorAll('div[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare table rows: first is header, then each tab [label, content]
  const cells = [];
  cells.push(['Tabs (tabs28)']);

  // For each tab, add row: [label, content panel element]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] || '';
    const panel = tabPanels[i] || '';
    cells.push([label, panel]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original cmp-tabs element with the table
  tabsEl.replaceWith(table);
}
