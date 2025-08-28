/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs container within the given element
  const tabsContainer = element.querySelector('.cmp-tabs');
  if (!tabsContainer) return;

  // Get tab labels from <li> inside .cmp-tabs__tablist
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  if (!tabList) return;
  const tabLabels = Array.from(tabList.querySelectorAll('li[role="tab"]'));

  // Get tab panels (order should match tabLabels)
  const tabPanels = Array.from(
    tabsContainer.querySelectorAll('[role="tabpanel"][data-cmp-hook-tabs="tabpanel"]')
  );

  // Compose the header row according to requirement
  const headerRow = ['Tabs (tabs8)'];
  const cells = [headerRow];

  // For each tab, add a row: [Tab Label, Tab Content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const tabName = label ? label.textContent.trim() : '';
    const panel = tabPanels[i];
    let tabContent = '';
    if (panel) {
      // Reference all direct children of tab panel
      let panelNodes = Array.from(panel.childNodes).filter(node => {
        // Remove whitespace-only text nodes
        return !(node.nodeType === 3 && !node.textContent.trim());
      });
      if (panelNodes.length === 1) {
        tabContent = panelNodes[0];
      } else if (panelNodes.length > 1) {
        tabContent = panelNodes;
      } else {
        tabContent = '';
      }
    }
    cells.push([tabName, tabContent]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the tabs container with the table
  tabsContainer.replaceWith(block);
}
