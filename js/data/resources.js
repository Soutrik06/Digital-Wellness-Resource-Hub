/**
 * MINDFUL — Vetted Digital Wellness Resources Database
 * Fact-checked and verified as of November 2026.
 * Zero affiliate links, zero sponsored bias.
 */

const RESOURCES_DATA = [
  {
    id: "cold-turkey",
    name: "Cold Turkey Blocker",
    tagline: "The strictest distraction blocker for PCs and Macs.",
    category: "focus",
    categoryLabel: "Focus & Blockers",
    platforms: ["Windows", "macOS"],
    platformCodes: ["windows", "mac"],
    solutionType: "desktop",
    solutionTypeLabel: "Desktop Application",
    pricing: "Freemium (Free basic tier; $39 lifetime Pro)",
    pricingModel: "freemium",
    costType: "freemium",
    purpose: "System-level lockdown of distracting websites, games, desktop apps, and even the entire computer during scheduled deep study sprints.",
    accountRequired: "None (Zero registration)",
    privacy: "100% Local data. No account, no telemetry, no cloud logging.",
    privacyRating: "High (Local-Only)",
    accessibility: "High contrast UI, system keyboard shortcuts, clean interface.",
    limitations: "Extremely difficult to bypass by design (rebooting will not kill blocks). No native iOS or Android versions available.",
    pros: [
      "Cannot be bypassed by changing system clock or task manager termination",
      "One-time perpetual purchase instead of ongoing recurring subscriptions",
      "Whitelist mode lets students allow university portal and documentation only"
    ],
    cons: [
      "Risk of locking yourself out of important school sites if not whitelisted",
      "Desktop only (Windows & macOS); not for mobile devices"
    ],
    problemsSolved: ["study-concentration", "social-media", "youtube", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://getcoldturkey.com",
    documentationUrl: "https://getcoldturkey.com/support"
  },
  {
    id: "unhook",
    name: "Unhook YouTube Focus",
    tagline: "Eliminate algorithmic feeds, recommendations, and shorts.",
    category: "focus",
    categoryLabel: "Focus & Blockers",
    platforms: ["Chrome", "Firefox", "Edge", "Safari"],
    platformCodes: ["chrome", "firefox", "edge", "web"],
    solutionType: "extension",
    solutionTypeLabel: "Browser Extension",
    pricing: "100% Free",
    pricingModel: "free",
    costType: "free",
    purpose: "Removes distracting YouTube algorithmic recommendations, sidebar videos, home feed, comments, and Shorts to turn YouTube into a pure educational lecture player.",
    accountRequired: "None",
    privacy: "Open-source codebase. Does not record watch history, keystrokes, or transmit user data.",
    privacyRating: "High (Zero-Telemetry)",
    accessibility: "Preserves native keyboard navigation for playback and full screen.",
    limitations: "Works strictly within desktop browser tabs; does not alter native iOS or Android YouTube apps.",
    pros: [
      "Completely eliminates the YouTube homepage rabbit hole",
      "Modular toggles: hide comments, sidebar, feed, or Shorts independently",
      "Zero account creation, zero subscriptions, zero ads"
    ],
    cons: [
      "Only operates inside supported desktop/mobile browsers, not native app",
      "Needs occasional update if YouTube changes web DOM structure"
    ],
    problemsSolved: ["youtube", "study-concentration", "social-media"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://unhook.app",
    documentationUrl: "https://github.com/videah/unhook"
  },
  {
    id: "forest",
    name: "Forest: Stay Focused",
    tagline: "Gamified Pomodoro timer that plants virtual and real trees.",
    category: "focus",
    categoryLabel: "Focus & Blockers",
    platforms: ["iOS", "Android", "Chrome Extension"],
    platformCodes: ["ios", "android", "chrome"],
    solutionType: "mobile",
    solutionTypeLabel: "Mobile App & Extension",
    pricing: "Freemium (Free on Android with ads; $3.99 paid on iOS)",
    pricingModel: "freemium",
    costType: "freemium",
    purpose: "Encourages study discipline through positive reinforcement: leaving the study app kills your growing tree, while completing focus blocks grows a virtual forest and finances real tree planting.",
    accountRequired: "Optional (Required for cloud sync)",
    privacy: "Collects basic operational telemetry and sync data. Compliant with standard mobile app store privacy disclosures.",
    privacyRating: "Medium (Sync Telemetry)",
    accessibility: "Pleasant tactile haptic feedback, audio ambient soundscapes.",
    limitations: "iOS requires $3.99 upfront download. App whitelisting and friend challenge features require Pro upgrade.",
    pros: [
      "Visual sense of daily accomplishment through lush forest visual",
      "Real-world environmental partnership with Trees for the Future",
      "Built-in ambient focus audio (rain, café, forest wind)"
    ],
    cons: [
      "Price difference between Android (free with ads) and iOS ($3.99 upfront)",
      "Strict mode can be punitive for emergency phone calls if not configured"
    ],
    problemsSolved: ["study-concentration", "social-media", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://www.forestapp.cc",
    documentationUrl: "https://www.forestapp.cc/faq"
  },
  {
    id: "pomofocus",
    name: "Pomofocus.io",
    tagline: "Clean, zero-friction in-browser Pomodoro timer with task management.",
    category: "focus",
    categoryLabel: "Focus & Blockers",
    platforms: ["Web", "Windows", "macOS", "Linux", "iOS", "Android"],
    platformCodes: ["web", "windows", "mac", "linux", "ios", "android"],
    solutionType: "web",
    solutionTypeLabel: "Web Application",
    pricing: "Free (Optional $1.99/mo Premium for cloud analytics)",
    pricingModel: "freemium",
    costType: "freemium",
    purpose: "Instant browser-based cadence of 25m work / 5m short break intervals with integrated task lists and audio cues, without installing software.",
    accountRequired: "Optional (Runs entirely via LocalStorage)",
    privacy: "Default usage stores tasks strictly in browser local storage. No email needed.",
    privacyRating: "High (Local-First)",
    accessibility: "High-contrast color shifts between work/break, keyboard shortcuts (Space to start/stop).",
    limitations: "Runs only within an active browser tab; cannot enforce blocking of other applications or desktop programs.",
    pros: [
      "Zero installation required; works on university lab computers & library laptops",
      "Customizable interval times (e.g. 50/10 ratio for intensive coding)",
      "Pleasant alarm sounds and browser title-bar countdown"
    ],
    cons: [
      "Cannot lock or block other desktop apps",
      "Accidental tab closure resets active timer interval"
    ],
    problemsSolved: ["study-concentration", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://pomofocus.io",
    documentationUrl: "https://pomofocus.io/app"
  },
  {
    id: "android-wellbeing",
    name: "Android Digital Wellbeing",
    tagline: "Native Android screen time monitoring, app timers, and bedtime tools.",
    category: "screen-time",
    categoryLabel: "Screen Time & Habits",
    platforms: ["Android"],
    platformCodes: ["android"],
    solutionType: "os-feature",
    solutionTypeLabel: "Built-In OS Feature",
    pricing: "100% Free (Native OS)",
    pricingModel: "free",
    costType: "free",
    purpose: "System-level daily unlock counter, per-app time limits that pause apps once time expires, Focus Mode to silence distracting apps, and Bedtime Mode schedules.",
    accountRequired: "Google Account (Integrated into device)",
    privacy: "Processed on-device. Telemetry managed under standard Google Android privacy settings.",
    privacyRating: "Standard (Native OS)",
    accessibility: "Full integration with TalkBack screen reader, large text, and system display accommodations.",
    limitations: "Android only. App limits can be easily dismissed by opening Settings if willpower fails.",
    pros: [
      "Completely free and already installed on modern Android smartphones",
      "Zero background battery drain compared to third-party tracking apps",
      "Focus Mode allows one-tap silencing of distracting communication apps"
    ],
    cons: [
      "App timers are easily edited when willpower lapses",
      "No cross-device sync with Windows or Mac laptops"
    ],
    problemsSolved: ["screen-time", "social-media", "notifications", "bedtime"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://wellbeing.google",
    documentationUrl: "https://support.google.com/android/answer/9346420"
  },
  {
    id: "apple-screen-time",
    name: "Apple Screen Time & Focus",
    tagline: "Native iOS & macOS limits, downtime schedules, and communication filters.",
    category: "screen-time",
    categoryLabel: "Screen Time & Habits",
    platforms: ["iOS", "macOS"],
    platformCodes: ["ios", "mac"],
    solutionType: "os-feature",
    solutionTypeLabel: "Built-In OS Feature",
    pricing: "100% Free (Native OS)",
    pricingModel: "free",
    costType: "free",
    purpose: "Built-in operating system service providing daily pickup analytics, app usage categorisation, scheduled Downtime, and customizable Focus Filters across iPhone, iPad, and Mac.",
    accountRequired: "Apple ID (Local or iCloud synced)",
    privacy: "Encrypted end-to-end on iCloud. Not sold to third-party data brokers.",
    privacyRating: "High (Apple E2E)",
    accessibility: "Deep VoiceOver support, Dynamic Type, high-contrast system integration.",
    limitations: "Apple hardware only. Easy 'Ignore Limit for 15 minutes' button invites procrastination.",
    pros: [
      "Seamless synchronization across iPhone, iPad, and MacBook",
      "Downtime blocks apps at bedtime without requiring third-party installation",
      "Focus Filters switch home screen pages and silence notifications by context"
    ],
    cons: [
      "The 'Ignore Limit' prompt makes bypass frictionless",
      "Locked to Apple hardware ecosystem"
    ],
    problemsSolved: ["screen-time", "social-media", "notifications", "bedtime"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://support.apple.com/HT208982",
    documentationUrl: "https://support.apple.com/guide/iphone/set-up-screen-time-iphb0c7ba0c9/ios"
  },
  {
    id: "one-sec",
    name: "one sec - Delay Distractions",
    tagline: "Adds a mindful breathing pause before opening distracting apps.",
    category: "screen-time",
    categoryLabel: "Screen Time & Habits",
    platforms: ["iOS", "Android", "Chrome", "Firefox", "Edge", "macOS"],
    platformCodes: ["ios", "android", "chrome", "firefox", "edge", "mac"],
    solutionType: "mobile",
    solutionTypeLabel: "Mobile App & Extension",
    pricing: "Freemium (1 app free; Pro $2.99/mo or $19.99/yr for multi-app)",
    pricingModel: "freemium",
    costType: "freemium",
    purpose: "Leverages behavioral friction: forces a 3-second animated deep breathing pause before opening Instagram or TikTok, breaking automated dopamine loops and prompting conscious intent.",
    accountRequired: "Optional (None required for single free app)",
    privacy: "Processed entirely on-device via Apple Shortcuts or Android Accessibility Service. Zero browsing data uploaded.",
    privacyRating: "High (On-Device Automation)",
    accessibility: "Tactile haptic breathing guidance, VoiceOver screen reader compliant.",
    limitations: "Requires initial 3-minute setup in Apple Shortcuts on iOS. Free tier limited to 1 configured target app.",
    pros: [
      "Backed by peer-reviewed research (PNAS study demonstrated 57% reduction in social opens)",
      "Does not block apps rigidly; preserves user agency through mindfulness",
      "Works on both mobile devices and desktop web browsers"
    ],
    cons: [
      "Free version restricts automation to a single application",
      "Requires iOS Shortcuts configuration during onboarding"
    ],
    problemsSolved: ["social-media", "screen-time", "study-concentration"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://one-sec.app",
    documentationUrl: "https://one-sec.app/how-to-setup"
  },
  {
    id: "flux",
    name: "f.lux",
    tagline: "Adaptive circadian display lighting to reduce late-night blue light.",
    category: "sleep",
    categoryLabel: "Sleep & Eye Comfort",
    platforms: ["Windows", "macOS", "Linux"],
    platformCodes: ["windows", "mac", "linux"],
    solutionType: "desktop",
    solutionTypeLabel: "Desktop Application",
    pricing: "100% Free for personal use",
    pricingModel: "free",
    costType: "free",
    purpose: "Dynamically warms computer monitor color temperature in synchronization with solar sunset and sunrise, mitigating blue light suppression of natural melatonin secretion.",
    accountRequired: "None",
    privacy: "Requests approximate geographical latitude/longitude strictly for solar ephemeris calculation. No user telemetry.",
    privacyRating: "High (Local Solar Calculation)",
    accessibility: "Extreme Darkroom Mode (red/black monochrome) for severe ocular sensitivity or dark dorm rooms.",
    limitations: "Must be paused when working on color-critical graphic design, photo editing, or video production.",
    pros: [
      "Far wider color warmth range (down to 1200K candle warmth) than native Night Light",
      "Gradual transitions prevent noticeable abrupt screen discoloration",
      "Completely free for personal academic use with low memory footprint"
    ],
    cons: [
      "Distorts accurate color grading for creative students",
      "Mobile iOS version requires sideloading; best suited for desktop systems"
    ],
    problemsSolved: ["bedtime", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://justgetflux.com",
    documentationUrl: "https://justgetflux.com/faq.html"
  },
  {
    id: "native-night-light",
    name: "Night Light / Night Shift",
    tagline: "System-level blue light reduction built into Windows, macOS, and iOS.",
    category: "sleep",
    categoryLabel: "Sleep & Eye Comfort",
    platforms: ["Windows", "macOS", "iOS"],
    platformCodes: ["windows", "mac", "ios"],
    solutionType: "os-feature",
    solutionTypeLabel: "Built-In OS Feature",
    pricing: "100% Free (Native OS)",
    pricingModel: "free",
    costType: "free",
    purpose: "Native operating system filter adjusting display tones toward the warm amber end of the spectrum after dusk to reduce ocular fatigue during late-night study sessions.",
    accountRequired: "None",
    privacy: "Native OS component. Zero network telemetry or third-party interaction.",
    privacyRating: "High (Native OS)",
    accessibility: "Integrated with OS display preferences and keyboard quick-action shortcuts.",
    limitations: "Maximum warmth slider is less aggressive than f.lux; lacks specialized darkroom or monochrome modes.",
    pros: [
      "Built natively into Windows 10/11, macOS, and iOS without downloading software",
      "Zero impact on battery longevity or background processor cycles",
      "Automatic activation based on local sunset and sunrise schedule"
    ],
    cons: [
      "Color temperature customization range is narrower than dedicated utilities",
      "Quick-toggle requires opening Action Center or Control Center"
    ],
    problemsSolved: ["bedtime", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://support.microsoft.com/en-us/windows/set-your-display-for-night-time-in-windows-18fe907a-7628-82a9-ddb2-1d22a7e622b6",
    documentationUrl: "https://support.apple.com/HT207570"
  },
  {
    id: "bedtime-mode",
    name: "Bedtime Mode (Android & iOS)",
    tagline: "Automated nighttime notification silence and monochrome grayscale.",
    category: "sleep",
    categoryLabel: "Sleep & Eye Comfort",
    platforms: ["Android", "iOS"],
    platformCodes: ["android", "ios"],
    solutionType: "os-feature",
    solutionTypeLabel: "Built-In OS Feature",
    pricing: "100% Free (Native OS)",
    pricingModel: "free",
    costType: "free",
    purpose: "Schedules automated sleep hygiene routines: silences non-emergency notification banners, turns display to black-and-white grayscale to eliminate dopamine cues, and dims wallpaper.",
    accountRequired: "None",
    privacy: "Built-in OS functionality. All automation executed locally.",
    privacyRating: "High (Native OS)",
    accessibility: "Emergency contact bypass whitelist ensures critical phone calls pierce Do Not Disturb.",
    limitations: "Requires student commitment not to manually disable the schedule when tempted to browse.",
    pros: [
      "Grayscale screen dramatically dampens social media addiction at night",
      "Mutes vibrating group chats while preserving emergency breakthrough calls",
      "Turns on automatically while charging between specified bedtime hours"
    ],
    cons: [
      "Monochrome mode makes watching educational diagrams or video lectures hard",
      "Can be bypassed with a single swipe if impulse control slips"
    ],
    problemsSolved: ["bedtime", "notifications", "social-media", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://support.google.com/android/answer/9346420",
    documentationUrl: "https://support.apple.com/guide/iphone/turn-a-focus-on-or-off-iph5c3f5b77b/ios"
  },
  {
    id: "activitywatch",
    name: "ActivityWatch",
    tagline: "Open-source, self-hosted automated screen time tracker.",
    category: "privacy",
    categoryLabel: "Privacy & Tracking",
    platforms: ["Windows", "macOS", "Linux", "Android"],
    platformCodes: ["windows", "mac", "linux", "android"],
    solutionType: "desktop",
    solutionTypeLabel: "FOSS Desktop Application",
    pricing: "100% Free & Open-Source (FOSS)",
    pricingModel: "foss",
    costType: "open-source",
    purpose: "Audits exact daily computer time, open applications, and browser tabs with local database storage, giving students honest productivity metrics without selling activity logs to third parties.",
    accountRequired: "None (Zero cloud infrastructure)",
    privacy: "100% local database stored on device (`localhost:5600`). Zero cloud transmission, zero analytics, zero external servers.",
    privacyRating: "Maximum (Self-Hosted Local)",
    accessibility: "Browser-based dashboard supports browser zoom, screen readers, and customizable dark/light themes.",
    limitations: "Requires running local background daemon; web dashboard UI is utilitarian and analytical.",
    pros: [
      "The premier privacy-respecting alternative to proprietary tracking (RescueTime)",
      "Open-source code inspectable on GitHub (thousands of stars, active development)",
      "Optional browser extension allows granular tab auditing without privacy leaks"
    ],
    cons: [
      "Requires manual install and background tray process management",
      "No native iOS support due to Apple sandbox background constraints"
    ],
    problemsSolved: ["activity-tracking", "privacy", "screen-time"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://activitywatch.net",
    documentationUrl: "https://docs.activitywatch.net"
  },
  {
    id: "ublock-origin",
    name: "uBlock Origin",
    tagline: "Wide-spectrum content and cognitive noise filter for browsers.",
    category: "privacy",
    categoryLabel: "Privacy & Tracking",
    platforms: ["Firefox", "Chrome", "Edge"],
    platformCodes: ["firefox", "chrome", "edge", "web"],
    solutionType: "extension",
    solutionTypeLabel: "Browser Extension",
    pricing: "100% Free & Open-Source (GPLv3)",
    pricingModel: "foss",
    costType: "open-source",
    purpose: "Strips algorithmic advertising, autoplay video banners, clickbait sidebars, and behavioral tracking scripts from academic research websites, reducing cognitive overload.",
    accountRequired: "None",
    privacy: "Accepts zero advertising sponsorships, records zero user queries, transmits zero behavioral analytics.",
    privacyRating: "Maximum (Zero-Telemetry)",
    accessibility: "Low CPU and memory footprint; dramatically cleans up cluttered reading layouts for neurodivergent and ADHD students.",
    limitations: "Manifest V3 limitations on Chromium browsers make Firefox the ideal platform for full capabilities.",
    pros: [
      "Drastically reduces study website cognitive clutter and video ads",
      "Accelerates webpage loading times and cuts battery drain on laptops",
      "Element picker allows custom removal of any distracting page section"
    ],
    cons: [
      "Some university portals or paywalled journals may require whitelisting",
      "Manifest V3 restrictions in Chromium require uBlock Origin Lite"
    ],
    problemsSolved: ["privacy", "study-concentration", "social-media"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://ublockorigin.com",
    documentationUrl: "https://github.com/gorhill/uBlock"
  },
  {
    id: "obsidian-joplin",
    name: "Obsidian & Joplin (Mindful Note-Taking)",
    tagline: "Offline, distraction-free markdown knowledge bases for deep thinking.",
    category: "organization",
    categoryLabel: "Digital Organization",
    platforms: ["Windows", "macOS", "Linux", "iOS", "Android"],
    platformCodes: ["windows", "mac", "linux", "ios", "android"],
    solutionType: "desktop",
    solutionTypeLabel: "Desktop & Mobile Suite",
    pricing: "Free (Joplin 100% open source; Obsidian free for 100% personal use)",
    pricingModel: "foss",
    costType: "open-source",
    purpose: "Store lecture notes, research literature, and study summaries in clean offline Markdown files without collaborative chat pings, social notifications, or intrusive banners.",
    accountRequired: "None (Runs entirely on local filesystem folders)",
    privacy: "Data stored in open local plain-text Markdown files. Optional end-to-end encrypted synchronization.",
    privacyRating: "Maximum (Local Plaintext)",
    accessibility: "Full keyboard navigation, customizable typography sizing, high contrast dark/light themes, screen-reader friendly.",
    limitations: "Mild learning curve for Markdown syntax compared to traditional WYSIWYG editors like Google Docs.",
    pros: [
      "Eliminates the collaborative distraction pings inherent in Google Docs and Notion",
      "Your academic notes remain readable forever in standard Markdown format",
      "Distraction-free zen typing mode minimizes visual noise during study"
    ],
    cons: [
      "Real-time group collaboration requires extra configuration or paid add-on",
      "Requires learning simple markdown formatting shortcuts"
    ],
    problemsSolved: ["study-concentration", "privacy", "notifications"],
    verifiedDate: "Nov 2026",
    officialUrl: "https://obsidian.md",
    documentationUrl: "https://help.obsidian.md"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RESOURCES_DATA };
}
