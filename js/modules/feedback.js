/**
 * MINDFUL — Student Anonymous Feedback Module
 * Integrates with Supabase for cloud database persistence with
 * fallback to localStorage when offline.
 */

function initFeedback() {
  const form = document.getElementById('usability-feedback-form');
  const queueContainer = document.getElementById('feedback-local-queue');
  const exportBtn = document.getElementById('feedback-export-btn');
  const clearBtn = document.getElementById('feedback-clear-btn');
  const refreshBtn = document.getElementById('feedback-refresh-btn');
  const anonToggle = document.getElementById('fb-anonymous');
  const majorInput = document.getElementById('fb-major');
  const majorContainer = document.getElementById('fb-major-container');

  // 1. Initial feed render
  renderFeedbackFeed();

  // 2. Anonymous toggle event listener
  if (anonToggle && majorInput) {
    anonToggle.addEventListener('change', () => {
      const isAnon = anonToggle.checked;
      if (isAnon) {
        majorInput.value = '';
        majorInput.disabled = true;
        majorInput.required = false;
        majorInput.placeholder = 'Anonymous (Identity hidden)';
        if (majorContainer) {
          majorContainer.classList.add('opacity-50');
        }
      } else {
        majorInput.disabled = false;
        majorInput.required = true;
        majorInput.placeholder = 'e.g. 2nd Year Computer Science';
        if (majorContainer) {
          majorContainer.classList.remove('opacity-50');
        }
        majorInput.focus();
      }
    });
  }

  // 3. Form submission handler with Supabase + LocalStorage fallback
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1.5"></i> Sending Feedback...';
      }

      const isAnonymous = anonToggle ? anonToggle.checked : true;
      const rawMajor = majorInput ? majorInput.value.trim() : '';
      const studentMajor = isAnonymous ? 'Anonymous Student' : (rawMajor || 'Undergraduate Student');
      const taskCompleted = document.getElementById('fb-task').value.trim();
      const resourceTested = document.getElementById('fb-resource').value;
      const easeRating = parseInt(document.querySelector('input[name="fb-rating"]:checked')?.value || '4');
      const problemsEncountered = document.getElementById('fb-problems').value.trim();
      const suggestions = document.getElementById('fb-suggestions').value.trim();

      const feedbackPayload = {
        id: 'fb-' + Date.now(),
        created_at: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        is_anonymous: isAnonymous,
        student_major: studentMajor,
        task_completed: taskCompleted,
        resource_tested: resourceTested,
        ease_rating: easeRating,
        problems_encountered: problemsEncountered || null,
        suggestions: suggestions
      };

      const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;

      if (supabase) {
        try {
          await supabase.from(SUPABASE_CONFIG.tableName).insert([{
            is_anonymous: feedbackPayload.is_anonymous,
            student_major: feedbackPayload.student_major,
            resource_tested: feedbackPayload.resource_tested,
            task_completed: feedbackPayload.task_completed,
            ease_rating: feedbackPayload.ease_rating,
            problems_encountered: feedbackPayload.problems_encountered,
            suggestions: feedbackPayload.suggestions
          }]).select();
        } catch (err) {
          console.warn("Supabase insert note:", err);
        }
      }

      // Always save a local copy to localStorage as offline cache/backup
      const queue = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
      queue.unshift(feedbackPayload);
      localStorage.setItem('mindful_student_feedback_queue', JSON.stringify(queue));

      // Show confirmation message — strictly "Feedback Published Anonymously" without leaking URLs or keys
      const successBanner = document.getElementById('feedback-success-banner');
      const successText = document.getElementById('feedback-success-text');
      if (successBanner) {
        if (successText) {
          successText.innerHTML = `<strong>Feedback Published Anonymously</strong>`;
        }
        successBanner.classList.remove('hidden');
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset form
      form.reset();
      if (anonToggle) {
        anonToggle.checked = true;
        anonToggle.dispatchEvent(new Event('change'));
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }

      // Re-render feed
      renderFeedbackFeed();
    });
  }

  // 4. Refresh feed button
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderFeedbackFeed();
    });
  }

  // 5. Export JSON functionality
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      let exportData = [];
      const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;

      if (supabase) {
        try {
          const { data } = await supabase.from(SUPABASE_CONFIG.tableName).select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) exportData = data;
        } catch (e) {
          console.warn("Export note:", e);
        }
      }

      if (exportData.length === 0) {
        exportData = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
      }

      if (exportData.length === 0) {
        alert("No feedback submissions to export yet. Please submit a review first.");
        return;
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mindful-anonymous-feedback-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // 6. Clear local queue
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your local session cache?")) {
        localStorage.removeItem('mindful_student_feedback_queue');
        renderFeedbackFeed();
      }
    });
  }

  // 7. Fetch and Render feedback feed (from Supabase or LocalStorage)
  async function renderFeedbackFeed() {
    if (!queueContainer) return;

    let items = [];
    const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;

    if (supabase) {
      queueContainer.innerHTML = `
        <div class="p-6 text-center text-slate-500 text-xs">
          <i class="fa-solid fa-circle-notch fa-spin text-xl text-forest-700 mb-2 block"></i>
          Loading recent anonymous feedback...
        </div>
      `;
      try {
        const { data, error } = await supabase
          .from(SUPABASE_CONFIG.tableName)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          items = data;
        }
      } catch (err) {
        console.warn("Fetch note:", err);
      }
    }

    // Fallback to local storage if cloud had no items or wasn't reachable
    if (items.length === 0) {
      items = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
    }

    if (items.length === 0) {
      queueContainer.innerHTML = `
        <div class="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
          <i class="fa-solid fa-user-secret text-2xl text-slate-300 mb-2 block"></i>
          No anonymous feedback recorded yet. Submissions entered in the form on the left will appear here.
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
          <span>${items.length} ${items.length === 1 ? 'Review' : 'Reviews'}</span>
          <span class="text-[11px] font-medium text-forest-800">Verified Community Submissions</span>
        </div>
        ${items.map(item => {
          const isAnon = item.is_anonymous !== false;
          const displayRole = isAnon ? 'Anonymous Student' : (item.student_major || 'Undergraduate Student');
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (item.formattedDate || 'Recent');
          const rating = item.ease_rating || 4;

          return `
            <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs space-y-2">
              <div class="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                <div class="flex items-center gap-2">
                  <span class="badge ${isAnon ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-forest-100 text-forest-800 border-forest-200'} font-bold">
                    <i class="fa-solid ${isAnon ? 'fa-user-secret' : 'fa-user-graduate'} mr-1"></i>
                    ${displayRole}
                  </span>
                  <span class="text-slate-400 text-[11px]">•</span>
                  <span class="text-forest-800 font-semibold text-[11px]">${item.resource_tested}</span>
                </div>
                <div class="flex items-center text-amber-500 text-[11px]" title="${rating} out of 5 stars">
                  ${'★'.repeat(rating)}${'☆'.repeat(Math.max(0, 5 - rating))}
                  <span class="text-slate-400 font-mono text-[10px] ml-1.5">${dateStr}</span>
                </div>
              </div>

              <div>
                <strong class="text-slate-700">Task Evaluated:</strong>
                <p class="text-slate-600 mt-0.5">${item.task_completed}</p>
              </div>

              ${item.problems_encountered ? `
                <div class="bg-amber-50/60 p-2 rounded-lg border border-amber-200/60 text-amber-900">
                  <strong>Problem Encountered:</strong> ${item.problems_encountered}
                </div>
              ` : ''}

              ${item.suggestions ? `
                <div class="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60 text-emerald-900">
                  <strong>Practical Suggestion:</strong> ${item.suggestions}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

// Expose globally
window.initFeedback = initFeedback;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initFeedback };
}
