/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .cmp-tabs block inside the provided element
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist (li elements)
  const tabList = tabsBlock.querySelector('ol.cmp-tabs__tablist');
  const tabLabels = Array.from(tabList ? tabList.querySelectorAll('li') : []);

  // Get all tab panels (content for each tab)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]')
  );

  // Prepare the rows for the table
  const rows = [];
  rows.push(['Tabs (tabs20)']); // Header as specified

  // For each tab, extract label and content
  for (let i = 0; i < tabLabels.length; i++) {
    const label = tabLabels[i] ? tabLabels[i].textContent.trim() : '';
    let content = '';

    // Defensive: panel may not exist
    if (tabPanels[i]) {
      const panel = tabPanels[i];
      // Many panels contain a single .contentfragment as their direct child
      // We'll gather all children except script/style/irrelevant nodes
      let contentNodes = Array.from(panel.childNodes).filter(n => {
        // Discard whitespace text nodes
        if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim();
        // Discard script/style
        if (n.nodeType === Node.ELEMENT_NODE && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) return false;
        return true;
      });
      // If the only child is a .contentfragment, dig inside
      if (contentNodes.length === 1 && contentNodes[0].nodeType === Node.ELEMENT_NODE && contentNodes[0].classList.contains('contentfragment')) {
        const cf = contentNodes[0];
        // Include all children of the contentfragment
        contentNodes = Array.from(cf.childNodes).filter(n => {
          if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim();
          if (n.nodeType === Node.ELEMENT_NODE && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE')) return false;
          return true;
        });
      }
      // Remove empty nodes array
      content = contentNodes.length === 1 ? contentNodes[0] : contentNodes;
    }

    rows.push([label, content]);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
