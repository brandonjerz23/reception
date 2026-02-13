import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpStatus = "accept" | "decline";

type RsvpRow = {
  id: string;
  name: string;
  email: string | null;
  status: RsvpStatus;
  party_size: number | null;
  notes: string | null;
  created_at: string;
};

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadRsvps(): Promise<{ rows: RsvpRow[] } | { error: string }> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY." };
  }

  const restUrl = `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/rsvps?select=id,name,email,status,party_size,notes,created_at&order=created_at.desc`;

  const res = await fetch(restUrl, {
    method: "GET",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return {
      error:
        process.env.NODE_ENV !== "production" && text
          ? `Could not load RSVPs: ${text}`
          : "Could not load RSVPs.",
    };
  }

  const rows = (await res.json()) as unknown;
  if (!Array.isArray(rows)) {
    return { error: "Unexpected response from database." };
  }

  return { rows: rows as RsvpRow[] };
}

export default async function RsvpsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const tokenParam = params.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  const adminToken = process.env.RSVP_ADMIN_TOKEN;
  if (adminToken) {
    const provided = token?.trim() || "";
    if (!provided || provided !== adminToken) {
      const host = (await headers()).get("host") || "";
      return (
        <main className="mx-auto w-full max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            RSVP List
          </h1>
          <p className="mt-3 rounded-xl border border-rose-200/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            Not authorized.
          </p>
          <p className="mt-4 text-sm text-white/60">
            Provide <span className="font-mono">?token=…</span> to view this
            page.
            {host ? (
              <>
                {" "}
                Example:{" "}
                <span className="font-mono">https://{host}/rsvps?token=…</span>
              </>
            ) : null}
          </p>
        </main>
      );
    }
  }

  const data = await loadRsvps();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            RSVP List
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Saved responses from Supabase.
          </p>
        </div>
      </div>

      {"error" in data ? (
        <p className="mt-6 rounded-xl border border-rose-200/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {data.error}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-white/60">
              <tr>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-white/60"
                  >
                    No RSVPs yet.
                  </td>
                </tr>
              ) : (
                data.rows.map((rsvp) => (
                  <tr key={rsvp.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-white/80">
                      {formatDateTime(rsvp.created_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                      {rsvp.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={
                          "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold " +
                          (rsvp.status === "accept"
                            ? "border-emerald-200/30 bg-emerald-500/10 text-emerald-100"
                            : "border-white/15 bg-white/5 text-white/80")
                        }
                      >
                        {rsvp.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-white/80">
                      {rsvp.party_size ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white/80">
                      {rsvp.email ?? "—"}
                    </td>
                    <td className="min-w-[260px] px-4 py-3 text-white/80">
                      {rsvp.notes ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
