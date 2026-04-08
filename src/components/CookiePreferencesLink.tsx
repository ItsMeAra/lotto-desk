"use client";

import { OPEN_COOKIE_BANNER_EVENT } from "@/lib/cookie-consent";

/** Re-opens the cookie notice (clears stored acknowledgement). For footer / settings. */
export function CookiePreferencesLink() {
  return (
    <button
      type="button"
      className="link-clay font-medium text-clay-black"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(OPEN_COOKIE_BANNER_EVENT));
      }}
    >
      Cookie settings
    </button>
  );
}
