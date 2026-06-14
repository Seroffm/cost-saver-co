import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, Inbox, FileSignature, CheckCircle2, ArrowUpRight, ArrowDownRight, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { leads, statusColor, statusLabel, typeLabel, employees } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: Dashboard,
});

const stats = [
  { label: "Leads heute", value: "24", delta: "+18%", up: true, icon: Inbox },
  { label: "Angebote gesendet", value: "12", delta: "+6%", up: true, icon: FileSignature },
  { label: "Abschlüsse (Monat)", value: "43", delta: "+22%", up: true, icon: CheckCircle2 },
  { label: "Conversion Rate", value: "31,4 %", delta: "-2,1%", up: false, icon: TrendingUp },
];

function Dashboard() {
  const recent = leads.slice(0, 5);
  return (
    <AdminShell
      title="Dashboard"
      subtitle="Übersicht: Leads, Abschlüsse und Team-Performance"
      actions={<>
        <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export</Button>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />Lead anlegen</Button>
      </>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2 text-primary"><s.icon className="h-5 w-5" /></div>
                </div>
                <div className={`mt-3 flex items-center gap-1 text-xs ${s.up ? "text-emerald-600" : "text-rose-600"}`}>
                  {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.delta} vs. letzte Woche
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Neueste Leads</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/mitarbeiter/leads">Alle ansehen</Link></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recent.map((l) => (
                <Link key={l.id} to="/mitarbeiter/leads/$id" params={{ id: l.id }} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {l.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{l.name}</span>
                      <Badge variant="outline" className="text-[10px]">{typeLabel[l.type]}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{l.city} · {l.consumption.toLocaleString("de-DE")} kWh · {l.id}</div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-sm font-medium text-emerald-600">+{l.expectedSavings} €</div>
                    <div className="text-xs text-muted-foreground">Score {l.score}</div>
                  </div>
                  <Badge className={`${statusColor[l.status]} border-0`}>{statusLabel[l.status]}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Team-Performance</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {employees.map((e) => {
              const total = e.closed + e.open;
              const pct = Math.round((e.closed / total) * 100);
              return (
                <div key={e.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.role}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">{e.closed} / {total}</div>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Umsatzprognose Q3</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">142.800 €</div>
            <div className="mt-1 text-xs text-emerald-600">+12 % vs. Q2</div>
            <div className="mt-4 flex h-24 items-end gap-1.5">
              {[40, 55, 38, 62, 48, 70, 58, 80, 65, 90, 72, 95].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${h}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Lead-Quellen</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Google Ads", value: 38 },
              { label: "Meta Ads", value: 24 },
              { label: "SEO / Organisch", value: 21 },
              { label: "Empfehlungen", value: 12 },
              { label: "Direkt", value: 5 },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-xs"><span>{s.label}</span><span className="text-muted-foreground">{s.value}%</span></div>
                <Progress value={s.value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {[
              { label: "Formular gestartet", value: 412 },
              { label: "Lead abgeschickt", value: 188 },
              { label: "Angebot gesendet", value: 96 },
              { label: "Vertrag gesendet", value: 64 },
              { label: "Abschluss", value: 43 },
            ].map((f, i, arr) => {
              const pct = Math.round((f.value / arr[0].value) * 100);
              return (
                <div key={f.label}>
                  <div className="flex justify-between"><span>{f.label}</span><span className="text-muted-foreground">{f.value} · {pct}%</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded bg-muted"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
