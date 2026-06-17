// Edge function: send-telegram-lead
// Invoked by an AFTER INSERT trigger on public.leads via pg_net.
// Loads the lead, posts to Telegram, updates telegram_sent / telegram_error.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const KNOWN_FIELDS = new Set([
  "id", "created_at", "updated_at", "form_name", "page_url", "name", "phone",
  "email", "message", "service", "vehicle", "submission_json", "utm_source",
  "utm_medium", "utm_campaign", "referrer", "ip_address", "user_agent",
  "status", "telegram_sent", "telegram_error",
]);

function esc(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      timeZone: "Asia/Irkutsk", dateStyle: "medium", timeStyle: "short",
    });
  } catch { return iso; }
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

async function markStatus(leadId: string | undefined, sent: boolean, error: string | null) {
  if (!leadId) return;
  await admin.from("leads").update({
    telegram_sent: sent,
    telegram_error: error,
  }).eq("id", leadId);
}

function maskToken(token: string | undefined): string {
  if (!token) return "[missing]";
  if (token.length <= 12) return "[masked]";
  return `${token.slice(0, 6)}...[masked]...${token.slice(-4)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  let leadId: string | undefined;
  try {
    const body = await req.json();
    leadId = body?.lead_id ?? body?.lead?.id;

    let lead: Record<string, unknown> | null = body?.lead ?? null;

    // If trigger passed only lead_id, fetch the row with service role.
    if (!lead && leadId) {
      const { data, error } = await admin.from("leads").select("*").eq("id", leadId).maybeSingle();
      if (error) throw new Error(`load lead failed: ${error.message}`);
      lead = data as Record<string, unknown> | null;
    }

    if (!lead) {
      return new Response(JSON.stringify({ error: "lead payload required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const botTokenSource = "TELEGRAM_BOT_TOKEN";
    const chatIdSource = "TELEGRAM_CHAT_ID";
    const botTokenRaw = Deno.env.get(botTokenSource);
    const chatIdRaw = Deno.env.get(chatIdSource);
    const botToken = botTokenRaw?.trim();
    const chatId = chatIdRaw?.trim();

    console.log("telegram runtime env check", JSON.stringify({
      botTokenSource,
      hasBotToken: Boolean(botToken),
      botTokenMasked: maskToken(botToken),
      botTokenWasTrimmed: botTokenRaw !== botToken,
      chatIdSource,
      hasChatId: chatId !== null && chatId !== undefined && chatId !== "",
      chatIdValue: chatId ?? null,
      chatIdWasTrimmed: chatIdRaw !== chatId,
      usesFallbackValues: false,
      usesHardcodedValues: false,
    }));

    if (!botToken || !chatId) {
      await markStatus(leadId, false, "Telegram secrets not configured");
      return new Response(JSON.stringify({ error: "Telegram secrets not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!lead.created_at) lead.created_at = new Date().toISOString();
    const text = buildMessage(lead);
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramUrlMasked = `https://api.telegram.org/bot${maskToken(botToken)}/sendMessage`;
    const telegramPayload = {
      chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true,
    };

    console.log("telegram request debug", JSON.stringify({
      leadId: leadId ?? lead.id ?? null,
      finalRequestUrl: telegramUrlMasked,
      finalPayloadSentToTelegram: telegramPayload,
      chatIdValue: chatId,
      botTokenValueSource: botTokenSource,
      tokenMasked: maskToken(botToken),
      note: "Token is passed only in the URL and is masked in logs; no fallback or hardcoded values are used.",
    }));

    const tgRes = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telegramPayload),
    });
    const tgResponseBody = await tgRes.text();
    console.log("telegram response debug", JSON.stringify({
      leadId: leadId ?? lead.id ?? null,
      finalRequestUrl: telegramUrlMasked,
      httpStatus: tgRes.status,
      httpOk: tgRes.ok,
      fullTelegramResponseBody: tgResponseBody,
    }));
    let tgJson: Record<string, unknown> = {};
    try { tgJson = JSON.parse(tgResponseBody); } catch { tgJson = {}; }

    if (!tgRes.ok || tgJson?.ok === false) {
      const errMsg = tgJson?.description ?? tgResponseBody ?? `Telegram HTTP ${tgRes.status}`;
      await markStatus(leadId, false, String(errMsg));
      return new Response(JSON.stringify({ ok: false, error: errMsg, debug: {
        finalRequestUrl: telegramUrlMasked,
        finalPayloadSentToTelegram: telegramPayload,
        chatIdValue: chatId,
        botTokenValueSource: botTokenSource,
        fullTelegramResponseBody: tgResponseBody,
        usesFallbackValues: false,
        usesHardcodedValues: false,
      } }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await markStatus(leadId, true, null);
    return new Response(JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("send-telegram-lead error:", msg);
    await markStatus(leadId, false, msg);
    return new Response(JSON.stringify({ ok: false, error: msg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
