/**
 * MINDFUL — Practical Setup Guides Module
 * 3 Step-by-Step student tutorials with accessible ARIA tabs, keyboard navigation,
 * structured UI mockup visualizers, and interactive troubleshooting accordions.
 */

function initGuides() {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  tabs.forEach((tab, index) => {
    // Click activation
    tab.addEventListener('click', () => {
      switchGuideTab(index + 1);
    });

    // Keyboard navigation (WCAG 2.1 Tab Pattern)
    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        tabs[targetIndex].focus();
        switchGuideTab(targetIndex + 1);
      }
    });
  });

  // Troubleshooting accordion toggles
  document.querySelectorAll('.troubleshoot-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.troubleshoot-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      btn.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('hidden', isExpanded);
      }
      if (icon) {
        icon.className = `troubleshoot-icon fa-solid fa-chevron-${isExpanded ? 'down' : 'up'} text-xs text-slate-400 transition-transform`;
      }
    });
  });
}

function switchGuideTab(guideNum) {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  tabs.forEach((tab, i) => {
    const isCurrent = (i + 1) === guideNum;
    tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    tab.setAttribute('tabindex', isCurrent ? '0' : '-1');

    if (isCurrent) {
      tab.className = "guide-tab-btn py-3 px-4 font-bold text-sm border-b-2 border-forest-800 text-forest-900 flex items-center gap-2 transition";
    } else {
      tab.className = "guide-tab-btn py-3 px-4 font-semibold text-sm border-b-2 border-transparent text-slate-500 hover:text-slate-800 flex items-center gap-2 transition";
    }
  });

  panels.forEach((panel, i) => {
    const isCurrent = (i + 1) === guideNum;
    if (isCurrent) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  });
}

// Make accessible globally
window.switchGuide = switchGuideTab;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initGuides, switchGuideTab };
}
