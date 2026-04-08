import { NextResponse } from "next/server";
import { requireOrganizer } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { profile } = await requireOrganizer();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("type") === "winners" ? "winners" : "entries";

  const lottery = await prisma.lottery.findFirst({
    where: { id, organizerId: profile.id },
  });
  if (!lottery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await logAudit(profile.id, "lottery.export", { lotteryId: id, metadata: { type: kind } });

  if (kind === "winners") {
    const rows = await prisma.winner.findMany({
      where: { lotteryId: id },
      include: { entry: true },
      orderBy: { createdAt: "asc" },
    });
    const header = [
      "winner_index",
      "full_name",
      "email",
      "address",
      "country",
      "instagram",
      "paypal",
      "entered_at",
    ];
    const lines = [header.join(",")];
    rows.forEach((w, i) => {
      const e = w.entry;
      lines.push(
        [
          String(i + 1),
          csvEscape(e.fullName),
          csvEscape(e.email),
          csvEscape(e.address),
          csvEscape(e.country),
          csvEscape(e.instagram ?? ""),
          csvEscape(e.paypal ?? ""),
          csvEscape(e.createdAt.toISOString()),
        ].join(",")
      );
    });
    const csv = lines.join("\r\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${lottery.slug}-winners.csv"`,
      },
    });
  }

  const entries = await prisma.entry.findMany({
    where: { lotteryId: id },
    orderBy: { createdAt: "asc" },
  });
  const header = ["full_name", "email", "address", "country", "instagram", "paypal", "entered_at"];
  const lines = [header.join(",")];
  for (const e of entries) {
    lines.push(
      [
        csvEscape(e.fullName),
        csvEscape(e.email),
        csvEscape(e.address),
        csvEscape(e.country),
        csvEscape(e.instagram ?? ""),
        csvEscape(e.paypal ?? ""),
        csvEscape(e.createdAt.toISOString()),
      ].join(",")
    );
  }
  const csv = lines.join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${lottery.slug}-entries.csv"`,
    },
  });
}
