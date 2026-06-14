import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, Inbox, FileSignature, CheckCircle2, ArrowUpRight, ArrowDownRight, ArrowRight, Plus, Download, CalendarClock, AlertCircle, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { leads, statusColor, statusLabel, typeLabel, employees } from "@/lib/mock-leads";
import { getDueTasks, getNextTask } from "@/lib/mock-tasks";

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
  const navigate = useNavigate();
  const recent = leads.slice(0, 5);

  // Anforderung 4/8: Kennzahlen für "Offene Aufgaben heute" – live aus den Mock-Leads berechnet.
  const dueTasks = getDueTasks();
  const dueWiedervorlagen = dueTasks.filter((t) => t.type === "wiedervorlage").length;
  const neueLeads = leads.filter((l) => l.status === "neu").length;
  const inPruefung = leads.filter((l) => l.status === "in_pruefung").length;
  const rueckfragenOffen = leads.filter((l) => l.status === "rueckfrage").length;
  const nextTask = getNextTask();

  function handleOpenNextTask() {
    if (!nextTask) return;
    navigate({ to: "/mitarbeiter/leads/$id", params: { id: nextTask.leadId } });
  }

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

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                {dueTasks.length}
              </div>
              <div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardList className="h-5 w-5 text-primary" />Offene Aufgaben heute
                </div>
                <p className="text-sm text-muted-foreground">Fällige Wiedervorlagen, Rückfragen und neue Leads, die auf dich warten.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 py-1.5"><CalendarClock className="h-3.5 w-3.5" />{dueWiedervorlagen} fällige Wiedervorlagen</Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5"><Inbox className="h-3.5 w-3.5" />{neueLeads} neue Leads</Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5"><AlertCircle className="h-3.5 w-3.5" />{rueckfragenOffen} Rückfragen offen</Badge>
              <Badge variant="outline" className="gap-1.5 py-1.5">{inPruefung} in Prüfung</Badge>
              <Button size="sm" onClick={handleOpenNextTask} disabled={!nextTask}>
                {nextTask ? "Nächste Aufgabe öffnen" : "Alles erledigt 🎉"}
                {nextTask && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

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
            {employees.filter(e => e.active).map((e) => {
              const total = e.closed + e.open;
              const pct = total > 0 ? Math.round((e.closed / total) * 100) : 0;
              return (
                <div key={e.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{e.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{e.role}</div>
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
