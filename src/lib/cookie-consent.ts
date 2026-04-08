/**
 * Client-side acknowledgement for the cookie notice (stored in localStorage, not a cookie).
 * Supabase auth cookies are still set by the server regardless—this only records that the user saw the banner.
 *
 * Future optional analytics (e.g. Plausible): either use Plausible’s cookieless/domain setup, or extend the stored value
 * and only inject a script after explicit opt-in—see `readCookieConsentFromStorage()` usage.
 */
export const COOKIE_CONSENT_STORAGE_KEY = "rafflehaus_cookie_consent_v1";

/** Value when the user has acknowledged the notice (we only use essential cookies today). */
export const COOKIE_CONSENT_VALUE_ESSENTIAL = "essential" as const;

export type CookieConsentState = typeof COOKIE_CONSENT_VALUE_ESSENTIAL | null;

/** For client-side checks before loading optional scripts (e.g. analytics) later. */
export function readCookieConsentFromStorage(): CookieConsentState {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return v === COOKIE_CONSENT_VALUE_ESSENTIAL ? COOKIE_CONSENT_VALUE_ESSENTIAL : null;
  } catch {
    return null;
  }
}

export const OPEN_COOKIE_BANNER_EVENT = "rafflehaus:open-cookie-banner";
