import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Inbox,
  FileSignature,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Download,
  CalendarClock,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { statusColor, statusLabel, typeLabel } from "@/lib/mock-leads";
import { getLeads } from "@/lib/api-client";
import { mapLeadStatus, mapLeadType } from "@/lib/api-types";
import type { BackendLead } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Leads heute", value: "—", delta: "", up: true, icon: Inbox },
  { label: "Angebote gesendet", value: "—", delta: "", up: true, icon: FileSignature },
  { label: "Abschlüsse (Monat)", value: "—", delta: "", up: true, icon: CheckCircle2 },
  { label: "Conversion Rate", value: "—", delta: "", up: true, icon: TrendingUp },
];

function adaptLead(l: BackendLead) {
  return {
    id: l.id,
    lead_number: l.lead_number,
    name: `${l.first_name} ${l.last_name}`,
    email: l.email,
    type: mapLeadType(l.product_type, l.customer_type),
    status: mapLeadStatus(l.status),
    score: l.score,
    assignee: l.assigned_to ?? "—",
    createdAt: l.created_at,
    expectedSavings: 0,
  };
}

function Dashboard() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => getLeads({ pageSize: 100 }),
  });

  const leads = (data?.data ?? []).map(adaptLead);
  const recent = leads.slice(0, 5);

  const neueLeads = leads.filter((l) => l.status === "neu").length;
  const inPruefung = leads.filter((l) => l.status === "in_pruefung").length;
  const rueckfragenOffen = leads.filter((l) => l.status === "rueckfrage").length;
  const wiedervorlageCount = leads.filter((l) => l.status === "wiedervorlage").length;
  const offeneAufgaben = neueLeads + inPruefung + rueckfragenOffen + wiedervorlageCount;

  const nextLead =
    leads.find((l) => l.status === "wiedervorlage") ??
    leads.find((l) => l.status === "rueckfrage") ??
    leads.find((l) => l.status === "neu");

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Übersicht: Leads, Abschlüsse und Team-Performance"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Lead anlegen
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                {s.delta && (
                  <div
                    className={`mt-3 flex items-center gap-1 text-xs ${s.up ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {s.up ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {s.delta} vs. letzte Woche
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                {isLoading ? "…" : offeneAufgaben}
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Offene Aufgaben
                </div>
                <p className="text-sm text-muted-foreground">
                  Fällige Wiedervorlagen, Rückfragen und neue Leads.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 py-1.5">
                <CalendarClock className="h-3.5 w-3.5" />
                {wiedervorlageCount} Wiedervorlagen
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5">
                <Inbox className="h-3.5 w-3.5" />
                {neueLeads} neue Leads
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                {rueckfragenOffen} Rückfragen
              </Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5">
                {inPruefung} in Prüfung
              </Badge>
              <Button
                size="sm"
                onClick={() =>
                  nextLead &&
                  navigate({ to: "/mitarbeiter/leads/$id", params: { id: nextLead.id } })
                }
                disabled={!nextLead || isLoading}
              >
                {nextLead ? "Nächsten Lead öffnen" : "Alles erledigt 🎉"}
                {nextLead && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Neueste Leads</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/mitarbeiter/leads">Alle ansehen</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                Laden…
              </div>
            ) : (
              <div className="divide-y">
                {recent.map((l) => (
                  <Link
                    key={l.id}
                    to="/mitarbeiter/leads/$id"
                    params={{ id: l.id }}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {l.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">{l.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {typeLabel[l.type]}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{l.lead_number}</div>
                    </div>
                    <div className="hidden text-right md:block">
                      <div className="text-xs text-muted-foreground">Score {l.score}</div>
                    </div>
                    <Badge className={`${statusColor[l.status]} border-0`}>
                      {statusLabel[l.status]}
                    </Badge>
                  </Link>
                ))}
                {recent.length === 0 && (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                    Keine Leads vorhanden.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead-Status-Übersicht</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Neu", count: neueLeads },
              { label: "In Prüfung", count: inPruefung },
              { label: "Rückfrage offen", count: rueckfragenOffen },
              { label: "Wiedervorlage", count: wiedervorlageCount },
              {
                label: "Abgeschlossen",
                count: leads.filter((l) => l.status === "abgeschlossen").length,
              },
            ].map((s) => {
              const pct = leads.length > 0 ? Math.round((s.count / leads.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{s.label}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead-Quellen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Google Ads", value: 38 },
              { label: "Meta Ads", value: 24 },
              { label: "SEO / Organisch", value: 21 },
              { label: "Empfehlungen", value: 12 },
              { label: "Direkt", value: 5 },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{s.label}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <Progress value={s.value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { label: "Gesamt", value: leads.length },
              {
                label: "Angebot erstellt",
                value: leads.filter(
                  (l) => l.status === "angebot_erstellt" || l.status === "angebot_gesendet",
                ).length,
              },
              {
                label: "Vertrag vorbereitet",
                value: leads.filter(
                  (l) => l.status === "vertrag_vorbereitet" || l.status === "vertrag_gesendet",
                ).length,
              },
              {
                label: "Abschluss",
                value: leads.filter((l) => l.status === "abgeschlossen").length,
              },
            ].map((f, _, arr) => {
              const pct = arr[0].value > 0 ? Math.round((f.value / arr[0].value) * 100) : 0;
              return (
                <div key={f.label}>
                  <div className="flex justify-between">
                    <span>{f.label}</span>
                    <span className="text-muted-foreground">
                      {f.value} · {pct}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted">
                    <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score-Verteilung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              {
                label: "Hot (≥80)",
                count: leads.filter((l) => l.score >= 80).length,
                color: "bg-emerald-500",
              },
              {
                label: "Warm (50–79)",
                count: leads.filter((l) => l.score >= 50 && l.score < 80).length,
                color: "bg-amber-500",
              },
              {
                label: "Cold (<50)",
                count: leads.filter((l) => l.score < 50).length,
                color: "bg-rose-500",
              },
            ].map((s) => {
              const pct = leads.length > 0 ? Math.round((s.count / leads.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex justify-between">
                    <span>{s.label}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted">
                    <div className={`h-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
