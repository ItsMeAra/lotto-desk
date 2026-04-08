import { createHash } from "crypto";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function normalizeAddress(address: string): string {
  return address
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function normalizeOptionalHandle(value: string | undefined | null): string | null {
  if (value == null || value === "") return null;
  return value.trim().toLowerCase();
}

/** Digits only, for dedupe / duplicate detection (null when empty). */
export function normalizePhoneDigits(value: string | undefined | null): string | null {
  if (value == null || value === "") return null;
  const d = value.replace(/\D/g, "");
  return d.length > 0 ? d : null;
}

/** Stable hash for unique constraint length (Postgres index-friendly). */
export function buildDedupeKey(
  normEmail: string,
  normName: string,
  normAddress: string,
  normCountry: string,
  normPhoneDigits: string | null
): string {
  const p = normPhoneDigits ?? "";
  const raw = `${normEmail}|${normName}|${normAddress}|${normCountry}|${p}`;
  return createHash("sha256").update(raw, "utf8").digest("hex");
}
