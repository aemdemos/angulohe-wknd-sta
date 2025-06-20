/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block (cmp-tabs) inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels (tab headers)
  const tabHeaders = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get the tab panels (tab content)
  // Each tab panel has role="tabpanel" and data-cmp-hook-tabs="tabpanel"
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the table rows
  const rows = [];
  // 1st row: block name (header)
  rows.push(["Tabs (tabs10)"]);

  // Each subsequent row: [Tab Label, Tab Content]
  for (let i = 0; i < tabHeaders.length; i++) {
    const tab = tabHeaders[i];
    const panel = tabPanels[i];
    if (!tab || !panel) continue;
    const label = tab.textContent.trim();

    // Get the main content fragment inside each tab panel if present
    // Otherwise, use the panel itself.
    let contentElem = panel.querySelector('.contentfragment') || panel;

    rows.push([label, contentElem]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the cmp-tabs block with the new block table
  tabsBlock.replaceWith(block);
}
