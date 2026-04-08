"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VALUE_ESSENTIAL,
  OPEN_COOKIE_BANNER_EVENT,
  readCookieConsentFromStorage,
} from "@/lib/cookie-consent";

/**
 * Essential-only cookie notice. Dismissal is stored in localStorage (not a cookie).
 * When you add optional tools (e.g. Plausible), gate their init on consent here or a small provider.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, COOKIE_CONSENT_VALUE_ESSENTIAL);
    } catch {
      /* private mode / blocked storage */
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (readCookieConsentFromStorage()) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    function onOpen() {
      try {
        localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setVisible(true);
    }
    window.addEventListener(OPEN_COOKIE_BANNER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_COOKIE_BANNER_EVENT, onOpen);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-4 z-[10001] w-[min(20rem,calc(100vw-2rem))] rounded-[20px] border border-oat bg-card/95 p-4 shadow-[0_12px_40px_rgba(14,15,12,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-card/90 sm:right-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="flex gap-3">
        <span className="shrink-0 text-matcha-800" aria-hidden>
          <svg className="size-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="9" cy="10" r="1.35" fill="currentColor" />
            <circle cx="14.25" cy="9" r="1.1" fill="currentColor" />
            <circle cx="11" cy="14" r="1.2" fill="currentColor" />
            <circle cx="15.25" cy="13.25" r="0.95" fill="currentColor" />
            <circle cx="8.25" cy="13.5" r="0.85" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <p id="cookie-consent-title" className="text-sm font-semibold leading-tight tracking-tight text-clay-black">
            Cookies
          </p>
          <div id="cookie-consent-desc" className="space-y-1.5 text-xs leading-snug text-warm-silver">
            <p>
              This site uses essential cookies to keep things secure and, when you use an account, to keep you signed in.
            </p>
            <p>
              <Link
                href="/privacy#cookies"
                className="text-[0.6875rem] font-medium text-matcha-800 underline decoration-matcha-800/35 underline-offset-2 hover:text-matcha-800 hover:decoration-matcha-800"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
          <button type="button" className="btn-clay-matcha mt-1 w-full justify-center px-4 py-2 text-sm" onClick={dismiss}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
