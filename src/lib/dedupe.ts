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

/** Stable hash for unique constraint length (Postgres index-friendly). */
export function buildDedupeKey(
  normEmail: string,
  normName: string,
  normAddress: string
): string {
  const raw = `${normEmail}|${normName}|${normAddress}`;
  return createHash("sha256").update(raw, "utf8").digest("hex");
}
