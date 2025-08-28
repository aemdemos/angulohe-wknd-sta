/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block
  const tabsOuter = element.querySelector('.tabs');
  if (!tabsOuter) return;
  const tabsRoot = tabsOuter.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Find tab labels
  const tabList = tabsRoot.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('.cmp-tabs__tab'));

  // Find tab panels
  const tabPanels = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tabpanel'));
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Header row: exactly one column/cell with correct block name
  const headerRow = ['Tabs (tabs3)'];

  // Row 2: tab labels, one per cell, using strong
  const labelsRow = tabLabels.map(labelEl => {
    const strong = document.createElement('strong');
    strong.textContent = labelEl.textContent.trim();
    return strong;
  });

  // Row 3: tab content, one per cell, referencing the original DOM element
  const contentRow = tabPanels.map(panelEl => {
    // Reference the meaningful first child if it exists, else the panel itself
    let contentNode = null;
    for (const child of panelEl.children) {
      if (child.textContent.trim().length > 0) {
        contentNode = child;
        break;
      }
    }
    return contentNode || panelEl;
  });

  // Compose table
  const cells = [headerRow, labelsRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
