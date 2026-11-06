/**
 * MINDFUL — Digital Wellness Resource Hub
 * Main Application Coordinator
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular subsystems
  try {
    if (typeof initNavigation === 'function') initNavigation();
    if (typeof initAssessment === 'function') initAssessment();
    if (typeof initMatcher === 'function') initMatcher();
    if (typeof initLibrary === 'function') initLibrary();
    if (typeof initComparison === 'function') initComparison();
    if (typeof initGuides === 'function') initGuides();
    if (typeof initToolkit === 'function') initToolkit();
    if (typeof initFeedback === 'function') initFeedback();
    if (typeof initMethodology === 'function') initMethodology();

    console.info("MINDFUL platform initialized successfully with full accessibility, privacy safeguards, and WCAG 2.2 AA standards.");
  } catch (err) {
    console.error("Error during MINDFUL platform initialization:", err);
  }
});
