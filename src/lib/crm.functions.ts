import { createServerFn } from "@tanstack/react-start";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [k: string]: JsonValue };

type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  form_name: string | null;
  page_url: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  message: string | null;
  service: string | null;
  vehicle: string | null;
  submission_json: JsonValue;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: string;
  telegram_sent: boolean;
  telegram_error: string | null;
  is_hot: boolean;
  notes: string | null;
};

function checkPassword(input: unknown): void {
  const expected = process.env.CRM_PASSWORD;
  if (!expected) {
    throw new Error("CRM password is not configured on the server.");
  }
  if (typeof input !== "string" || input !== expected) {
    throw new Error("Invalid password");
  }
}

export const crmLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Bad input");
    const { password } = data as { password?: unknown };
    if (typeof password !== "string") throw new Error("Bad input");
    return { password };
  })
  .handler(async ({ data }) => {
    checkPassword(data.password);
    return { ok: true as const };
  });

export const crmListLeads = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Bad input");
    const { password } = data as { password?: unknown };
    if (typeof password !== "string") throw new Error("Bad input");
    return { password };
  })
  .handler(async ({ data }): Promise<Lead[]> => {
    checkPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return (rows ?? []) as Lead[];
  });

export const crmUpdateLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (typeof data !== "object" || data === null) throw new Error("Bad input");
    const d = data as Record<string, unknown>;
    if (typeof d.password !== "string") throw new Error("Bad input");
    if (typeof d.id !== "string") throw new Error("Bad input");
    const patch: Record<string, unknown> = {};
    if (typeof d.status === "string") patch.status = d.status;
    if (typeof d.is_hot === "boolean") patch.is_hot = d.is_hot;
    if (typeof d.notes === "string" || d.notes === null) patch.notes = d.notes;
    return { password: d.password as string, id: d.id as string, patch };
  })
  .handler(async ({ data }): Promise<Lead> => {
    checkPassword(data.password);
    if (Object.keys(data.patch).length === 0) {
      throw new Error("Nothing to update");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("leads")
      .update(data.patch)
      .eq("id", data.id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as Lead;
  });

export type { Lead };
