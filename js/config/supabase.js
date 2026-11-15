/**
 * MINDFUL — Supabase Backend Configuration & Client Manager
 * Connected to Project: https://ufriktmzgvzyurjgznyj.supabase.co
 */

const DEFAULT_SUPABASE_URL = 'https://ufriktmzgvzyurjgznyj.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_5nQp4U21FsQfHlw5ciRlzQ_DOc1sMV5';

// Read saved overrides from localStorage if user customizes them, else use project defaults
const savedUrl = localStorage.getItem('mindful_supabase_url');
const savedKey = localStorage.getItem('mindful_supabase_anon_key');

const SUPABASE_CONFIG = {
  url: window.__MINDFUL_SUPABASE_URL__ || (savedUrl && !savedUrl.includes('YOUR_PROJECT') ? savedUrl : DEFAULT_SUPABASE_URL),
  anonKey: window.__MINDFUL_SUPABASE_ANON_KEY__ || (savedKey && !savedKey.includes('YOUR_SUPABASE') ? savedKey : DEFAULT_KEY_FALLBACK(savedKey)),
  tableName: 'anonymous_feedback'
};

function DEFAULT_KEY_FALLBACK(saved) {
  if (saved && saved.length > 20 && !saved.includes('YOUR_SUPABASE')) return saved;
  return DEFAULT_SUPABASE_KEY;
}

let _supabaseClient = null;

/**
 * Checks whether valid, non-placeholder credentials have been provided.
 */
function isSupabaseConfigured() {
  const url = SUPABASE_CONFIG.url || '';
  const key = SUPABASE_CONFIG.anonKey || '';
  const isDefaultUrl = url.includes('YOUR_PROJECT_ID') || url.includes('YOUR_SUPABASE_PROJECT_URL') || !url.startsWith('https://');
  const isDefaultKey = key.includes('YOUR_SUPABASE_ANON_KEY') || key.length < 20;
  return !isDefaultUrl && !isDefaultKey;
}

/**
 * Initializes and returns the Supabase client instance.
 * Returns null if Supabase library is not loaded or credentials are unconfigured.
 */
function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;

  if (!isSupabaseConfigured()) {
    return null;
  }

  if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    try {
      _supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      return _supabaseClient;
    } catch (err) {
      console.warn("Supabase client initialization error:", err);
      return null;
    }
  }

  console.warn("Supabase library (@supabase/supabase-js) not detected on window.");
  return null;
}

/**
 * Save new credentials and re-initialize client
 */
function saveSupabaseCredentials(url, anonKey) {
  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();

  SUPABASE_CONFIG.url = cleanUrl;
  SUPABASE_CONFIG.anonKey = cleanKey;

  localStorage.setItem('mindful_supabase_url', cleanUrl);
  localStorage.setItem('mindful_supabase_anon_key', cleanKey);

  _supabaseClient = null; // force re-initialization
  return getSupabaseClient();
}

/**
 * Clear credentials and revert to default project configuration
 */
function resetSupabaseCredentials() {
  localStorage.removeItem('mindful_supabase_url');
  localStorage.removeItem('mindful_supabase_anon_key');
  SUPABASE_CONFIG.url = DEFAULT_SUPABASE_URL;
  SUPABASE_CONFIG.anonKey = DEFAULT_SUPABASE_KEY;
  _supabaseClient = null;
}

// Expose globally
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.isSupabaseConfigured = isSupabaseConfigured;
window.getSupabaseClient = getSupabaseClient;
window.saveSupabaseCredentials = saveSupabaseCredentials;
window.resetSupabaseCredentials = resetSupabaseCredentials;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_CONFIG,
    isSupabaseConfigured,
    getSupabaseClient,
    saveSupabaseCredentials,
    resetSupabaseCredentials
  };
}
