// Edge function: send-telegram-lead
// Fetches a lead from the `leads` table, formats it, posts it to Telegram,
// and updates telegram_sent / telegram_error on the row.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const KNOWN_FIELDS = new Set([
  "id",
  "created_at",
  "updated_at",
  "form_name",
  "page_url",
  "name",
  "phone",
  "email",
  "message",
  "service",
  "vehicle",
  "submission_json",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "referrer",
  "ip_address",
  "user_agent",
  "status",
  "telegram_sent",
  "telegram_error",
]);

function esc(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      timeZone: "Asia/Irkutsk",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function buildMessage(lead: Record<string, unknown>): string {
  const extras: string[] = [];
  const extraSource = (lead.submission_json ?? {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(extraSource)) {
    if (KNOWN_FIELDS.has(k)) continue;
    if (v === null || v === undefined || v === "") continue;
    extras.push(`<b>${esc(k)}:</b> ${esc(v)}`);
  }

  const extraBlock = extras.length
    ? `\n━━━━━━━━━━━━━━\n\n📎 <b>Additional Information</b>\n\n${extras.join("\n")}\n`
    : "";

  return (
    `🚨 <b>NEW WEBSITE LEAD</b>\n\n` +
    `━━━━━━━━━━━━━━\n\n` +
    `👤 <b>Name</b>\n${esc(lead.name)}\n\n` +
    `📞 <b>Phone</b>\n${esc(lead.phone)}\n\n` +
    `📧 <b>Email</b>\n${esc(lead.email)}\n\n` +
    `🚗 <b>Vehicle</b>\n${esc(lead.vehicle)}\n\n` +
    `🛠 <b>Requested Service</b>\n${esc(lead.service)}\n\n` +
    `💬 <b>Message</b>\n${esc(lead.message)}\n\n` +
    `━━━━━━━━━━━━━━\n\n` +
    `🌐 <b>Form</b>\n${esc(lead.form_name)}\n\n` +
    `📄 <b>Page</b>\n${esc(lead.page_url)}\n\n` +
    `🕒 <b>Date</b>\n${esc(formatDate(String(lead.created_at)))}\n\n` +
    `━━━━━━━━━━━━━━\n\n` +
    `📊 <b>Marketing</b>\n\n` +
    `UTM Source:\n${esc(lead.utm_source)}\n\n` +
    `UTM Medium:\n${esc(lead.utm_medium)}\n\n` +
    `UTM Campaign:\n${esc(lead.utm_campaign)}` +
    extraBlock
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead_id } = await req.json();
    if (!lead_id) {
      return new Response(
        JSON.stringify({ error: "lead_id required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!BOT_TOKEN || !CHAT_ID) {
      return new Response(
        JSON.stringify({ error: "Telegram secrets not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: lead, error: fetchErr } = await admin
      .from("leads")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (fetchErr || !lead) {
      return new Response(
        JSON.stringify({ error: fetchErr?.message ?? "Lead not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const text = buildMessage(lead as Record<string, unknown>);

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );

    const tgJson = await tgRes.json().catch(() => ({}));

    if (!tgRes.ok || tgJson?.ok === false) {
      const errMsg =
        tgJson?.description ?? `Telegram HTTP ${tgRes.status}`;
      await admin
        .from("leads")
        .update({ telegram_sent: false, telegram_error: errMsg })
        .eq("id", lead_id);
      return new Response(
        JSON.stringify({ ok: false, error: errMsg }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await admin
      .from("leads")
      .update({ telegram_sent: true, telegram_error: null })
      .eq("id", lead_id);

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("send-telegram-lead error:", msg);
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
