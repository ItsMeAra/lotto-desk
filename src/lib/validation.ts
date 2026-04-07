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
});

export const lotteryUpdateSchema = lotteryCreateSchema.partial().extend({
  status: z.enum(["DRAFT", "OPEN", "CLOSED", "DRAWN"]).optional(),
});

export const entrySubmitSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  address: z.string().min(1).max(2000),
  instagram: z.string().max(200).optional().nullable(),
  paypal: z.string().max(200).optional().nullable(),
  website: z.string().max(10).optional(),
  turnstileToken: z.string().optional(),
});

export const drawWinnersSchema = z.object({
  count: z.coerce.number().int().min(1).max(500).optional(),
});

export function validateEntryFieldsForLottery(
  lottery: { collectInstagram: boolean; collectPaypal: boolean },
  instagram: string | null | undefined,
  paypal: string | null | undefined
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
  return null;
}
