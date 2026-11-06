/**
 * MINDFUL — Digital Wellness Resource Library
 * Searchable, multi-faceted filterable card directory with technical detail modals.
 */

let activeCategoryFilter = 'all';
let activePlatformFilter = 'all';
let activePricingFilter = 'all';
let currentSearchQuery = '';

function initLibrary() {
  const searchInput = document.getElementById('library-search-input');
  const clearSearchBtn = document.getElementById('library-search-clear');
  const categoryButtons = document.querySelectorAll('#library-category-filters button');
  const platformSelect = document.getElementById('library-platform-filter');
  const pricingSelect = document.getElementById('library-pricing-filter');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('resource-modal');

  // Initial render
  renderLibraryCards();

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('hidden', currentSearchQuery.length === 0);
      }
      renderLibraryCards();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderLibraryCards();
      searchInput.focus();
    });
  }

  // Category filter tabs
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => {
        b.className = "category-btn py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition";
      });
      btn.className = "category-btn active py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-forest-800 shadow-2xs transition";
      activeCategoryFilter = btn.dataset.category;
      renderLibraryCards();
    });
  });

  // Platform select filter
  if (platformSelect) {
    platformSelect.addEventListener('change', (e) => {
      activePlatformFilter = e.target.value;
      renderLibraryCards();
    });
  }

  // Pricing select filter
  if (pricingSelect) {
    pricingSelect.addEventListener('change', (e) => {
      activePricingFilter = e.target.value;
      renderLibraryCards();
    });
  }

  // Modal close handlers
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeResourceModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeResourceModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('resource-modal');
      if (modal && !modal.classList.contains('hidden')) {
        closeResourceModal();
      }
    }
  });
}

