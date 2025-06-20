/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .cmp-tabs block inside the element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get all tab labels from the tabs tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('.cmp-tabs__tab')) : [];
  const tabPanels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tabpanel'));

  // Defensive: If either labels or panels are missing, don't process further
  if (!tabLabelEls.length || !tabPanels.length) return;

  // Build the header row with the block label exactly as required
  const headerRow = ['Tabs (tabs36)'];

  // Build each tab row: [label, content]
  const rows = tabLabelEls.map((tabEl) => {
    // Get the label
    const label = tabEl.textContent.trim();
    // The id of the tab (e.g., tabs-abf18f1b93-item-1e9c44b9a7-tab)
    const tabId = tabEl.id;
    // Find the associated panel by aria-labelledby
    const panel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    // Reference the entire panel for content, if present, else empty string
    return [label, panel ? panel : ''];
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
