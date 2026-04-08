import { z } from "zod";

const optionalIsoDateTime = z
  .string()
  .optional()
  .nullable()
  .refine((v) => v == null || v === "" || !Number.isNaN(Date.parse(v)), "Invalid date");

export const lotteryCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(10000).optional().default(""),
  imageUrl: z.string().url().optional().nullable(),
  opensAt: optionalIsoDateTime,
  closesAt: optionalIsoDateTime,
  winnerCount: z.coerce.number().int().min(1).max(100).optional().default(1),
  collectInstagram: z.boolean().optional().default(false),
  collectPaypal: z.boolean().optional().default(false),
  collectPhone: z.boolean().optional().default(false),
  shippingPolicy: z.enum(["ANY", "US_ONLY", "ALLOW_LIST", "BLOCK_LIST"]).optional().default("ANY"),
  allowedCountries: z.array(z.string().length(2)).optional().default([]),
  blockedCountries: z.array(z.string().length(2)).optional().default([]),
});

export const lotteryUpdateSchema = lotteryCreateSchema.partial().extend({
  status: z.enum(["DRAFT", "OPEN", "CLOSED", "DRAWN"]).optional(),
});

export const entrySubmitSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  address: z.string().min(1).max(2000),
  country: z
    .string()
    .min(2)
    .max(2)
    .transform((v) => v.toUpperCase())
    .refine((v) => /^[A-Z]{2}$/.test(v), "Invalid country"),
  instagram: z.string().max(200).optional().nullable(),
  paypal: z.string().max(200).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  website: z.string().max(10).optional(),
  turnstileToken: z.string().optional(),
});

export const drawWinnersSchema = z.object({
  count: z.coerce.number().int().min(1).max(500).optional(),
});

export function validateEntryFieldsForLottery(
  lottery: {
    collectInstagram: boolean;
    collectPaypal: boolean;
    collectPhone: boolean;
    shippingPolicy: "ANY" | "US_ONLY" | "ALLOW_LIST" | "BLOCK_LIST";
    allowedCountries: string[];
    blockedCountries: string[];
  },
  instagram: string | null | undefined,
  paypal: string | null | undefined,
  phone: string | null | undefined,
  country: string
): string | null {
  if (lottery.collectInstagram) {
    const v = instagram?.trim();
    if (!v) return "Instagram handle is required for this lottery.";
  }
  if (lottery.collectPaypal) {
    const v = paypal?.trim();
    if (!v) return "PayPal email is required for this lottery.";
    const emailCheck = z.string().email().safeParse(v);
    if (!emailCheck.success) return "Enter a valid PayPal email address.";
  }
  if (lottery.collectPhone) {
    const raw = phone?.trim();
    if (!raw) return "Phone number is required for this lottery.";
    const digits = raw.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      return "Enter a valid phone number (include country code if needed).";
    }
  }
  const c = country.toUpperCase();
  if (lottery.shippingPolicy === "US_ONLY" && c !== "US") {
    return "This lottery is limited to United States shipping addresses.";
  }
  if (lottery.shippingPolicy === "ALLOW_LIST") {
    if (!lottery.allowedCountries.map((x) => x.toUpperCase()).includes(c)) {
      return "This lottery is not available in your country.";
    }
  }
  if (lottery.shippingPolicy === "BLOCK_LIST") {
    if (lottery.blockedCountries.map((x) => x.toUpperCase()).includes(c)) {
      return "This lottery is not available in your country.";
    }
  }
  return null;
}

export const profilePatchSchema = z.object({
  /** Trimmed; send empty string to clear the display name. */
  displayName: z.string().max(120),
});
