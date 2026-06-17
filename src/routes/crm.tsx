import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
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
  Phone,
  Copy,
  MessageCircle,
  LayoutGrid,
  Table as TableIcon,
  BarChart3,
  Clock,
  StickyNote,
  ArrowRight,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
const ACTIVITY_KEY = "samura_crm_activity_v1";

const STATUS_OPTIONS = [
  { value: "new", label: "Новые" },
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

const COLUMN_ACCENT: Record<string, string> = {
  new: "border-t-blue-500/60",
  contacted: "border-t-amber-500/60",
  in_progress: "border-t-violet-500/60",
  deal: "border-t-emerald-500/60",
  lost: "border-t-zinc-500/60",
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

function formatBudget(n: number): string {
  if (!n) return "—";
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
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

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "только что";
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ч назад`;
  const d = Math.floor(h / 24);
  return `${d} дн назад`;
}

function digitsOnly(s: string | null): string {
  return (s ?? "").replace(/[^\d+]/g, "");
}

// ---------- Activity log (client-side, localStorage) ----------

type Activity = {
  id: string;
  ts: string;
  kind: "status" | "hot" | "note" | "created";
  from?: string | null;
  to?: string | null;
  text?: string | null;
};

type ActivityMap = Record<string, Activity[]>;

function loadActivity(): ActivityMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as ActivityMap) : {};
  } catch {
    return {};
  }
}

function saveActivity(map: ActivityMap) {
  try {
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function appendActivity(leadId: string, entry: Omit<Activity, "id" | "ts">) {
  const map = loadActivity();
  const list = map[leadId] ?? [];
  list.unshift({
    id: Math.random().toString(36).slice(2),
    ts: new Date().toISOString(),
    ...entry,
  });
  map[leadId] = list.slice(0, 50);
  saveActivity(map);
}

// ---------- Page shell + auth ----------

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

// ---------- Dashboard ----------

type SortKey = "created_at" | "name" | "status" | "form_name";
type UpdatePatch = { status?: string; is_hot?: boolean; notes?: string | null };

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
    mutationFn: async (vars: { id: string; patch: UpdatePatch; prev: Lead }) =>
      updateFn({ data: { password, id: vars.id, ...vars.patch } }),
    onSuccess: (row, vars) => {
      // Log activity diffs
      const prev = vars.prev;
      if (vars.patch.status && vars.patch.status !== prev.status) {
        appendActivity(row.id, { kind: "status", from: prev.status, to: row.status });
      }
      if (typeof vars.patch.is_hot === "boolean" && vars.patch.is_hot !== prev.is_hot) {
        appendActivity(row.id, { kind: "hot", to: row.is_hot ? "on" : "off" });
      }
      if (vars.patch.notes !== undefined && (vars.patch.notes ?? "") !== (prev.notes ?? "")) {
        appendActivity(row.id, { kind: "note", text: row.notes });
      }
      qc.setQueryData<Lead[] | undefined>(["crm", "leads"], (p) =>
        p?.map((l) => (l.id === row.id ? row : l)),
      );
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateLead = useCallback(
    (lead: Lead, patch: UpdatePatch) => {
      updateMutation.mutate({ id: lead.id, patch, prev: lead });
    },
    [updateMutation],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"pipeline" | "leads" | "analytics">("pipeline");

  const leads = query.data ?? [];

  const selected = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">CRM</h1>
            <p className="text-sm text-muted-foreground">
              Пайплайн продаж SAMURA AUTO
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Выйти
          </Button>
        </header>

        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList className="bg-card/40 backdrop-blur-xl">
            <TabsTrigger value="pipeline">
              <LayoutGrid className="mr-2 h-4 w-4" /> Пайплайн
            </TabsTrigger>
            <TabsTrigger value="leads">
              <TableIcon className="mr-2 h-4 w-4" /> Лиды
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="mr-2 h-4 w-4" /> Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="mt-4">
            <KanbanView
              leads={leads}
              loading={query.isLoading}
              onOpenLead={setSelectedId}
              onMoveLead={(lead, status) => updateLead(lead, { status })}
            />
          </TabsContent>

          <TabsContent value="leads" className="mt-4">
            <LeadsTable
              leads={leads}
              loading={query.isLoading}
              onOpenLead={setSelectedId}
              onUpdate={updateLead}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <AnalyticsView leads={leads} loading={query.isLoading} />
          </TabsContent>
        </Tabs>
      </div>

      <LeadDrawer
        lead={selected}
        onClose={() => setSelectedId(null)}
        onUpdate={(patch) => selected && updateLead(selected, patch)}
        saving={updateMutation.isPending}
      />
    </div>
  );
}

// ---------- Kanban ----------

function KanbanView({
  leads,
  loading,
  onOpenLead,
  onMoveLead,
}: {
  leads: Lead[];
  loading: boolean;
  onOpenLead: (id: string) => void;
  onMoveLead: (lead: Lead, status: string) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const g: Record<string, Lead[]> = {};
    for (const s of STATUS_OPTIONS) g[s.value] = [];
    for (const l of leads) {
      const k = STATUS_OPTIONS.find((s) => s.value === l.status)?.value ?? "new";
      g[k].push(l);
    }
    return g;
  }, [leads]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {STATUS_OPTIONS.map((s) => (
          <Skeleton key={s.value} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {STATUS_OPTIONS.map((col) => {
        const items = grouped[col.value] ?? [];
        const total = items.reduce(
          (acc, l) => acc + parseBudgetNumber(getBudget(l)),
          0,
        );
        const isOver = overCol === col.value;
        return (
          <div
            key={col.value}
            onDragOver={(e) => {
              e.preventDefault();
              setOverCol(col.value);
            }}
            onDragLeave={() => setOverCol((v) => (v === col.value ? null : v))}
            onDrop={() => {
              if (draggingId) {
                const lead = leads.find((l) => l.id === draggingId);
                if (lead && lead.status !== col.value) {
                  onMoveLead(lead, col.value);
                  toast.success(`→ ${col.label}`);
                }
              }
              setDraggingId(null);
              setOverCol(null);
            }}
            className={cn(
              "flex min-h-[400px] flex-col rounded-xl border border-white/10 border-t-2 bg-card/40 backdrop-blur-xl transition-colors",
              COLUMN_ACCENT[col.value],
              isOver && "bg-white/[0.06] ring-1 ring-white/20",
            )}
          >
            <div className="flex items-center justify-between px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{col.label}</span>
                <Badge
                  variant="outline"
                  className="border-white/10 bg-white/[0.04] px-1.5 py-0 text-[10px] text-muted-foreground"
                >
                  {items.length}
                </Badge>
              </div>
              {total > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {formatBudget(total)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2 px-2 pb-3">
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/10 py-6 text-center text-xs text-muted-foreground">
                  Пусто
                </div>
              )}
              {items.map((lead) => (
                <KanbanCard
                  key={lead.id}
                  lead={lead}
                  onOpen={() => onOpenLead(lead.id)}
                  onDragStart={() => setDraggingId(lead.id)}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setOverCol(null);
                  }}
                  dragging={draggingId === lead.id}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanCard({
  lead,
  onOpen,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  lead: Lead;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging: boolean;
}) {
  const budget = getBudget(lead);
  const budgetN = parseBudgetNumber(budget);
  const isHighValue = budgetN >= 50000;
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      className={cn(
        "group cursor-grab rounded-lg border border-white/10 bg-card/80 p-3 shadow-sm transition-all hover:border-white/20 hover:bg-card active:cursor-grabbing",
        dragging && "opacity-40",
        isHighValue && "ring-1 ring-amber-400/30",
        lead.is_hot && "ring-1 ring-orange-400/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {lead.is_hot && <Flame className="h-3.5 w-3.5 shrink-0 text-orange-400" />}
          <span className="text-sm font-medium leading-tight">
            {lead.name || "Без имени"}
          </span>
        </div>
        {isHighValue && (
          <TrendingUp className="h-3.5 w-3.5 shrink-0 text-amber-400" />
        )}
      </div>
      {lead.phone && (
        <div className="mt-1 text-xs text-muted-foreground">{lead.phone}</div>
      )}
      {(lead.vehicle || budget) && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs">
          <span className="truncate text-foreground/70">{lead.vehicle || "—"}</span>
          {budgetN > 0 && (
            <span
              className={cn(
                "shrink-0 font-medium",
                isHighValue ? "text-amber-300" : "text-foreground/80",
              )}
            >
              {formatBudget(budgetN)}
            </span>
          )}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {formatRelative(lead.created_at)}
        </span>
        {lead.form_name && (
          <span className="text-[10px] text-muted-foreground/70">{lead.form_name}</span>
        )}
      </div>
    </div>
  );
}

// ---------- Table ----------

function LeadsTable({
  leads,
  loading,
  onOpenLead,
  onUpdate,
}: {
  leads: Lead[];
  loading: boolean;
  onOpenLead: (id: string) => void;
  onUpdate: (lead: Lead, patch: UpdatePatch) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formFilter, setFormFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

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

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={<Users className="h-4 w-4" />} label="Всего" value={stats.total} loading={loading} />
        <StatCard icon={<CalendarClock className="h-4 w-4" />} label="Сегодня" value={stats.today} loading={loading} />
        <StatCard icon={<Send className="h-4 w-4" />} label="Новые" value={stats.new} loading={loading} accent="blue" />
        <StatCard icon={<Loader2 className="h-4 w-4" />} label="В работе" value={stats.in_progress} loading={loading} accent="violet" />
        <StatCard icon={<CheckCircle2 className="h-4 w-4" />} label="Сделки" value={stats.deal} loading={loading} accent="emerald" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Премиум" value={stats.highValue} loading={loading} accent="amber" />
      </div>

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
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
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
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-hidden border-white/10 bg-card/40 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 bg-white/[0.02] text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">
                  <ColHeader label="Имя" onClick={() => toggleSort("name")} active={sortKey === "name"} dir={sortDir} />
                </th>
                <th className="px-4 py-3">Телефон</th>
                <th className="hidden px-4 py-3 lg:table-cell">Авто</th>
                <th className="hidden px-4 py-3 lg:table-cell">Бюджет</th>
                <th className="hidden px-4 py-3 md:table-cell">
                  <ColHeader label="Форма" onClick={() => toggleSort("form_name")} active={sortKey === "form_name"} dir={sortDir} />
                </th>
                <th className="px-4 py-3">
                  <ColHeader label="Дата" onClick={() => toggleSort("created_at")} active={sortKey === "created_at"} dir={sortDir} />
                </th>
                <th className="px-4 py-3">Статус</th>
                <th className="px-4 py-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="p-8 text-center text-muted-foreground"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">Лиды не найдены</td></tr>
              )}
              {filtered.map((lead) => {
                const budget = getBudget(lead);
                const budgetN = parseBudgetNumber(budget);
                return (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="cursor-pointer px-4 py-3" onClick={() => onOpenLead(lead.id)}>
                      <div className="flex items-center gap-2">
                        {lead.is_hot && <Flame className="h-3.5 w-3.5 text-orange-400" />}
                        <span className="font-medium">{lead.name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{lead.phone || "—"}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{lead.vehicle || "—"}</td>
                    <td className={cn(
                      "hidden px-4 py-3 lg:table-cell",
                      budgetN >= 50000 ? "font-medium text-amber-300" : "text-muted-foreground",
                    )}>{budget || "—"}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{lead.form_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={lead.status}
                        onValueChange={(v) => onUpdate(lead, { status: v })}
                      >
                        <SelectTrigger className={cn(
                          "h-7 w-[130px] border text-xs",
                          STATUS_STYLES[lead.status] ?? "",
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title={lead.is_hot ? "Снять hot" : "Hot lead"}
                          onClick={() => onUpdate(lead, { is_hot: !lead.is_hot })}
                        >
                          <Flame className={cn("h-3.5 w-3.5", lead.is_hot ? "text-orange-400" : "text-muted-foreground")} />
                        </Button>
                        {lead.phone && (
                          <a
                            href={`tel:${digitsOnly(lead.phone)}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
                            title="Позвонить"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          title="Открыть"
                          onClick={() => onOpenLead(lead.id)}
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ---------- Analytics ----------

function AnalyticsView({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of STATUS_OPTIONS) counts[s.value] = 0;
    let budgetSum = 0;
    let budgetCount = 0;
    const formCounts: Record<string, number> = {};
    const formDeals: Record<string, number> = {};
    for (const l of leads) {
      counts[l.status] = (counts[l.status] ?? 0) + 1;
      const b = parseBudgetNumber(getBudget(l));
      if (b > 0) {
        budgetSum += b;
        budgetCount++;
      }
      if (l.form_name) {
        formCounts[l.form_name] = (formCounts[l.form_name] ?? 0) + 1;
        if (l.status === "deal") formDeals[l.form_name] = (formDeals[l.form_name] ?? 0) + 1;
      }
    }
    const total = leads.length;
    const deals = counts.deal ?? 0;
    const conversion = total ? (deals / total) * 100 : 0;
    const avgBudget = budgetCount ? budgetSum / budgetCount : 0;
    const forms = Object.entries(formCounts)
      .map(([name, count]) => ({
        name,
        count,
        deals: formDeals[name] ?? 0,
        conv: count ? ((formDeals[name] ?? 0) / count) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
    return { counts, total, deals, conversion, avgBudget, forms };
  }, [leads]);

  if (loading) return <Skeleton className="h-96 w-full" />;

  const maxCount = Math.max(1, ...Object.values(data.counts));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Конверсия в сделку</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {data.conversion.toFixed(1)}%
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {data.deals} из {data.total} лидов
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Средний бюджет</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {formatBudget(Math.round(data.avgBudget))}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">По указанным бюджетам</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Лучшая форма</div>
            <div className="mt-2 truncate text-xl font-semibold tracking-tight">
              {data.forms[0]?.name ?? "—"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {data.forms[0] ? `${data.forms[0].count} лидов · ${data.forms[0].conv.toFixed(0)}% в сделку` : "Нет данных"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Воронка статусов</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          {STATUS_OPTIONS.map((s) => {
            const c = data.counts[s.value] ?? 0;
            const pct = (c / maxCount) * 100;
            return (
              <div key={s.value}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-medium">{c}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      s.value === "new" && "bg-blue-500/70",
                      s.value === "contacted" && "bg-amber-500/70",
                      s.value === "in_progress" && "bg-violet-500/70",
                      s.value === "deal" && "bg-emerald-500/70",
                      s.value === "lost" && "bg-zinc-500/70",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-card/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-base">Эффективность форм</CardTitle>
        </CardHeader>
        <CardContent>
          {data.forms.length === 0 ? (
            <p className="text-sm text-muted-foreground">Нет данных</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="pb-2 font-normal">Форма</th>
                  <th className="pb-2 text-right font-normal">Лиды</th>
                  <th className="pb-2 text-right font-normal">Сделки</th>
                  <th className="pb-2 text-right font-normal">Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {data.forms.map((f) => (
                  <tr key={f.name} className="border-t border-white/5">
                    <td className="py-2">{f.name}</td>
                    <td className="py-2 text-right text-muted-foreground">{f.count}</td>
                    <td className="py-2 text-right text-emerald-300">{f.deals}</td>
                    <td className="py-2 text-right font-medium">{f.conv.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Shared ----------

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

// ---------- Drawer ----------

function LeadDrawer({
  lead,
  onClose,
  onUpdate,
  saving,
}: {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: (patch: UpdatePatch) => void;
  saving: boolean;
}) {
  const [notesDraft, setNotesDraft] = useState("");
  const [activityVersion, setActivityVersion] = useState(0);

  useEffect(() => {
    setNotesDraft(lead?.notes ?? "");
  }, [lead?.id, lead?.notes]);

  const activity = useMemo(() => {
    if (!lead) return [] as Activity[];
    return loadActivity()[lead.id] ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id, activityVersion, lead?.status, lead?.is_hot, lead?.notes]);

  const phoneDigits = digitsOnly(lead?.phone ?? null);
  const tgUrl = phoneDigits ? `https://t.me/+${phoneDigits.replace(/^\+/, "")}` : null;

  const copyPhone = async () => {
    if (!lead?.phone) return;
    try {
      await navigator.clipboard.writeText(lead.phone);
      toast.success("Телефон скопирован");
    } catch {
      toast.error("Не удалось скопировать");
    }
  };

  const triggerUpdate = (patch: UpdatePatch) => {
    onUpdate(patch);
    // Force activity re-read after save round-trip
    setTimeout(() => setActivityVersion((v) => v + 1), 600);
  };

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
              {/* Quick actions */}
              {lead.phone && (
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${phoneDigits}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium transition-colors hover:bg-white/[0.07]"
                  >
                    <Phone className="h-3.5 w-3.5" /> Звонок
                  </a>
                  {tgUrl && (
                    <a
                      href={tgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium transition-colors hover:bg-white/[0.07]"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Telegram
                    </a>
                  )}
                  <button
                    onClick={copyPhone}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium transition-colors hover:bg-white/[0.07]"
                  >
                    <Copy className="h-3.5 w-3.5" /> Копировать
                  </button>
                </div>
              )}

              {/* Status quick switch */}
              <div>
                <Label className="text-xs">Статус</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => triggerUpdate({ status: s.value })}
                      disabled={saving || lead.status === s.value}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs transition-all",
                        lead.status === s.value
                          ? STATUS_STYLES[s.value]
                          : "border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.06]",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant={lead.is_hot ? "default" : "outline"}
                className="w-full"
                onClick={() => triggerUpdate({ is_hot: !lead.is_hot })}
                disabled={saving}
              >
                <Flame className="mr-2 h-4 w-4" />
                {lead.is_hot ? "Снять Hot отметку" : "Отметить как Hot"}
              </Button>

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
                    onClick={() => triggerUpdate({ notes: notesDraft || null })}
                    disabled={saving || notesDraft === (lead.notes ?? "")}
                  >
                    Сохранить
                  </Button>
                </div>
              </Section>

              {/* Activity timeline */}
              <Section title="История">
                {activity.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Действия по этому лиду появятся здесь.
                  </p>
                ) : (
                  <ol className="relative space-y-3 border-l border-white/10 pl-4">
                    {activity.map((a) => (
                      <li key={a.id} className="relative">
                        <span className="absolute -left-[21px] top-1.5 inline-flex h-2 w-2 rounded-full bg-white/40" />
                        <div className="flex items-start gap-2 text-xs">
                          <ActivityIcon kind={a.kind} />
                          <div className="flex-1">
                            <div className="text-foreground/90">{describeActivity(a)}</div>
                            <div className="mt-0.5 text-[10px] text-muted-foreground">
                              {formatRelative(a.ts)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
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
              <Section title="Telegram уведомление">
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

              {/* Submission JSON */}
              <Section title="Данные формы">
                <pre className="max-h-72 overflow-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-muted-foreground">
                  {JSON.stringify(lead.submission_json, null, 2)}
                </pre>
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ActivityIcon({ kind }: { kind: Activity["kind"] }) {
  const cls = "h-3.5 w-3.5 shrink-0";
  if (kind === "status") return <ArrowRight className={cn(cls, "text-blue-300")} />;
  if (kind === "hot") return <Flame className={cn(cls, "text-orange-400")} />;
  if (kind === "note") return <StickyNote className={cn(cls, "text-violet-300")} />;
  return <Clock className={cn(cls, "text-muted-foreground")} />;
}

function describeActivity(a: Activity): string {
  if (a.kind === "status") {
    return `Статус: ${statusLabel(a.from ?? "")} → ${statusLabel(a.to ?? "")}`;
  }
  if (a.kind === "hot") {
    return a.to === "on" ? "Отмечен как Hot" : "Hot отметка снята";
  }
  if (a.kind === "note") {
    return a.text ? `Заметка обновлена: «${a.text.slice(0, 60)}${a.text.length > 60 ? "…" : ""}»` : "Заметка очищена";
  }
  return "Событие";
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
