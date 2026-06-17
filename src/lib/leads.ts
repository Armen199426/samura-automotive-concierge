import { supabase } from "@/integrations/supabase/client";

const KNOWN = new Set([
  "form_name",
  "name",
  "phone",
  "email",
  "message",
  "service",
  "vehicle",
]);

export type LeadSubmission = {
  form_name: string;
  // Any additional fields the form contains:
  [key: string]: string | undefined;
};

function getUtm(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
  const sp = new URLSearchParams(window.location.search);
  return {
    utm_source: sp.get("utm_source"),
    utm_medium: sp.get("utm_medium"),
    utm_campaign: sp.get("utm_campaign"),
  };
}

export async function submitLead(submission: LeadSubmission): Promise<{
  ok: boolean;
  error?: string;
}> {
  const { form_name, ...rest } = submission;

  // Pull standard columns out of rest; everything else goes to submission_json.
  const row: Record<string, unknown> = {
    form_name,
    page_url: typeof window !== "undefined" ? window.location.href : null,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    ...getUtm(),
  };

  const extras: Record<string, string> = {};
  for (const [k, v] of Object.entries(rest)) {
    const value = (v ?? "").toString().trim();
    if (!value) continue;
    if (KNOWN.has(k)) {
      row[k] = value;
    } else {
      extras[k] = value;
    }
  }
  // Preserve full payload (including known fields) for auditing.
  row.submission_json = { ...rest };
  if (Object.keys(extras).length > 0) {
    // Already covered by submission_json, but keep for clarity.
  }

  const { error } = await supabase.from("leads").insert(row as never);

  if (error) {
    return { ok: false, error: error.message };
  }

  // Telegram notification is dispatched server-side by an AFTER INSERT trigger
  // on public.leads (pg_net → send-telegram-lead Edge Function).
  return { ok: true };
}
