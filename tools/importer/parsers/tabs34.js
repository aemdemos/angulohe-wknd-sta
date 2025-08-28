/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block element
  const tabsElem = element.querySelector('.cmp-tabs');
  if (!tabsElem) return;

  // Get all tab labels from the tablist
  const tabList = tabsElem.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('[role="tab"]').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // Get all tab panels (content), order matters
  const tabPanels = Array.from(tabsElem.querySelectorAll('[role="tabpanel"]'));

  // Build the cells array matching the example structure:
  // First row: header, single column
  const cells = [['Tabs (tabs34)']];

  // Each subsequent row: two columns [label, content]
  tabLabels.forEach((label, idx) => {
    const tabPanel = tabPanels[idx];
    if (!tabPanel) return;
    // Use the .contentfragment if found, else all children
    let tabContent = [];
    const cf = tabPanel.querySelector('.contentfragment');
    if (cf) {
      tabContent.push(cf);
    } else {
      tabContent = Array.from(tabPanel.children).filter(el => el.nodeType === 1);
      if (tabContent.length === 0 && tabPanel.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = tabPanel.textContent.trim();
        tabContent = [p];
      }
    }
    cells.push([label, tabContent]);
  });

  // Create the table block. The createTable function will automatically pad the header to match max columns.
  const table = WebImporter.DOMUtils.createTable(cells, document);
  tabsElem.replaceWith(table);
}
