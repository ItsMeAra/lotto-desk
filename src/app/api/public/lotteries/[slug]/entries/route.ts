import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { entrySubmitSchema } from "@/lib/validation";
import {
  buildDedupeKey,
  normalizeAddress,
  normalizeEmail,
  normalizeName,
  normalizeOptionalHandle,
} from "@/lib/dedupe";
import { isLotteryAcceptingEntries } from "@/lib/lottery-window";
import { checkRateLimit, getClientIp, rateLimitKey } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { refreshLotterySchedule } from "@/lib/lottery-schedule";
import { validateEntryFieldsForLottery } from "@/lib/validation";

export async function POST(request: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(rateLimitKey(ip, `entry:${slug}`));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfterSec: rl.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } }
    );
  }

  const found = await prisma.lottery.findUnique({ where: { slug } });
  if (!found) {
    return NextResponse.json({ error: "Lottery not found" }, { status: 404 });
  }
  const lottery = await refreshLotterySchedule(found);
  if (!isLotteryAcceptingEntries(lottery.status, lottery.opensAt, lottery.closesAt)) {
    return NextResponse.json({ error: "This lottery is not accepting entries" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = entrySubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { fullName, email, address, country, instagram, paypal, website, turnstileToken } = parsed.data;
  if (website && website.length > 0) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const turnstileOk = await verifyTurnstileToken(turnstileToken);
  if (!turnstileOk) {
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const entryFieldError = validateEntryFieldsForLottery(
    lottery,
    instagram,
    paypal,
    country
  );
  if (entryFieldError) {
    return NextResponse.json({ error: entryFieldError }, { status: 400 });
  }

  const normEmail = normalizeEmail(email);
  const normName = normalizeName(fullName);
  const normAddress = normalizeAddress(address);
  const normCountry = country.toUpperCase();
  const normInstagram = normalizeOptionalHandle(instagram);
  const normPaypal = normalizeOptionalHandle(paypal);
  const dedupeKey = buildDedupeKey(normEmail, normName, normAddress, normCountry);

  try {
    const entry = await prisma.entry.create({
      data: {
        lotteryId: lottery.id,
        fullName: fullName.trim(),
        email: email.trim(),
        address: address.trim(),
        country: country.toUpperCase(),
        instagram: instagram?.trim() || null,
        paypal: paypal?.trim() || null,
        dedupeKey,
        normEmail,
        normName,
        normAddress,
        normCountry,
        normInstagram,
        normPaypal,
      },
    });
    return NextResponse.json({ ok: true, entryId: entry.id });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      await prisma.blockedEntryAttempt.create({
        data: {
          lotteryId: lottery.id,
          dedupeKey,
          email: normEmail,
          ip,
          reason: "duplicate_dedupe_key",
        },
      });
      return NextResponse.json(
        {
          error:
            "You are already entered for this lottery with this name, email, and address combination.",
        },
        { status: 409 }
      );
    }
    throw e;
  }
}
