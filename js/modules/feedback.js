/**
 * MINDFUL — Student Usability Testing & Feedback Module
 * Local-first persistence engine using localStorage, JSON export capability,
 * structured feedback form validation, and verified revision log rendering.
 */

function initFeedback() {
  const form = document.getElementById('usability-feedback-form');
  const queueContainer = document.getElementById('feedback-local-queue');
  const exportBtn = document.getElementById('feedback-export-btn');
  const clearBtn = document.getElementById('feedback-clear-btn');
  const revisionContainer = document.getElementById('usability-revision-log');

  // Render formal revision log from testingData.js
  renderRevisionLog();
  // Render local browser submission queue
  renderLocalQueue();

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const studentMajor = document.getElementById('fb-major').value.trim();
      const taskCompleted = document.getElementById('fb-task').value.trim();
      const resourceTested = document.getElementById('fb-resource').value;
      const easeRating = document.querySelector('input[name="fb-rating"]:checked')?.value || '4';
      const problemsEncountered = document.getElementById('fb-problems').value.trim();
      const suggestions = document.getElementById('fb-suggestions').value.trim();

      const submission = {
        id: 'fb-' + Date.now(),
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        studentMajor: studentMajor || 'Undergraduate Student',
        taskCompleted,
        resourceTested,
        easeRating: parseInt(easeRating),
        problemsEncountered,
        suggestions
      };

      // Real persistence to localStorage
      const queue = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
      queue.unshift(submission);
      localStorage.setItem('mindful_student_feedback_queue', JSON.stringify(queue));

      // Show clear confirmation message with explanation
      const successBanner = document.getElementById('feedback-success-banner');
      if (successBanner) {
        successBanner.classList.remove('hidden');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();
      renderLocalQueue();
    });
  }

  // Export JSON functionality
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const queue = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
      if (queue.length === 0) {
        alert("No local feedback submissions to export yet. Please submit a review first.");
        return;
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(queue, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mindful-usability-feedback-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Clear local queue
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your local submission queue?")) {
        localStorage.removeItem('mindful_student_feedback_queue');
        renderLocalQueue();
      }
    });
  }

  function renderLocalQueue() {
    if (!queueContainer) return;
    const queue = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');

    if (queue.length === 0) {
      queueContainer.innerHTML = `
        <div class="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
          <i class="fa-solid fa-inbox text-2xl text-slate-300 mb-2 block"></i>
          Your local session testing queue is currently empty. Submissions entered in the form above will be logged here and can be exported as JSON for grading evaluation.
        </div>
      `;
      if (exportBtn) exportBtn.classList.add('opacity-50', 'pointer-events-none');
      if (clearBtn) clearBtn.classList.add('hidden');
      return;
    }

    if (exportBtn) exportBtn.classList.remove('opacity-50', 'pointer-events-none');
    if (clearBtn) clearBtn.classList.remove('hidden');

    queueContainer.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>${queue.length} Local ${queue.length === 1 ? 'Submission' : 'Submissions'} Recorded</span>
          <span class="text-[11px] font-mono">Storage: localStorage</span>
        </div>
        ${queue.map(item => `
          <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs space-y-2">
            <div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
              <div>
                <span class="font-bold text-slate-900">${item.studentMajor}</span>
                <span class="text-slate-400 mx-1.5">•</span>
                <span class="text-forest-700 font-semibold">Tested: ${item.resourceTested}</span>
              </div>
              <div class="flex items-center text-amber-500 text-[11px]" title="${item.easeRating} out of 5 stars">
                ${'★'.repeat(item.easeRating)}${'☆'.repeat(5 - item.easeRating)}
                <span class="text-slate-400 font-mono text-[10px] ml-1.5">${item.formattedDate}</span>
              </div>
            </div>

            <div>
              <strong class="text-slate-700">Task Evaluated:</strong>
              <p class="text-slate-600 mt-0.5">${item.taskCompleted}</p>
            </div>

            ${item.problemsEncountered ? `
              <div class="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60 text-amber-900">
                <strong>Problem Encountered:</strong> ${item.problemsEncountered}
              </div>
            ` : ''}

            ${item.suggestions ? `
              <div class="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60 text-emerald-900">
                <strong>Practical Suggestion:</strong> ${item.suggestions}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderRevisionLog() {
    if (!revisionContainer) return;
    const tests = RESEARCH_DATA.usabilityTests;

    revisionContainer.innerHTML = tests.map(test => `
      <article class="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-xs shrink-0">
              <i class="fa-solid fa-user-graduate"></i>
            </span>
            <div>
              <h4 class="font-bold text-sm text-slate-900">${test.participant} <span class="text-xs font-normal text-slate-500">(${test.major})</span></h4>
              <span class="text-[11px] text-slate-500">Hardware: ${test.devices}</span>
            </div>
          </div>
          <span class="self-start sm:self-auto badge badge-free text-[11px] font-semibold">
            <i class="fa-solid fa-check text-[10px]"></i> ${test.status}
          </span>
        </div>

        <div class="space-y-2.5 text-xs">
          <div>
            <strong class="text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">Task Attempted</strong>
            <p class="text-slate-700 mt-0.5">${test.task}</p>
          </div>

          <div class="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 text-amber-950">
            <strong class="block text-[11px] uppercase tracking-wider text-amber-800"><i class="fa-solid fa-circle-exclamation mr-1"></i> Problem Encountered</strong>
            <p class="mt-0.5">${test.problemIdentified}</p>
            <p class="italic text-[11px] text-amber-900 mt-1">${test.feedbackReceived}</p>
          </div>

          <div class="p-2.5 bg-forest-50/60 rounded-xl border border-forest-100 text-forest-950">
            <strong class="block text-[11px] uppercase tracking-wider text-forest-800"><i class="fa-solid fa-wrench mr-1"></i> Revision Implemented in Platform</strong>
            <p class="mt-0.5">${test.revisionImplemented}</p>
          </div>
        </div>
      </article>
    `).join('');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initFeedback };
}
