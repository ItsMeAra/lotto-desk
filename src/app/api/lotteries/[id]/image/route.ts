import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";
import { refreshLotterySchedule } from "@/lib/lottery-schedule";

const BUCKET = "lottery-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extForMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
  });
  if (!lottery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (lottery.status !== "DRAFT" && lottery.status !== "OPEN") {
    return NextResponse.json({ error: "Cannot change image after lottery is closed or drawn." }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return NextResponse.json(
      {
        error:
          "Image upload is not configured. Add SUPABASE_SERVICE_ROLE_KEY and create a public bucket named lottery-images.",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
  }
  const type = file.type || "application/octet-stream";
  if (!ALLOWED.has(type)) {
    return NextResponse.json({ error: "Use JPEG, PNG, WebP, or GIF" }, { status: 400 });
  }

  const ext = extForMime(type);
  const path = `${profile.id}/${id}/${randomBytes(12).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: type,
    upsert: false,
  });
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const imageUrl = pub.publicUrl;

  const updated = await prisma.lottery.update({
    where: { id },
    data: { imageUrl },
  });
  await logAudit(profile.id, "lottery.image_upload", { lotteryId: id });
  const afterSchedule = await refreshLotterySchedule(updated);

  return NextResponse.json({ imageUrl: afterSchedule.imageUrl, status: afterSchedule.status });
}
