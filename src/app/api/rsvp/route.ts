import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RsvpStatus = "accept" | "decline";

type RsvpRequestBody = {
  name?: unknown;
  email?: unknown;
  status?: unknown;
  partySize?: unknown;
  notes?: unknown;
};

function jsonError(status: number, message: string) {
  return NextResponse.json({ ok: false, message }, { status });
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return jsonError(
      500,
      "Server is not configured yet. Please try again later."
    );
  }

  let body: RsvpRequestBody;
  try {
    body = (await req.json()) as RsvpRequestBody;
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
  const email = emailRaw.length ? emailRaw : null;
  const status = body.status as RsvpStatus;

  const notesRaw = typeof body.notes === "string" ? body.notes.trim() : "";
  const notes = notesRaw.length ? notesRaw : null;

  if (!name) return jsonError(400, "Name is required.");
  if (name.length > 120) return jsonError(400, "Name is too long.");

  if (email && email.length > 254) return jsonError(400, "Email is too long.");
  if (email && !isValidEmail(email)) {
    return jsonError(400, "Please provide a valid email (or leave blank).");
  }

  if (status !== "accept" && status !== "decline") {
    return jsonError(400, "Status must be accept or decline.");
  }

  let partySize: number | null = null;
  if (status === "accept") {
    const parsed =
      typeof body.partySize === "number"
        ? body.partySize
        : typeof body.partySize === "string"
        ? Number.parseInt(body.partySize, 10)
        : NaN;

    if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
      return jsonError(400, "Party size must be a whole number.");
    }
    if (parsed < 1) return jsonError(400, "Party size must be at least 1.");
    if (parsed > 10) return jsonError(400, "Party size must be 10 or less.");
    partySize = parsed;
  }

  if (notes && notes.length > 1000) {
    return jsonError(400, "Anything else? is too long.");
  }

  const payload = {
    name,
    email,
    status,
    party_size: partySize,
    notes,
  };

  const restUrl = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rsvps`;

  const insertRes = await fetch(restUrl, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!insertRes.ok) {
    const text = await insertRes.text().catch(() => "");
    if (process.env.NODE_ENV !== "production" && text) {
      return jsonError(500, `Could not save RSVP: ${text}`);
    }
    return jsonError(500, "Could not save RSVP. Please try again.");
  }

  return NextResponse.json(
    {
      ok: true,
      message:
        status === "accept"
          ? "You are confirmed — see you there!"
          : "Thanks for letting us know.",
    },
    { status: 200 }
  );
}
