/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block within the provided element
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Find the tab labels (should be in the tab list <ol>)
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.querySelectorAll('li[role="tab"]')) : [];

  // Find all tab panels (should be in the order of the tab labels)
  const tabPanels = Array.from(tabsBlock.querySelectorAll('div[role="tabpanel"]'));
  // Defensive: If tabPanels and tabLabels don't match, bail
  if (tabLabelEls.length !== tabPanels.length || tabLabelEls.length === 0) return;

  // Compose the header row
  const headerRow = ['Tabs (tabs23)'];

  // Compose the tab label row: array of <strong>label</strong>
  const tabLabelsRow = tabLabelEls.map(tab => {
    const strong = document.createElement('strong');
    strong.textContent = tab.textContent.trim();
    return strong;
  });

  // Compose the tab content row: array of tab content elements
  const tabContentsRow = tabPanels.map((panel) => {
    // Content is usually a contentfragment/article
    const article = panel.querySelector('article.cmp-contentfragment');
    if (article) {
      // Remove the h3 title, if present
      const h3 = article.querySelector('h3.cmp-contentfragment__title');
      if (h3) h3.remove();
      // The main content is inside .cmp-contentfragment__elements
      const el = article.querySelector('.cmp-contentfragment__elements');
      if (el) return el;
      return article;
    }
    // If no article, return the panel itself
    return panel;
  });

  // Compose the table structure: header, tab labels row, tab contents row
  const cells = [
    headerRow,
    tabLabelsRow,
    tabContentsRow,
  ];

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  tabsBlock.parentNode.replaceChild(block, tabsBlock);
}
