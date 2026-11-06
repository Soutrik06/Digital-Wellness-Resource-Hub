/**
 * MINDFUL — Standardized Resource Comparison Matrix
 * 11-column comprehensive evaluation with column sorting, category filtering,
 * and a mobile-friendly Card View switcher.
 */

let comparisonSortCol = 'name';
let comparisonSortAsc = true;
let comparisonCategoryFilter = 'all';
let comparisonViewMode = 'table'; // 'table' or 'cards'

function initComparison() {
  const categoryFilter = document.getElementById('comparison-category-select');
  const viewToggleBtn = document.getElementById('comparison-view-toggle');
  const sortHeaders = document.querySelectorAll('.sortable-th');

  renderComparison();

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      comparisonCategoryFilter = e.target.value;
      renderComparison();
    });
  }

  if (viewToggleBtn) {
    viewToggleBtn.addEventListener('click', () => {
      comparisonViewMode = comparisonViewMode === 'table' ? 'cards' : 'table';
      viewToggleBtn.innerHTML = comparisonViewMode === 'table' 
        ? '<i class="fa-solid fa-table-cells-large mr-1.5"></i> Switch to Cards' 
        : '<i class="fa-solid fa-table-list mr-1.5"></i> Switch to Table';
      renderComparison();
    });
  }

  sortHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (comparisonSortCol === col) {
        comparisonSortAsc = !comparisonSortAsc;
      } else {
        comparisonSortCol = col;
        comparisonSortAsc = true;
      }
      updateSortHeaderIcons();
      renderComparison();
    });
  });
}

function updateSortHeaderIcons() {
  document.querySelectorAll('.sortable-th').forEach(th => {
    const col = th.dataset.sort;
    const icon = th.querySelector('.sort-icon');
    if (icon) {
      if (col === comparisonSortCol) {
        icon.className = `sort-icon fa-solid fa-sort-${comparisonSortAsc ? 'up' : 'down'} text-forest-800 ml-1`;
      } else {
        icon.className = 'sort-icon fa-solid fa-sort text-slate-300 ml-1';
      }
    }
  });
}

function renderComparison() {
  const tbody = document.getElementById('comparison-tbody');
  const tableContainer = document.getElementById('comparison-table-wrapper');
  const cardsContainer = document.getElementById('comparison-cards-wrapper');
  if (!tbody) return;

  // 1. Filter
  let items = RESOURCES_DATA.filter(r => {
    if (comparisonCategoryFilter === 'all') return true;
    return r.category === comparisonCategoryFilter;
  });

  // 2. Sort
  items.sort((a, b) => {
    let valA = a[comparisonSortCol] || '';
    let valB = b[comparisonSortCol] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return comparisonSortAsc ? -1 : 1;
    if (valA > valB) return comparisonSortAsc ? 1 : -1;
    return 0;
  });

  if (comparisonViewMode === 'cards') {
    if (tableContainer) tableContainer.classList.add('hidden');
    if (cardsContainer) {
      cardsContainer.classList.remove('hidden');
      cardsContainer.innerHTML = items.map(r => `
        <div class="card-wellness p-5 space-y-3">
          <div class="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <span class="badge badge-category">${r.categoryLabel}</span>
              <h4 class="text-base font-bold text-slate-900 mt-1">${r.name}</h4>
            </div>
            <span class="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">${r.verifiedDate}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div><strong class="text-slate-700">Pricing:</strong> <span class="text-slate-600">${r.pricing}</span></div>
            <div><strong class="text-slate-700">Platforms:</strong> <span class="text-slate-600">${r.platforms.join(', ')}</span></div>
            <div><strong class="text-slate-700">Account:</strong> <span class="text-slate-600">${r.accountRequired}</span></div>
            <div><strong class="text-slate-700">Privacy:</strong> <span class="text-forest-700">${r.privacyRating}</span></div>
          </div>

          <div class="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <strong class="text-slate-700">Purpose:</strong> <span class="text-slate-600">${r.purpose}</span>
          </div>

          <div class="text-xs bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
            <strong class="text-amber-900">Limitations:</strong> <span class="text-slate-600">${r.limitations}</span>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-100">
            <button onclick="openResourceModal('${r.id}')" class="text-xs font-semibold text-forest-800 hover:underline">
              View Detailed Specs
            </button>
            <a href="${r.officialUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-forest-800 bg-forest-50 px-2.5 py-1 rounded hover:bg-forest-100">
              Official Site <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
        </div>
      `).join('');
    }
  } else {
    if (cardsContainer) cardsContainer.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');

    tbody.innerHTML = items.map(r => `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-200/80">
        <!-- 1. Resource Name -->
        <td class="py-3.5 px-4 font-semibold text-slate-900 sticky left-0 bg-white/95 backdrop-blur z-10 whitespace-nowrap shadow-xs">
          <div class="flex items-center gap-1.5">
            <button onclick="openResourceModal('${r.id}')" class="text-forest-900 hover:text-forest-700 font-bold hover:underline text-left">
              ${r.name}
            </button>
          </div>
        </td>

        <!-- 2. Category -->
        <td class="py-3 px-3 text-xs whitespace-nowrap">
          <span class="badge badge-category">${r.categoryLabel}</span>
        </td>

        <!-- 3. Primary Purpose -->
        <td class="py-3 px-3 text-xs text-slate-700 min-w-[220px] max-w-xs leading-relaxed">
          ${r.purpose}
        </td>

        <!-- 4. Supported Platforms -->
        <td class="py-3 px-3 text-xs whitespace-nowrap text-slate-700">
          ${r.platforms.join(', ')}
        </td>

        <!-- 5. Pricing Model -->
        <td class="py-3 px-3 text-xs whitespace-nowrap">
          <span class="font-medium text-slate-800">${r.pricing}</span>
        </td>

        <!-- 6. Account Requirements -->
        <td class="py-3 px-3 text-xs whitespace-nowrap text-slate-600">
          ${r.accountRequired}
        </td>

        <!-- 7. Privacy & Data Handling -->
        <td class="py-3 px-3 text-xs min-w-[180px] max-w-xs text-slate-600">
          <span class="font-bold text-forest-700 block">${r.privacyRating}</span>
          ${r.privacy}
        </td>

        <!-- 8. Accessibility -->
        <td class="py-3 px-3 text-xs min-w-[160px] text-slate-600">
          ${r.accessibility}
        </td>

        <!-- 9. Limitations -->
        <td class="py-3 px-3 text-xs min-w-[180px] max-w-xs text-slate-500">
          ${r.limitations}
        </td>

        <!-- 10. Official Source -->
        <td class="py-3 px-3 text-xs whitespace-nowrap">
          <a href="${r.officialUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-forest-800 hover:text-forest-900 font-semibold hover:underline">
            <span>Official</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </td>

        <!-- 11. Verification Date -->
        <td class="py-3 px-3 text-xs text-slate-400 font-mono whitespace-nowrap">
          ${r.verifiedDate}
        </td>
      </tr>
    `).join('');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initComparison };
}
