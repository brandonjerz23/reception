"use client";

import { useMemo, useState } from "react";

type RsvpStatus = "accept" | "decline";
type RsvpStatusOrUnset = RsvpStatus | "";

type SubmitState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; message: string }
  | { state: "error"; message: string };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function RsvpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<RsvpStatusOrUnset>("");
  const [partySize, setPartySize] = useState<string>("1");
  const [notes, setNotes] = useState<string>("");
  const [submit, setSubmit] = useState<SubmitState>({ state: "idle" });

  const validationError = useMemo(() => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedName) return "Please enter your name.";
    if (trimmedName.length > 120) return "Name is too long.";

    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      return "Please enter a valid email address (or leave it blank).";
    }

    if (status !== "accept" && status !== "decline") {
      return "Please choose Accept or Decline.";
    }

    if (status === "accept") {
      const parsedPartySize = Number.parseInt(partySize, 10);
      if (!Number.isFinite(parsedPartySize)) {
        return "Please enter a valid party size.";
      }
      if (!Number.isInteger(parsedPartySize)) {
        return "Please enter a whole-number party size.";
      }
      if (parsedPartySize < 1) return "Party size must be at least 1.";
      if (parsedPartySize > 10)
        return "Party size is capped at 10 — use Anything else? to explain if larger.";
    }

    if (trimmedNotes.length > 1000) return "Anything else? is too long.";

    return null;
  }, [name, email, status, partySize, notes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (validationError) {
      setSubmit({ state: "error", message: validationError });
      return;
    }

    setSubmit({ state: "submitting" });

    try {
      const parsedPartySize =
        status === "accept" ? Number.parseInt(partySize, 10) : null;
      const trimmedNotes = notes.trim();

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
          status,
          partySize: parsedPartySize,
          notes: trimmedNotes.length ? trimmedNotes : null,
        }),
      });

      const body = (await res.json().catch(() => null)) as {
        ok: boolean;
        message?: string;
      } | null;

      if (!res.ok || !body?.ok) {
        setSubmit({
          state: "error",
          message: body?.message || "Something went wrong. Please try again.",
        });
        return;
      }

      setSubmit({
        state: "success",
        message: body?.message || "RSVP received. Thank you!",
      });
    } catch {
      setSubmit({
        state: "error",
        message: "Network error. Please try again.",
      });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            RSVP
          </h2>
          <p className="mt-1 text-sm text-white/70">
            Please let us know if you can make it 🤞
          </p>
        </div>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
          Sep 26, 2026
        </span>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-white/90">
            Your name <span className="text-rose-200">*</span>
          </span>
          <input
            className="h-11 rounded-xl border border-white/15 bg-black/20 px-4 text-white placeholder-white/40 outline-none ring-0 transition focus:border-white/30 focus:bg-black/25"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-white/90">
            Email (optional)
          </span>
          <input
            className="h-11 rounded-xl border border-white/15 bg-black/20 px-4 text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-black/25"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            inputMode="email"
          />
        </label>

        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-white/90">
            Response <span className="text-rose-200">*</span>
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setStatus("accept");
                if (submit.state === "error") setSubmit({ state: "idle" });
              }}
              className={
                "relative flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition " +
                (status === "accept"
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-white/15 bg-black/10 text-white/85 hover:border-white/25 hover:bg-black/15")
              }
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => {
                setStatus("decline");
                if (submit.state === "error") setSubmit({ state: "idle" });
              }}
              className={
                "relative flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition " +
                (status === "decline"
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-white/15 bg-black/10 text-white/85 hover:border-white/25 hover:bg-black/15")
              }
            >
              Decline
            </button>
          </div>
        </fieldset>

        {status !== "decline" ? (
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white/90">
              Party size
              {status === "accept" ? (
                <span className="text-rose-200"> *</span>
              ) : null}
            </span>
            <input
              className="h-11 rounded-xl border border-white/15 bg-black/20 px-4 text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-black/25"
              type="number"
              min={1}
              max={10}
              step={1}
              inputMode="numeric"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
            />
            <p className="text-xs text-white/55">
              Includes you. If you&apos;re unsure, put your best guess.
            </p>
          </label>
        ) : null}

        <label className="grid gap-2">
          <span className="text-sm font-medium text-white/90">
            Anything else?
          </span>
          <textarea
            className="min-h-[96px] resize-y rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-white/30 focus:bg-black/25"
            placeholder="Comments, questions, dad jokes, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={submit.state === "submitting"}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submit.state === "submitting" ? "Submitting…" : "Send RSVP"}
        </button>

        {submit.state === "error" ? (
          <p className="rounded-xl border border-rose-200/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {submit.message}
          </p>
        ) : null}

        {submit.state === "success" ? (
          <p className="rounded-xl border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {submit.message}
          </p>
        ) : null}

        {submit.state === "idle" ? (
          <p className="text-xs text-white/55">
            If you have trouble, just text Ashley or Brandon.
          </p>
        ) : null}
      </div>
    </form>
  );
}
