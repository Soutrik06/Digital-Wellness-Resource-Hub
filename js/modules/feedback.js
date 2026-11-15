/**
 * MINDFUL — Student Usability Testing & Anonymous Feedback Module
 * Integrates with Supabase for cloud database persistence with
 * fallback to localStorage when offline or running in local demo mode.
 */

function initFeedback() {
  const form = document.getElementById('usability-feedback-form');
  const queueContainer = document.getElementById('feedback-local-queue');
  const exportBtn = document.getElementById('feedback-export-btn');
  const clearBtn = document.getElementById('feedback-clear-btn');
  const refreshBtn = document.getElementById('feedback-refresh-btn');
  const revisionContainer = document.getElementById('usability-revision-log');
  const anonToggle = document.getElementById('fb-anonymous');
  const majorInput = document.getElementById('fb-major');
  const majorContainer = document.getElementById('fb-major-container');
  const supabaseStatusBadge = document.getElementById('supabase-status-badge');
  const supabaseModal = document.getElementById('supabase-config-modal');
  const openSupabaseModalBtn = document.getElementById('btn-open-supabase-modal');
  const closeSupabaseModalBtn = document.getElementById('btn-close-supabase-modal');
  const saveSupabaseForm = document.getElementById('supabase-credentials-form');

  // 1. Initial renders
  renderRevisionLog();
  updateSupabaseStatusUI();
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

  // 3. Supabase config modal handlers
  if (openSupabaseModalBtn && supabaseModal) {
    openSupabaseModalBtn.addEventListener('click', () => {
      supabaseModal.classList.remove('hidden');
      const urlInput = document.getElementById('sb-input-url');
      const keyInput = document.getElementById('sb-input-key');
      if (urlInput) urlInput.value = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || localStorage.getItem('mindful_supabase_url') || '';
      if (keyInput) keyInput.value = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || localStorage.getItem('mindful_supabase_anon_key') || '';
    });
  }

  if (closeSupabaseModalBtn && supabaseModal) {
    closeSupabaseModalBtn.addEventListener('click', () => {
      supabaseModal.classList.add('hidden');
    });
  }

  if (saveSupabaseForm) {
    saveSupabaseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = document.getElementById('sb-input-url').value.trim();
      const key = document.getElementById('sb-input-key').value.trim();
      const testMsg = document.getElementById('sb-test-message');

      if (testMsg) {
        testMsg.innerHTML = '<span class="text-slate-600"><i class="fa-solid fa-spinner fa-spin mr-1"></i> Testing connection to Supabase...</span>';
        testMsg.classList.remove('hidden');
      }

      if (typeof window.saveSupabaseCredentials === 'function') {
        const client = window.saveSupabaseCredentials(url, key);
        if (client) {
          try {
            // Quick test ping
            const { error } = await client.from(SUPABASE_CONFIG.tableName).select('id').limit(1);
            if (error) {
              if (testMsg) {
                testMsg.innerHTML = `<span class="text-amber-800"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Connected to Supabase, but table "${SUPABASE_CONFIG.tableName}" was not found. Please run the SQL schema in your Supabase SQL Editor.</span>`;
              }
            } else {
              if (testMsg) {
                testMsg.innerHTML = '<span class="text-emerald-700 font-semibold"><i class="fa-solid fa-circle-check mr-1"></i> Success! Connected to Supabase backend table.</span>';
              }
              setTimeout(() => {
                if (supabaseModal) supabaseModal.classList.add('hidden');
                updateSupabaseStatusUI();
                renderFeedbackFeed();
              }, 1200);
            }
          } catch (err) {
            if (testMsg) {
              testMsg.innerHTML = `<span class="text-rose-700"><i class="fa-solid fa-circle-xmark mr-1"></i> Connection failed: ${err.message || 'Check URL and Key'}</span>`;
            }
          }
        }
      }
    });

    const resetSbBtn = document.getElementById('btn-reset-supabase');
    if (resetSbBtn) {
      resetSbBtn.addEventListener('click', () => {
        if (confirm("Revert to local storage demo mode?")) {
          if (typeof window.resetSupabaseCredentials === 'function') {
            window.resetSupabaseCredentials();
          }
          if (supabaseModal) supabaseModal.classList.add('hidden');
          updateSupabaseStatusUI();
          renderFeedbackFeed();
        }
      });
    }
  }

  // 4. Form submission handler with Supabase + LocalStorage fallback
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

      let savedToCloud = false;
      const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;

      if (supabase) {
        try {
          const { data, error } = await supabase.from(SUPABASE_CONFIG.tableName).insert([{
            is_anonymous: feedbackPayload.is_anonymous,
            student_major: feedbackPayload.student_major,
            resource_tested: feedbackPayload.resource_tested,
            task_completed: feedbackPayload.task_completed,
            ease_rating: feedbackPayload.ease_rating,
            problems_encountered: feedbackPayload.problems_encountered,
            suggestions: feedbackPayload.suggestions
          }]).select();

          let insertError = null;
          if (!error) {
            savedToCloud = true;
          } else {
            insertError = error;
            console.warn("Supabase insert error (falling back to localStorage):", error);
          }
        } catch (err) {
          console.warn("Network or Supabase exception:", err);
        }
      }

      // Always save a local copy to localStorage as offline cache/backup
      const queue = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
      queue.unshift(feedbackPayload);
      localStorage.setItem('mindful_student_feedback_queue', JSON.stringify(queue));

      // Show confirmation message
      const successBanner = document.getElementById('feedback-success-banner');
      const successText = document.getElementById('feedback-success-text');
      if (successBanner) {
        if (successText) {
          if (savedToCloud) {
            successText.innerHTML = `<strong>Feedback Published Anonymously:</strong> Your review has been securely saved to your live <strong>Supabase</strong> cloud database (<code>${window.SUPABASE_CONFIG.url}</code>) with zero personal identifiers.`;
          } else if (insertError && (insertError.code === '42P01' || insertError.message?.includes('does not exist'))) {
            successText.innerHTML = `<strong>Saved Locally (Table Pending):</strong> Connected to Supabase project, but table <code>${window.SUPABASE_CONFIG.tableName}</code> does not exist yet. Please run the SQL schema in your Supabase SQL Editor to activate cloud syncing.`;
          } else {
            successText.innerHTML = `<strong>Saved to Local Queue:</strong> Your review has been saved in your browser session queue. (Connect Supabase to publish to the cloud backend).`;
          }
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

  // 5. Refresh feed button
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderFeedbackFeed();
    });
  }

  // 6. Export JSON functionality
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      let exportData = [];
      const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;

      if (supabase) {
        try {
          const { data } = await supabase.from(SUPABASE_CONFIG.tableName).select('*').order('created_at', { ascending: false });
          if (data && data.length > 0) exportData = data;
        } catch (e) {
          console.warn("Export from Supabase failed, using local cache:", e);
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

  // 7. Clear local queue
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear your local session cache?")) {
        localStorage.removeItem('mindful_student_feedback_queue');
        renderFeedbackFeed();
      }
    });
  }

  // 8. Update Supabase status badge
  function updateSupabaseStatusUI() {
    if (!supabaseStatusBadge) return;
    const isConfigured = typeof window.isSupabaseConfigured === 'function' && window.isSupabaseConfigured();

    if (isConfigured) {
      supabaseStatusBadge.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Supabase Cloud Connected</span>
        </span>
      `;
    } else {
      supabaseStatusBadge.innerHTML = `
        <button id="btn-status-connect" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition cursor-pointer">
          <i class="fa-solid fa-cloud text-amber-600"></i>
          <span>Local Demo Mode (Connect Supabase)</span>
        </button>
      `;
      const btnStatusConnect = document.getElementById('btn-status-connect');
      if (btnStatusConnect && supabaseModal) {
        btnStatusConnect.addEventListener('click', () => {
          supabaseModal.classList.remove('hidden');
        });
      }
    }
  }

  // 9. Fetch and Render feedback feed (from Supabase or LocalStorage)
  async function renderFeedbackFeed() {
    if (!queueContainer) return;

    let items = [];
    let isCloud = false;
    let tableNoticeHtml = '';
    const supabase = typeof window.getSupabaseClient === 'function' ? window.getSupabaseClient() : null;

    if (supabase) {
      queueContainer.innerHTML = `
        <div class="p-6 text-center text-slate-500 text-xs">
          <i class="fa-solid fa-circle-notch fa-spin text-xl text-forest-700 mb-2 block"></i>
          Fetching recent anonymous feedback from Supabase...
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
          isCloud = true;
        } else if (error) {
          console.warn("Could not fetch from Supabase:", error);
          if (error.code === '42P01' || error.message?.includes('does not exist')) {
            tableNoticeHtml = `
              <div class="p-3 mb-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                <i class="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5 shrink-0"></i>
                <div>
                  <strong>Supabase Table Pending:</strong> Connected to your Supabase project, but table <code>${SUPABASE_CONFIG.tableName}</code> was not found. Run <code class="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">supabase/schema.sql</code> in your Supabase SQL Editor to activate live cloud syncing.
                </div>
              </div>
            `;
          }
        }
      } catch (err) {
        console.warn("Could not fetch from Supabase:", err);
      }
    }

    // Fallback to local storage if cloud had no items or wasn't configured
    if (items.length === 0) {
      items = JSON.parse(localStorage.getItem('mindful_student_feedback_queue') || '[]');
      isCloud = false;
    }

    if (items.length === 0) {
      queueContainer.innerHTML = `
        ${tableNoticeHtml}
        <div class="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500 text-xs">
          <i class="fa-solid fa-user-secret text-2xl text-slate-300 mb-2 block"></i>
          No anonymous feedback recorded yet. Submissions entered in the form on the left will be recorded here and synced with Supabase.
        </div>
      `;
      if (exportBtn) exportBtn.classList.add('opacity-50', 'pointer-events-none');
      if (clearBtn) clearBtn.classList.add('hidden');
      return;
    }

    if (exportBtn) exportBtn.classList.remove('opacity-50', 'pointer-events-none');
    if (clearBtn) clearBtn.classList.remove('hidden');

    queueContainer.innerHTML = `
      ${tableNoticeHtml}
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>${items.length} ${isCloud ? 'Cloud' : 'Local'} ${items.length === 1 ? 'Review' : 'Reviews'}</span>
          <span class="text-[11px] font-mono flex items-center gap-1 text-forest-800">
            <i class="fa-solid ${isCloud ? 'fa-database' : 'fa-laptop'}"></i>
            ${isCloud ? 'Backend: Supabase' : 'Backend: localStorage'}
          </span>
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

  // 10. Revision Log Rendering (from testingData.js)
  function renderRevisionLog() {
    if (!revisionContainer) return;
    if (typeof RESEARCH_DATA === 'undefined' || !RESEARCH_DATA.usabilityTests) return;
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

// Expose globally
window.initFeedback = initFeedback;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initFeedback };
}
