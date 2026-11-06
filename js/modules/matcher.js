/**
 * MINDFUL — Constraint-Enforced Wellness Matcher
 * Multi-dimensional recommendation engine enforcing strict platform compatibility,
 * pricing reality, solution type, and targeted problem resolution.
 */

function initMatcher() {
  const btnRun = document.getElementById('btn-run-match');
  const btnReset = document.getElementById('btn-reset-match');
  const resultContainer = document.getElementById('matcher-results-container');

  if (!btnRun) return;

  btnRun.addEventListener('click', () => {
    const selectedProblem = document.getElementById('matcher-problem').value;
    const selectedPlatform = document.getElementById('matcher-platform').value;
    const selectedPricing = document.getElementById('matcher-pricing').value;
    const selectedType = document.getElementById('matcher-type').value;

    // Strict multi-constraint filtering against RESOURCES_DATA
    const matches = RESOURCES_DATA.filter(tool => {
      // 1. Problem match
      const problemMatch = (selectedProblem === 'all') || tool.problemsSolved.includes(selectedProblem);
      if (!problemMatch) return false;

      // 2. Strict Platform compatibility check (NEVER recommend incompatible platform)
      let platformMatch = true;
      if (selectedPlatform !== 'all') {
        platformMatch = tool.platformCodes.includes(selectedPlatform);
      }
      if (!platformMatch) return false;

      // 3. Pricing match
      let pricingMatch = true;
      if (selectedPricing !== 'all') {
        if (selectedPricing === 'free') {
          pricingMatch = tool.pricingModel === 'free' || tool.pricingModel === 'foss';
        } else if (selectedPricing === 'foss') {
          pricingMatch = tool.pricingModel === 'foss';
        } else if (selectedPricing === 'freemium') {
          pricingMatch = tool.pricingModel === 'freemium';
        } else if (selectedPricing === 'paid') {
          pricingMatch = tool.pricingModel === 'paid';
        }
      }
      if (!pricingMatch) return false;

      // 4. Solution type match
      let typeMatch = true;
      if (selectedType !== 'all') {
        if (selectedType === 'mobile') {
          typeMatch = tool.solutionType === 'mobile' || tool.solutionType === 'os-feature';
        } else {
          typeMatch = tool.solutionType === selectedType;
        }
      }
      if (!typeMatch) return false;

      return true;
    });

    renderMatcherResults(matches, {
      problem: selectedProblem,
      platform: selectedPlatform,
      pricing: selectedPricing,
      type: selectedType
    });
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      document.getElementById('matcher-problem').value = 'all';
      document.getElementById('matcher-platform').value = 'all';
      document.getElementById('matcher-pricing').value = 'all';
      document.getElementById('matcher-type').value = 'all';
      resultContainer.classList.add('hidden');
      resultContainer.innerHTML = '';
    });
  }

  function renderMatcherResults(matches, criteria) {
    resultContainer.classList.remove('hidden');

    if (matches.length === 0) {
      // Graceful fallback explaining constraint conflict
      const platformName = document.querySelector(`#matcher-platform option[value="${criteria.platform}"]`)?.textContent || criteria.platform;
      const problemName = document.querySelector(`#matcher-problem option[value="${criteria.problem}"]`)?.textContent || criteria.problem;

      // Find alternatives matching just the problem & platform
      const fallbackTools = RESOURCES_DATA.filter(t => {
        const plat = (criteria.platform === 'all') || t.platformCodes.includes(criteria.platform);
        const prob = (criteria.problem === 'all') || t.problemsSolved.includes(criteria.problem);
        return plat && prob;
      });

      resultContainer.innerHTML = `
        <div class="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 text-xl mt-1 shrink-0"></i>
            <div>
              <h4 class="font-bold text-base text-amber-900">Strict Match: No Single Tool Satisfies All 4 Criteria</h4>
              <p class="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                We enforce strict compatibility to avoid false recommendations. There is currently no tool that simultaneously satisfies 
                <strong>${problemName}</strong> on <strong>${platformName}</strong> with your specific pricing and solution type filters.
              </p>
              ${fallbackTools.length > 0 ? `
                <div class="mt-4 pt-3 border-t border-amber-200">
                  <p class="text-xs font-bold text-amber-900 mb-2">Closest Verified Compatible Alternatives on ${platformName}:</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${fallbackTools.slice(0, 2).map(tool => `
                      <div class="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                        <span class="text-xs font-bold text-forest-800">${tool.name}</span>
                        <p class="text-[11px] text-slate-600 mt-0.5">${tool.purpose.slice(0, 100)}...</p>
                        <span class="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">${tool.pricing}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              <p class="text-xs text-amber-700 mt-3">Try setting <em>Pricing</em> or <em>Solution Type</em> to "Any" to see more options.</p>
            </div>
          </div>
        </div>
      `;
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    // Render matches
    resultContainer.innerHTML = `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-forest-50 border border-forest-200 rounded-xl text-xs text-forest-900">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-circle-check text-forest-700"></i>
            <span class="font-semibold">Found ${matches.length} strictly compatible ${matches.length === 1 ? 'solution' : 'solutions'} matching all criteria.</span>
          </div>
          <span class="text-[11px] text-forest-700">Zero unsupported platforms shown.</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${matches.map(tool => {
            let costBadge = 'badge-free';
            if (tool.costType === 'open-source') costBadge = 'badge-foss';
            if (tool.costType === 'freemium') costBadge = 'badge-freemium';
            if (tool.costType === 'paid') costBadge = 'badge-paid';

            return `
              <div class="card-wellness p-5 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span class="badge ${costBadge} uppercase">${tool.pricingModel}</span>
                      <h4 class="text-base font-bold text-slate-900 mt-1">${tool.name}</h4>
                    </div>
                    <span class="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      ${tool.verifiedDate}
                    </span>
                  </div>

                  <p class="text-xs text-slate-600 leading-relaxed mb-3">
                    ${tool.purpose}
                  </p>

                  <div class="space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                    <div><strong class="text-slate-700">Why It's Suitable:</strong> <span class="text-slate-600">${tool.pros[0]}</span></div>
                    <div><strong class="text-slate-700">Verified Compatibility:</strong> <span class="text-forest-700 font-medium">${tool.platforms.join(', ')}</span></div>
                    <div><strong class="text-slate-700">Pricing Reality:</strong> <span class="text-slate-600">${tool.pricing}</span></div>
                    <div><strong class="text-slate-700">Critical Catch:</strong> <span class="text-amber-800">${tool.limitations}</span></div>
                  </div>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button onclick="openResourceModal('${tool.id}')" class="text-xs font-semibold text-forest-800 hover:text-forest-900 hover:underline inline-flex items-center gap-1">
                    <i class="fa-solid fa-circle-info"></i> Full Specifications
                  </button>
                  <a href="${tool.officialUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-forest-800 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1">
                    <span>Official Source</span>
                    <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMatcher };
}
