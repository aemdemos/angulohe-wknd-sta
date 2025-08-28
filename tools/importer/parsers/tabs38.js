/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.tabs .cmp-tabs');
  if (!tabsBlock) return;

  // Get the tab labels from the tablist
  const tabList = tabsBlock.querySelector('.cmp-tabs__tablist');
  const tabLabelEls = tabList ? Array.from(tabList.children) : [];
  if (!tabLabelEls.length) return;
  const tabLabels = tabLabelEls.map(li => li.textContent.trim());
  const numTabs = tabLabels.length;

  // Gather tab panels in order
  const tabPanels = Array.from(tabsBlock.querySelectorAll('[data-cmp-hook-tabs="tabpanel"]'));
  if (!tabPanels.length) return;
  const tabContents = tabPanels.map(panel => {
    let mainContent = null;
    const contentFragment = panel.querySelector('.contentfragment');
    if (contentFragment) {
      mainContent = contentFragment;
    } else {
      mainContent = panel.childElementCount > 0 ? panel : document.createElement('div');
    }
    return mainContent;
  });

  // Build the table manually for correct colspan behavior
  const table = document.createElement('table');

  // Header row: one single th cell spanning all tab columns
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Tabs (tabs38)';
  headerTh.setAttribute('colspan', numTabs);
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Tab labels row
  const labelTr = document.createElement('tr');
  tabLabels.forEach(label => {
    const td = document.createElement('td');
    td.textContent = label;
    labelTr.appendChild(td);
  });
  table.appendChild(labelTr);

  // Tab contents row
  const contentTr = document.createElement('tr');
  tabContents.forEach(content => {
    const td = document.createElement('td');
    td.append(content);
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  // Replace the tabs block with the corrected table
  tabsBlock.replaceWith(table);
}
