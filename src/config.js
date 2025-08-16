// Central config for public site URL used in short links
// Fallback to current origin if env is not set
export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

// Host-only form for UI labels (e.g., without protocol)
export const SITE_HOST = (() => {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
})();