/**
 * MINDFUL — Research, Methodology & Academic Sources Module
 * Renders evaluation rubrics, privacy telemetry standards, and verified sources directory.
 */

function initMethodology() {
  const sourcesContainer = document.getElementById('methodology-sources-tbody');
  const rubricContainer = document.getElementById('methodology-privacy-rubric');

  if (rubricContainer) {
    rubricContainer.innerHTML = RESEARCH_DATA.methodology.privacyRubric.map(item => `
      <div class="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
        <span class="badge badge-category font-bold text-xs">${item.rating}</span>
        <p class="text-xs text-slate-600 leading-relaxed mt-1">${item.meaning}</p>
      </div>
    `).join('');
  }

  if (sourcesContainer) {
    sourcesContainer.innerHTML = RESOURCES_DATA.map(tool => `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-200">
        <td class="py-3 px-4 font-bold text-slate-900 whitespace-nowrap text-xs">
          ${tool.name}
        </td>
        <td class="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
          ${tool.categoryLabel}
        </td>
        <td class="py-3 px-3 text-xs text-forest-700 font-medium whitespace-nowrap">
          ${tool.privacyRating}
        </td>
        <td class="py-3 px-3 text-xs text-slate-600 font-mono whitespace-nowrap">
          ${tool.verifiedDate}
        </td>
        <td class="py-3 px-3 text-xs text-slate-700 whitespace-nowrap">
          <a href="${tool.officialUrl}" target="_blank" rel="noopener noreferrer" class="text-forest-800 hover:text-forest-900 font-semibold hover:underline inline-flex items-center gap-1">
            <span>Primary Portal</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </td>
        <td class="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">
          <a href="${tool.documentationUrl}" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:text-slate-900 hover:underline inline-flex items-center gap-1">
            <span>Documentation</span>
            <i class="fa-solid fa-book text-[9px]"></i>
          </a>
        </td>
      </tr>
    `).join('');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMethodology };
}
