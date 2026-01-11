import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { ok: true, configured: true, message: "Supabase env vars are set." },
    { status: 200 }
  );
}
