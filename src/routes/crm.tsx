import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowUpDown,
  Flame,
  LogOut,
  Search,
  TrendingUp,
  CalendarClock,
  Users,
  CheckCircle2,
  Loader2,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  crmListLeads,
  crmLogin,
  crmUpdateLead,
  type Lead,
} from "@/lib/crm.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/crm")({
  head: () => ({
    meta: [
      { title: "CRM — SAMURA AUTO" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CrmPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">CRM не загрузился</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
          <Button
            className="mt-4"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Повторить
          </Button>
        </div>
      </div>
    );
  },
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

const STORAGE_KEY = "samura_crm_pw_v1";

const STATUS_OPTIONS = [
  { value: "new", label: "Новый" },
  { value: "contacted", label: "Связались" },
  { value: "in_progress", label: "В работе" },
  { value: "deal", label: "Сделка" },
  { value: "lost", label: "Потерян" },
] as const;

type StatusValue = (typeof STATUS_OPTIONS)[number]["value"];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_progress: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  deal: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

function statusLabel(v: string): string {
  return STATUS_OPTIONS.find((s) => s.value === v)?.label ?? v;
}

function getBudget(lead: Lead): string | null {
  const src = lead.submission_json as Record<string, unknown> | null;
  if (!src) return null;
  for (const key of ["budget", "Budget", "бюджет", "price", "amount"]) {
    const v = src[key];
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number") return String(v);
  }
  return null;
}

function parseBudgetNumber(s: string | null): number {
  if (!s) return 0;
  const digits = s.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function CrmPage() {
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setPassword(stored);
  }, []);

  if (!password) {
    return (
      <LoginScreen
        onSuccess={(pw) => {
          window.localStorage.setItem(STORAGE_KEY, pw);
          setPassword(pw);
        }}
      />
    );
  }

  return (
    <Dashboard
      password={password}
      onLogout={() => {
        window.localStorage.removeItem(STORAGE_KEY);
        setPassword(null);
      }}
    />
  );
}

function LoginScreen({ onSuccess }: { onSuccess: (pw: string) => void }) {
  const [value, setValue] = useState("");
  const loginFn = useServerFn(crmLogin);
  const mutation = useMutation({
    mutationFn: async (pw: string) => loginFn({ data: { password: pw } }),
    onSuccess: (_d, pw) => {
      toast.success("Добро пожаловать");
      onSuccess(pw);
    },
    onError: (e: Error) => toast.error(e.message || "Неверный пароль"),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-white/10 bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">CRM SAMURA AUTO</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!value) return;
              mutation.mutate(value);
            }}
          >
            <div>
              <Label htmlFor="pw">Пароль</Label>
              <Input
                id="pw"
                type="password"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

type SortKey = "created_at" | "name" | "status" | "form_name";

function Dashboard({
  password,
  onLogout,
}: {
  password: string;
  onLogout: () => void;
}) {
  const listFn = useServerFn(crmListLeads);
  const updateFn = useServerFn(crmUpdateLead);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["crm", "leads"],
    queryFn: () => listFn({ data: { password } }),
    retry: false,
  });

  useEffect(() => {
    if (query.error) {
      const msg = (query.error as Error).message;
      if (msg.toLowerCase().includes("invalid")) {
        toast.error("Сессия истекла, войдите снова");
        onLogout();
      } else {
        toast.error(msg);
      }
    }
  }, [query.error, onLogout]);

  const updateMutation = useMutation({
    mutationFn: async (vars: {
      id: string;
      patch: { status?: string; is_hot?: boolean; notes?: string | null };
    }) => updateFn({ data: { password, id: vars.id, ...vars.patch } }),
    onSuccess: (row) => {
      qc.setQueryData<Lead[] | undefined>(["crm", "leads"], (prev) =>
        prev?.map((l) => (l.id === row.id ? row : l)),
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formFilter, setFormFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const leads = query.data ?? [];

  const formNames = useMemo(() => {
    const s = new Set<string>();
    leads.forEach((l) => l.form_name && s.add(l.form_name));
    return Array.from(s).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (formFilter !== "all" && l.form_name !== formFilter) return false;
      if (q) {
        const hay = `${l.name ?? ""} ${l.phone ?? ""} ${l.email ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    out = [...out].sort((a, b) => {
      const av = (a[sortKey] ?? "") as string;
      const bv = (b[sortKey] ?? "") as string;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [leads, search, statusFilter, formFilter, sortKey, sortDir]);

  // Stats
  const stats = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const today = leads.filter((l) => new Date(l.created_at) >= todayStart).length;
    const counts: Record<string, number> = {};
    for (const l of leads) counts[l.status] = (counts[l.status] ?? 0) + 1;
    const highValue = leads.filter((l) => parseBudgetNumber(getBudget(l)) >= 50000).length;
    return {
      total: leads.length,
      today,
      new: counts.new ?? 0,
      in_progress: counts.in_progress ?? 0,
      deal: counts.deal ?? 0,
      highValue,
    };
  }, [leads]);

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId],
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
            <p className="text-sm text-muted-foreground">
              Управление лидами SAMURA AUTO
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Выйти
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={<Users className="h-4 w-4" />} label="Всего" value={stats.total} loading={query.isLoading} />
          <StatCard icon={<CalendarClock className="h-4 w-4" />} label="Сегодня" value={stats.today} loading={query.isLoading} />
          <StatCard icon={<Send className="h-4 w-4" />} label="Новые" value={stats.new} loading={query.isLoading} accent="blue" />
          <StatCard icon={<Loader2 className="h-4 w-4" />} label="В работе" value={stats.in_progress} loading={query.isLoading} accent="violet" />
          <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Сделки" value={stats.deal} loading={query.isLoading} accent="emerald" />
          <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Премиум" value={stats.highValue} loading={query.isLoading} accent="amber" />
        </div>

        {/* Filters */}
        <Card className="mt-6 border-white/10 bg-card/40 backdrop-blur-xl">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по имени, телефону, email"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все статусы</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={formFilter} onValueChange={setFormFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Форма" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все формы</SelectItem>
                {formNames.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="mt-4 overflow-hidden border-white/10 bg-card/40 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">
                    <ColHeader label="Имя" onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir} />
                  </th>
                  <th className="px-4 py-3">Телефон</th>
                  <th className="hidden px-4 py-3 md:table-cell">Email</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Авто</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Бюджет</th>
                  <th className="hidden px-4 py-3 md:table-cell">
                    <ColHeader label="Форма" onClick={() => toggleSort("form_name")} active={sortKey === "form_name"} dir={sortDir} />
                  </th>
                  <th className="px-4 py-3">
                    <ColHeader label="Дата" onClick={() => toggleSort("created_at")} active={sortKey === "created_at"} dir={sortDir} />
                  </th>
                  <th className="px-4 py-3">
                    <ColHeader label="Статус" onClick={() => toggleSort("status")} active={sortKey === "status"} dir={sortDir} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {query.isLoading && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                    </td>
                  </tr>
                )}
                {!query.isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-muted-foreground">
                      Лиды не найдены
                    </td>
                  </tr>
                )}
                {filtered.map((lead) => {
                  const budget = getBudget(lead);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedId(lead.id)}
                      className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {lead.is_hot && <Flame className="h-3.5 w-3.5 text-orange-400" />}
                          <span className="font-medium">{lead.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.phone || "—"}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{lead.email || "—"}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{lead.vehicle || "—"}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{budget || "—"}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{lead.form_name || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(lead.created_at)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={cn("border", STATUS_STYLES[lead.status] ?? "")}>
                          {statusLabel(lead.status)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <LeadDrawer
        lead={selected}
        onClose={() => setSelectedId(null)}
        onUpdate={(patch) => {
          if (!selected) return;
          updateMutation.mutate({ id: selected.id, patch });
        }}
        saving={updateMutation.isPending}
      />
    </div>
  );
}

function ColHeader({
  label,
  onClick,
  active,
  dir,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  dir: "asc" | "desc";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
        active && "text-foreground",
      )}
    >
      {label}
      <ArrowUpDown className={cn("h-3 w-3", active && (dir === "asc" ? "rotate-180" : ""))} />
    </button>
  );
}

const STAT_ACCENT: Record<string, string> = {
  blue: "text-blue-300",
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
};

function StatCard({
  icon,
  label,
  value,
  loading,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  loading?: boolean;
  accent?: keyof typeof STAT_ACCENT;
}) {
  return (
    <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className={cn("text-muted-foreground", accent && STAT_ACCENT[accent])}>{icon}</span>
        </div>
        {loading ? (
          <Skeleton className="mt-2 h-7 w-12" />
        ) : (
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onUpdate,
  saving,
}: {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (patch: { status?: string; is_hot?: boolean; notes?: string | null }) => void;
  saving: boolean;
}) {
  const [notesDraft, setNotesDraft] = useState("");

  useEffect(() => {
    setNotesDraft(lead?.notes ?? "");
  }, [lead?.id, lead?.notes]);

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto border-white/10 bg-card/95 backdrop-blur-2xl sm:max-w-xl">
        {lead && (
          <>
            <SheetHeader>
              <div className="flex items-center justify-between gap-2">
                <SheetTitle className="flex items-center gap-2">
                  {lead.is_hot && <Flame className="h-4 w-4 text-orange-400" />}
                  {lead.name || "Без имени"}
                </SheetTitle>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SheetDescription>
                {formatDate(lead.created_at)} · {lead.form_name || "—"}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Actions */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Статус</Label>
                  <Select
                    value={lead.status}
                    onValueChange={(v) => onUpdate({ status: v as StatusValue })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Hot lead</Label>
                  <Button
                    variant={lead.is_hot ? "default" : "outline"}
                    className="mt-1 w-full"
                    onClick={() => onUpdate({ is_hot: !lead.is_hot })}
                    disabled={saving}
                  >
                    <Flame className="mr-2 h-4 w-4" />
                    {lead.is_hot ? "Снять отметку" : "Отметить как горячий"}
                  </Button>
                </div>
              </div>

              {/* Contact */}
              <Section title="Контакты">
                <Field label="Имя" value={lead.name} />
                <Field label="Телефон" value={lead.phone} />
                <Field label="Email" value={lead.email} />
                <Field label="Авто" value={lead.vehicle} />
                <Field label="Услуга" value={lead.service} />
                <Field label="Сообщение" value={lead.message} />
              </Section>

              {/* Notes */}
              <Section title="Внутренние заметки">
                <Textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Добавьте заметку для команды..."
                  rows={4}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => onUpdate({ notes: notesDraft || null })}
                    disabled={saving || notesDraft === (lead.notes ?? "")}
                  >
                    Сохранить
                  </Button>
                </div>
              </Section>

              {/* Submission JSON */}
              <Section title="Данные формы">
                <pre className="max-h-72 overflow-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-muted-foreground">
                  {JSON.stringify(lead.submission_json, null, 2)}
                </pre>
              </Section>

              {/* UTM */}
              <Section title="Источник">
                <Field label="utm_source" value={lead.utm_source} />
                <Field label="utm_medium" value={lead.utm_medium} />
                <Field label="utm_campaign" value={lead.utm_campaign} />
                <Field label="Referrer" value={lead.referrer} />
                <Field label="Page URL" value={lead.page_url} mono />
              </Section>

              {/* Telegram */}
              <Section title="Telegram">
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={cn(
                      "inline-flex h-2 w-2 rounded-full",
                      lead.telegram_sent ? "bg-emerald-400" : "bg-zinc-500",
                    )}
                  />
                  <span className="text-muted-foreground">
                    {lead.telegram_sent ? "Отправлено" : "Не отправлено"}
                  </span>
                </div>
                {lead.telegram_error && (
                  <p className="mt-1 text-xs text-red-400">{lead.telegram_error}</p>
                )}
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right break-all text-foreground/90", mono && "font-mono text-xs")}>
        {value || "—"}
      </span>
    </div>
  );
}
