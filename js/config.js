/**
 * CarMatcher — config.js
 *
 * Gemini API Configuration
 * ────────────────────────
 * Your API key is stored only in localStorage in your browser.
 * It is never sent to any CarMatcher server — only directly to
 * Google's Gemini API endpoint (generativelanguage.googleapis.com).
 *
 * To get a free Gemini API key:
 *   → https://aistudio.google.com/app/apikey
 */

const CARMATCHER_CONFIG = {
  GEMINI_API_KEY: "AIzaSyD7IiNShWhuxUy3FxygwJzDpidH4q3n1Ac",  // ← add this line
  GEMINI_MODEL: "gemini-2.0-flash",
  // ... rest stays the same
  /**
   * Gemini API endpoint
   * Using gemini-2.0-flash for fast, cost-effective responses.
   * Swap to "gemini-1.5-pro" for deeper reasoning (slower, higher quota cost).
   */
  GEMINI_MODEL: "gemini-2.0-flash",
  GEMINI_ENDPOINT: "https://generativelanguage.googleapis.com/v1beta/models",

  /** Max tokens for the AI response */
  MAX_OUTPUT_TOKENS: 1800,

  /** Temperature: 0 = deterministic, 1 = creative. 0.7 is a good editorial balance. */
  TEMPERATURE: 0.7,

  /** How many car recommendations to request */
  NUM_RECOMMENDATIONS: 4,

  /**
   * localStorage key for persisting the API key across sessions.
   * The user doesn't need to re-enter it every visit.
   */
  STORAGE_KEY: "carmatcher_gemini_key",
};
