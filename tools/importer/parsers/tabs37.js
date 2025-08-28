/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsRoot = element.querySelector('.cmp-tabs');
  if (!tabsRoot) return;

  // Extract tab headers (li elements)
  const tabHeaders = Array.from(tabsRoot.querySelectorAll('.cmp-tabs__tablist > li'));
  // Extract tab panels (content per tab)
  const tabPanels = Array.from(tabsRoot.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  // Ensure both lists have the same length
  if (tabHeaders.length !== tabPanels.length) return;

  // The first row: header with block name
  const headerRow = ['Tabs (tabs37)'];
  // The second row: tab labels, use <strong> to match bold style in example
  const tabLabelRow = tabHeaders.map((li) => {
    // Use an existing <strong> if present, otherwise create one
    // But since li.textContent is always plain, we create a <strong> per label
    const strong = document.createElement('strong');
    strong.textContent = li.textContent.trim();
    return strong;
  });

  // Third row: tab content for each tab
  const tabContentRow = tabPanels.map((panel) => {
    // The panel usually contains a single contentfragment/article
    const cf = panel.querySelector('article.cmp-contentfragment');
    if (cf) {
      // Reference the whole article for robust extraction
      return cf;
    }
    // Otherwise, fallback to the tab panel itself
    return panel;
  });

  // Compose the table, matching structure: first row header (1 col),
  // second row: tab labels (N cols), third row: tab contents (N cols)
  const cells = [
    headerRow,
    tabLabelRow,
    tabContentRow
  ];

  // Create the block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