function renderLibraryCards() {
  const container = document.getElementById('resource-cards-grid');
  const countBadge = document.getElementById('library-results-count');
  if (!container) return;

  const filtered = RESOURCES_DATA.filter(tool => {
    // 1. Search Query
    if (currentSearchQuery) {
      const combined = `${tool.name} ${tool.tagline} ${tool.purpose} ${tool.categoryLabel} ${tool.platforms.join(' ')} ${tool.limitations}`.toLowerCase();
      if (!combined.includes(currentSearchQuery)) return false;
    }

    // 2. Category Filter
    if (activeCategoryFilter !== 'all' && tool.category !== activeCategoryFilter) {
      return false;
    }

    // 3. Platform Filter
    if (activePlatformFilter !== 'all' && !tool.platformCodes.includes(activePlatformFilter)) {
      return false;
    }

    // 4. Pricing Filter
    if (activePricingFilter !== 'all') {
      if (activePricingFilter === 'free' && tool.pricingModel !== 'free' && tool.pricingModel !== 'foss') return false;
      if (activePricingFilter === 'foss' && tool.pricingModel !== 'foss') return false;
      if (activePricingFilter === 'freemium' && tool.pricingModel !== 'freemium') return false;
      if (activePricingFilter === 'paid' && tool.pricingModel !== 'paid') return false;
    }

    return true;
  });

  if (countBadge) {
    countBadge.textContent = `Showing ${filtered.length} of ${RESOURCES_DATA.length} resources`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <i class="fa-solid fa-magnifying-glass text-3xl text-slate-300 mb-3"></i>
        <h4 class="text-base font-bold text-slate-800">No resources match your filter criteria</h4>
        <p class="text-xs text-slate-500 mt-1 max-w-md mx-auto">Try clearing your search query or setting Category, Platform, and Pricing filters to 'All'.</p>
        <button onclick="resetLibraryFilters()" class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition">
          Reset All Filters
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => {
    let costBadge = 'badge-free';
    if (item.costType === 'open-source') costBadge = 'badge-foss';
    if (item.costType === 'freemium') costBadge = 'badge-freemium';
    if (item.costType === 'paid') costBadge = 'badge-paid';

    return `
      <article class="card-wellness p-6 flex flex-col justify-between" id="resource-card-${item.id}">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <span class="badge ${costBadge} uppercase">${item.pricing.split(' ')[0]}</span>
              <span class="badge badge-category ml-1">${item.categoryLabel}</span>
              <h3 class="text-lg font-bold text-slate-900 mt-2">${item.name}</h3>
            </div>
            <span class="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 shrink-0">
              <i class="fa-regular fa-calendar-check mr-1 text-forest-700"></i>${item.verifiedDate}
            </span>
          </div>

          <p class="text-xs text-slate-500 italic mb-3 font-medium">"${item.tagline}"</p>
          <p class="text-xs text-slate-600 leading-relaxed mb-4">${item.purpose}</p>

          <div class="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
            <div class="flex justify-between items-center">
              <span class="font-bold text-slate-700">Platforms:</span>
              <span class="text-slate-600 text-right">${item.platforms.join(', ')}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold text-slate-700">Pricing Reality:</span>
              <span class="text-slate-600 text-right font-medium">${item.pricing}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold text-slate-700">Privacy Rating:</span>
              <span class="text-forest-700 font-semibold text-right">${item.privacyRating}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="font-bold text-slate-700">Account Needed:</span>
              <span class="text-slate-600 text-right">${item.accountRequired}</span>
            </div>
          </div>

          <div class="space-y-1 text-[11px] text-slate-600 mb-4">
            <div class="flex items-start gap-1.5 text-emerald-800">
              <i class="fa-solid fa-check text-emerald-600 mt-0.5 shrink-0"></i>
              <span><strong>Advantage:</strong> ${item.pros[0]}</span>
            </div>
            <div class="flex items-start gap-1.5 text-amber-800">
              <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
              <span><strong>Limitation:</strong> ${item.limitations}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button onclick="openResourceModal('${item.id}')" class="text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline inline-flex items-center gap-1.5">
            <i class="fa-solid fa-circle-info"></i> Details & Specs
          </button>
          <a href="${item.officialUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-forest-800 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5">
            <span>Official Site</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function resetLibraryFilters() {
  activeCategoryFilter = 'all';
  activePlatformFilter = 'all';
  activePricingFilter = 'all';
  currentSearchQuery = '';

  const searchInput = document.getElementById('library-search-input');
  if (searchInput) searchInput.value = '';

  const platformSelect = document.getElementById('library-platform-filter');
  if (platformSelect) platformSelect.value = 'all';

  const pricingSelect = document.getElementById('library-pricing-filter');
  if (pricingSelect) pricingSelect.value = 'all';

  const categoryButtons = document.querySelectorAll('#library-category-filters button');
  categoryButtons.forEach(b => {
    if (b.dataset.category === 'all') {
      b.className = "category-btn active py-1.5 px-3 rounded-lg text-xs font-semibold text-white bg-forest-800 shadow-2xs transition";
    } else {
      b.className = "category-btn py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition";
    }
  });

  renderLibraryCards();
}

function openResourceModal(resourceId) {
  const item = RESOURCES_DATA.find(r => r.id === resourceId);
  if (!item) return;

  const modal = document.getElementById('resource-modal');
  const modalBody = document.getElementById('modal-content-body');
  if (!modal || !modalBody) return;

  let costBadge = 'badge-free';
  if (item.costType === 'open-source') costBadge = 'badge-foss';
  if (item.costType === 'freemium') costBadge = 'badge-freemium';
  if (item.costType === 'paid') costBadge = 'badge-paid';

  modalBody.innerHTML = `
    <div class="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="badge ${costBadge} uppercase">${item.pricingModel}</span>
          <span class="badge badge-category">${item.categoryLabel}</span>
          <span class="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Verified: ${item.verifiedDate}</span>
        </div>
        <h3 class="text-2xl font-bold text-slate-900">${item.name}</h3>
        <p class="text-sm text-slate-500 italic mt-0.5">"${item.tagline}"</p>
      </div>
    </div>

    <div class="space-y-4 text-xs sm:text-sm">
      <div>
        <h4 class="font-bold text-slate-800 uppercase tracking-wider text-xs mb-1">Primary Purpose & Student Fit</h4>
        <p class="text-slate-600 leading-relaxed">${item.purpose}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <span class="font-bold text-slate-800 block text-xs">Supported Platforms</span>
          <span class="text-slate-600">${item.platforms.join(', ')}</span>
        </div>
        <div>
          <span class="font-bold text-slate-800 block text-xs">Solution Classification</span>
          <span class="text-slate-600">${item.solutionTypeLabel}</span>
        </div>
        <div>
          <span class="font-bold text-slate-800 block text-xs">Verified Pricing Terms</span>
          <span class="text-slate-600 font-medium">${item.pricing}</span>
        </div>
        <div>
          <span class="font-bold text-slate-800 block text-xs">Account Requirement</span>
          <span class="text-slate-600">${item.accountRequired}</span>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 uppercase tracking-wider text-xs mb-1">Privacy & Data Handling Audit</h4>
        <div class="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs">
          <div class="font-bold mb-0.5"><i class="fa-solid fa-shield-halved text-emerald-700 mr-1"></i> Privacy Rating: ${item.privacyRating}</div>
          <p>${item.privacy}</p>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-slate-800 uppercase tracking-wider text-xs mb-1">Accessibility Features</h4>
        <p class="text-slate-600">${item.accessibility}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
          <h5 class="font-bold text-emerald-900 text-xs mb-2 flex items-center gap-1.5">
            <i class="fa-solid fa-circle-check text-emerald-600"></i> Key Advantages
          </h5>
          <ul class="space-y-1.5 text-xs text-slate-700">
            ${item.pros.map(pro => `<li>• ${pro}</li>`).join('')}
          </ul>
        </div>

        <div class="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
          <h5 class="font-bold text-amber-900 text-xs mb-2 flex items-center gap-1.5">
            <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Important Limitations
          </h5>
          <ul class="space-y-1.5 text-xs text-slate-700">
            ${item.cons.map(con => `<li>• ${con}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div class="text-[11px] text-slate-400">
        Fact-checked independently for university academic review.
      </div>
      <div class="flex items-center gap-2">
        <a href="${item.documentationUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition inline-flex items-center gap-1.5">
          <span>Documentation / Docs</span>
          <i class="fa-solid fa-book text-[10px]"></i>
        </a>
        <a href="${item.officialUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm">
          <span>Visit Official Source</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Set focus inside modal for accessibility
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeResourceModal() {
  const modal = document.getElementById('resource-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Make accessible globally
window.openResourceModal = openResourceModal;
window.closeResourceModal = closeResourceModal;
window.resetLibraryFilters = resetLibraryFilters;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initLibrary, openResourceModal, closeResourceModal };
}
