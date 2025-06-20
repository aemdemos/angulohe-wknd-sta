/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block, which has class 'cmp-tabs'
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels from the list items in the tablist
  const tabLabels = Array.from(tabsBlock.querySelectorAll('.cmp-tabs__tablist > li'));

  // Get all tab panels (each is a div with data-cmp-hook-tabs="tabpanel")
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));

  // Prepare the table rows
  // Header row: only block name as per requirements, as a single cell
  // Content rows: 2 columns (label, content)
  // This header structure will be fixed by constructing the cells array as [ ['Tabs (tabs11)'], [label, content], ... ]
  const cells = [
    ['Tabs (tabs11)']
  ];

  for (let i = 0; i < tabLabels.length; i++) {
    const labelText = tabLabels[i].textContent.trim();
    // Find the matching tab panel by aria-labelledby
    const tabId = tabLabels[i].id;
    const matchingPanel = tabPanels.find(p => p.getAttribute('aria-labelledby') === tabId);
    let contentCell;
    if (matchingPanel) {
      // Find .contentfragment inside, if present
      const cf = matchingPanel.querySelector('.contentfragment');
      if (cf) {
        contentCell = cf;
      } else {
        // fallback: use all children of panel
        // Wrap in a div to preserve structure
        const wrapper = document.createElement('div');
        Array.from(matchingPanel.childNodes).forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
            wrapper.appendChild(child);
          }
        });
        contentCell = wrapper.childNodes.length === 1 ? wrapper.firstChild : wrapper;
      }
    } else {
      contentCell = '';
    }
    cells.push([labelText, contentCell]);
  }

  // Create the block table with header as a single cell, and all content rows as two cells
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original tabs block with the new block table
  tabsBlock.replaceWith(block);
}
