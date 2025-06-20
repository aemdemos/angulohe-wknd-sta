/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs component inside this element
  const tabs = element.querySelector('.cmp-tabs');
  if (!tabs) return;

  // Get tab labels from the tablist (li elements)
  const tabLabelEls = tabs.querySelectorAll('.cmp-tabs__tablist > li[role="tab"]');
  const tabLabels = Array.from(tabLabelEls).map(li => li.textContent.trim());

  // Get tab panels (content containers)
  const tabPanels = Array.from(tabs.querySelectorAll('.cmp-tabs__tabpanel'));

  // Prepare header row as required: single cell
  const headerRow = ['Tabs (tabs25)'];

  // Prepare rows for each tab: [Tab Label, Tab Content]
  const rows = tabLabels.map((label, idx) => {
    const panel = tabPanels[idx];
    let contentCell = '';
    if (panel) {
      // Try to find .contentfragment inside panel for more precise content
      const cf = panel.querySelector('.contentfragment, .cmp-contentfragment');
      let contentNodes = [];
      if (cf) {
        // Gather all children from .cmp-contentfragment__elements, or cf itself if nothing
        const elements = cf.querySelector('.cmp-contentfragment__elements');
        if (elements) {
          // collect all meaningful descendants (avoid empty grid wrappers)
          contentNodes = Array.from(elements.children).filter(child => {
            if ((child.classList.contains('aem-Grid') || child.classList.contains('aem-Grid--12')) && !child.textContent.trim()) {
              return false;
            }
            return true;
          });
        }
        // Add all siblings after .cmp-contentfragment__elements (like actual tab body content, image, etc)
        let afterElements = [];
        if (elements && elements.nextElementSibling) {
          let sib = elements.nextElementSibling;
          while(sib) {
            afterElements.push(sib);
            sib = sib.nextElementSibling;
          }
        }
        // The tab panel may also include other content after the cf
        contentNodes = [cf, ...afterElements];
      } else {
        // No .contentfragment, include all panel children
        contentNodes = Array.from(panel.childNodes).filter(
          node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
        );
      }
      // Remove empty text nodes
      contentNodes = contentNodes.filter(node => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim();
        if (node.nodeType === Node.ELEMENT_NODE) return node.textContent.trim() || node.querySelector('*');
        return false;
      });
      // Flatten if only one
      if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else if (contentNodes.length > 1) {
        contentCell = contentNodes;
      } else {
        contentCell = '';
      }
    }
    return [label, contentCell];
  });

  // Compose table: header row is single cell, then rows are [label, content]
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
