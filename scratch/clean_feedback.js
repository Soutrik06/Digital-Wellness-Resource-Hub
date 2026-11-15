const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../../../../../../../Users/stepp/Downloads/DW_proj/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update navigation items: "Usability" -> "Feedback"
html = html.replace(
  '<a href="#feedback" class="px-2.5 py-1.5 rounded-lg hover:text-forest-800 hover:bg-forest-50/70 transition-all whitespace-nowrap">Usability</a>',
  '<a href="#feedback" class="px-2.5 py-1.5 rounded-lg hover:text-forest-800 hover:bg-forest-50/70 transition-all whitespace-nowrap">Feedback</a>'
);
html = html.replace(
  '<span>Usability Tests</span>',
  '<span>Feedback</span>'
);

// 2. Update Section H header
const oldHeaderRegex = /<div class="text-center max-w-3xl mx-auto mb-10">\s*<span class="badge badge-category uppercase font-bold tracking-wider mb-1">Empirical Iteration<\/span>\s*<h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-forest-950">\s*Student Feedback &amp; Usability Testing Audit\s*<\/h2>\s*<p class="text-xs sm:text-sm text-slate-600 mt-2">[\s\S]*?<\/p>\s*<div id="supabase-status-badge"[^>]*><\/div>\s*<\/div>/;

const newHeader = `<div class="text-center max-w-3xl mx-auto mb-10">
          <span class="badge badge-category uppercase font-bold tracking-wider mb-1">Community Reviews</span>
          <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-forest-950">
            Student Feedback &amp; Reviews
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-2">
            Share your experience with digital wellness tools and explore reviews submitted by students.
          </p>
        </div>`;

if (oldHeaderRegex.test(html)) {
  html = html.replace(oldHeaderRegex, newHeader);
  console.log('PASS: Updated Section H header');
} else {
  console.warn('WARN: oldHeaderRegex did not match');
}

// 3. Remove Academic Testing Audit & Formal Revision Log
const revisionLogRegex = /<!-- FORMAL REVISION LOG -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
const replacementSectionEnd = `</div>
      </div>
    </section>`;

if (revisionLogRegex.test(html)) {
  html = html.replace(revisionLogRegex, replacementSectionEnd);
  console.log('PASS: Removed Academic Testing Audit / Revision Log');
} else {
  // Try direct string matching
  const startIdx = html.indexOf('<!-- FORMAL REVISION LOG -->');
  if (startIdx !== -1) {
    const endIdx = html.indexOf('</section>', startIdx);
    if (endIdx !== -1) {
      html = html.substring(0, startIdx) + '</div>\n    </section>' + html.substring(endIdx + '</section>'.length);
      console.log('PASS: Removed Academic Testing Audit via substring');
    }
  } else {
    console.warn('WARN: Could not find FORMAL REVISION LOG');
  }
}

// 4. Remove the Supabase config modal and trigger button from index.html to prevent key leakage
const modalStart = html.indexOf('<!-- SUPABASE BACKEND CONFIGURATION & SQL MODAL -->');
if (modalStart !== -1) {
  const modalEnd = html.indexOf('</main>', modalStart);
  if (modalEnd !== -1) {
    html = html.substring(0, modalStart) + html.substring(modalEnd);
    console.log('PASS: Removed Supabase modal from public front-end');
  }
}

// Remove the trigger button in card footer
html = html.replace(
  /<button id="btn-open-supabase-modal"[\s\S]*?<\/button>/,
  '<span class="text-forest-800 font-semibold text-[11px]"><i class="fa-solid fa-lock text-forest-700 mr-1"></i> Anonymous &amp; Encrypted</span>'
);

// Success banner in HTML
html = html.replace(
  '<span id="feedback-success-text"><strong>Saved:</strong> Your testing submission has been recorded.</span>',
  '<span id="feedback-success-text"><strong>Feedback Published Anonymously</strong></span>'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html!');
