/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the .tabs block that contains cmp-tabs
  const tabsContainer = element.querySelector('.tabs .cmp-tabs');
  if (!tabsContainer) return;

  // 2. Extract tab labels
  const tabList = tabsContainer.querySelector('.cmp-tabs__tablist');
  const tabLabels = [];
  if (tabList) {
    tabList.querySelectorAll('.cmp-tabs__tab').forEach(tab => {
      tabLabels.push(tab.textContent.trim());
    });
  }

  // 3. Extract tab panels (tabpanel order matches tab label order)
  const tabPanels = tabsContainer.querySelectorAll('.cmp-tabs__tabpanel');

  // 4. Build table rows: [header], then one row for each tab ([label, content])
  const rows = [];
  rows.push(['Tabs (tabs28)']); // Block name as header (no variants)

  tabLabels.forEach((label, i) => {
    let content = null;
    const panel = tabPanels[i];
    if (panel) {
      // Use the main article (contentfragment) inside the tabpanel as the content
      const article = panel.querySelector('article');
      if (article) {
        content = article;
      } else {
        // fallback: all child nodes (shouldn't occur with valid markup)
        content = Array.from(panel.childNodes);
      }
    } else {
      content = '';
    }
    rows.push([label, content]);
  });

  // 5. Create the block table and replace the .tabs element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the .tabs element (not just cmp-tabs) to match block boundary
  const tabsBlockElem = element.querySelector('.tabs');
  if (tabsBlockElem) {
    tabsBlockElem.replaceWith(table);
  }
}
