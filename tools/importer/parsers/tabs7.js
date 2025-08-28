/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the tabs block root
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // 1. Extract tab labels in order (they are <li> in .cmp-tabs__tablist)
  const tabLabelEls = tabsRoot.querySelectorAll('.cmp-tabs__tablist > li.cmp-tabs__tab');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // 2. Extract tab panels in the same order as labels (they are .cmp-tabs__tabpanel)
  const tabPanels = tabsRoot.querySelectorAll('.cmp-tabs__tabpanel');

  // Compose table header
  const rows = [['Tabs (tabs7)']];

  // 3. For each tab, add a row with [label, content]
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i];
    const panel = tabPanels[i];
    if (!panel) continue;

    // Find the detailed content inside each panel
    // Prefer the .cmp-contentfragment__elements block if present
    let tabContent = null;
    const article = panel.querySelector('article');
    if (article) {
      const elementsBlock = article.querySelector('.cmp-contentfragment__elements');
      if (elementsBlock) {
        tabContent = elementsBlock;
      } else {
        tabContent = article;
      }
    } else {
      tabContent = panel;
    }
    // Defensive: fallback to panel if above fails
    if (!tabContent) tabContent = panel;

    rows.push([label, tabContent]);
  }

  // 4. Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // 5. Replace tabsRoot with the block
  tabsRoot.replaceWith(block);
}
