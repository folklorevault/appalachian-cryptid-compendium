"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { STATE_NAMES, ACROSS_APPALACHIA } from "@/lib/states";

export interface EventPrefill {
  slug: string;
  name: string;
  town: string;
  state: string;
}

const ROLES = [
  { value: "organizer", label: "I run it" },
  { value: "attendee", label: "I go to it" },
  { value: "other", label: "Something else" },
] as const;

const STATE_OPTIONS = Object.entries(STATE_NAMES).filter(([code]) => code !== ACROSS_APPALACHIA);

const emailLooksValid = (v: string) => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function EventSubmitForm({ prefill }: { prefill?: EventPrefill }) {
  const [loadedAt] = useState(() => Date.now());
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const [f, setF] = useState({
    role: "organizer",
    eventName: prefill?.name ?? "",
    town: prefill?.town ?? "",
    state: prefill?.state ?? "",
    dates: "",
    officialUrl: "",
    sourceUrl: "",
    note: "",
    email: "",
    organizerInterest: false,
  });
  const set = (key: keyof typeof f, value: string | boolean) => {
    setF((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  if (done) {
    return (
      <div role="status" className="max-w-2xl rounded-sm border border-border border-t-4 border-t-primary bg-card px-6 py-6">
        <h2 className="font-display font-bold text-xl text-card-foreground mb-2">Received.</h2>
        <p className="text-base leading-relaxed text-muted-foreground mb-4">
          The Bureau checks every update against its source before changing a listing, so it may
          take a few days to show up.
        </p>
        <Link
          href="/events"
          className="font-typewriter text-xs tracking-type text-primary border-b border-dotted border-primary/60 hover:border-solid"
        >
          ← Back to the calendar
        </Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.eventName.trim()) {
      setError("Please tell us which event this is about.");
      return;
    }
    if (!emailLooksValid(f.email)) {
      setError("That email address looks off.");
      return;
    }
    if (honeypot) {
      setDone(true); // bots get a fake success so they don't retry
      return;
    }

    setSending(true);
    setError(null);
    try {
      const response = await fetch("/api/event-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: f.role,
          event_name: f.eventName,
          event_slug: prefill?.slug,
          town: f.town,
          state: f.state,
          dates: f.dates,
          official_url: f.officialUrl,
          source_url: f.sourceUrl,
          note: f.note,
          email: f.email,
          organizer_interest: f.organizerInterest,
          _t: loadedAt,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to submit. Please try again.");
      }
      setDone(true);
    } catch (err) {
      // No success screen unless the server confirmed the save.
      setError((err as Error).message || "Failed to submit. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="max-w-2xl space-y-6">
      <fieldset>
        <legend className="font-typewriter text-tag tracking-label uppercase text-muted-foreground mb-2">
          You are
        </legend>
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`cursor-pointer rounded-sm border px-3 py-2 font-typewriter text-xs tracking-type transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                f.role === r.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/40"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={f.role === r.value}
                onChange={() => set("role", r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="event-name">Event</Label>
        <Input
          id="event-name"
          value={f.eventName}
          onChange={(e) => set("eventName", e.target.value)}
          maxLength={150}
          required
          aria-required="true"
          placeholder="Mothman Festival"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-town">Town</Label>
          <Input id="event-town" value={f.town} onChange={(e) => set("town", e.target.value)} maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-state">State</Label>
          <select
            id="event-state"
            value={f.state}
            onChange={(e) => set("state", e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Choose a state</option>
            {STATE_OPTIONS.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-dates">Dates</Label>
        <Input
          id="event-dates"
          value={f.dates}
          onChange={(e) => set("dates", e.target.value)}
          maxLength={150}
          placeholder="Sept 17–18, 2027, or “not announced yet”"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event-official">Official link</Label>
          <Input
            id="event-official"
            type="url"
            value={f.officialUrl}
            onChange={(e) => set("officialUrl", e.target.value)}
            maxLength={500}
            placeholder="https://"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event-source">Where you saw the dates</Label>
          <Input
            id="event-source"
            type="url"
            value={f.sourceUrl}
            onChange={(e) => set("sourceUrl", e.target.value)}
            maxLength={500}
            placeholder="https://"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-note">Anything else the Bureau should know</Label>
        <Textarea id="event-note" value={f.note} onChange={(e) => set("note", e.target.value)} maxLength={3000} rows={5} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-email">Email, if you’d like a reply</Label>
        <Input
          id="event-email"
          type="email"
          value={f.email}
          onChange={(e) => set("email", e.target.value)}
          maxLength={254}
          autoComplete="email"
        />
        <p className="text-xs text-muted-foreground">
          Used only to reply about this update. It is never shown on the site.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={f.organizerInterest}
          onChange={(e) => set("organizerInterest", e.target.checked)}
          className="mt-1 h-4 w-4 accent-primary"
        />
        <span>
          Tell me about Bureau tools for event organizers.
          <span className="block text-xs text-muted-foreground">
            Optional. Needs an email above. This is separate from the newsletter.
          </span>
        </span>
      </label>

      {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="event-website">Website</label>
        <input
          id="event-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={sending} className="font-display font-bold uppercase tracking-label">
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          "Send to the Bureau"
        )}
      </Button>
    </form>
  );
}
