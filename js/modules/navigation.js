/**
 * MINDFUL — Navigation & Header Controller
 * Handles mobile drawer, smooth scroll, active navigation indicator, and accessibility.
 */

function initNavigation() {
  const header = document.getElementById('main-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-link');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('bg-white/95', 'shadow-xs', 'border-slate-200');
      header.classList.remove('bg-white/80', 'border-transparent');
    } else {
      header.classList.remove('bg-white/95', 'shadow-xs');
      header.classList.add('bg-white/80');
    }
  }, { passive: true });

  // Mobile Drawer toggling
  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : mobileMenuDrawer.classList.contains('-translate-x-full');
    if (isOpen) {
      mobileMenuDrawer.classList.remove('-translate-x-full');
      mobileMenuBackdrop.classList.remove('hidden', 'opacity-0');
      mobileMenuBackdrop.classList.add('opacity-100');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      // Set focus to first navigation link in mobile drawer
      const firstLink = mobileMenuDrawer.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      mobileMenuDrawer.classList.add('-translate-x-full');
      mobileMenuBackdrop.classList.add('opacity-0');
      mobileMenuBackdrop.classList.remove('opacity-100');
      setTimeout(() => {
        mobileMenuBackdrop.classList.add('hidden');
      }, 300);
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      mobileMenuBtn.focus();
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Close drawer on link click
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuBtn && mobileMenuBtn.getAttribute('aria-expanded') === 'true') {
      toggleMobileMenu(false);
    }
  });

  // IntersectionObserver for active section highlighting in navbar
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('text-forest-800', 'font-bold');
              link.classList.remove('text-slate-600');
            } else {
              link.classList.remove('text-forest-800', 'font-bold');
              link.classList.add('text-slate-600');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(sec => observer.observe(sec));
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initNavigation };
}
