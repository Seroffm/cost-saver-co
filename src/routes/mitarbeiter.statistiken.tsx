import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Users, FileSignature, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { employees } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/statistiken")({
  head: () => ({ meta: [{ title: "Statistiken – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: StatistikenPage,
});

const kpi = [
  { label: "Leads gesamt (Monat)", value: "412", icon: Users },
  { label: "Abschlüsse", value: "43", icon: FileSignature },
  { label: "Umsatz", value: "142.800 €", icon: Euro },
  { label: "Conversion", value: "10,4 %", icon: TrendingUp },
];

const monthly = [12, 18, 15, 22, 28, 25, 32, 38, 35, 42, 39, 48];

function StatistikenPage() {
  return (
    <AdminShell title="Statistiken" subtitle="KPIs, Funnel, Quellen & Teamleistung">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">{k.label}</div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary"><k.icon className="h-4 w-4" /></div>
              </div>
              <div className="mt-2 text-2xl font-semibold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Abschlüsse pro Monat</CardTitle></CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {monthly.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-sm bg-gradient-to-t from-primary to-emerald-400" style={{ height: `${(v / 50) * 100}%` }} />
                  <div className="text-[10px] text-muted-foreground">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Mitarbeiter-Ranking</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {[...employees].sort((a, b) => b.closed - a.closed).map((e, i) => (
              <div key={e.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">{i + 1}</span>
                    <span className="font-medium">{e.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{e.closed} Abschlüsse</span>
                </div>
                <Progress value={(e.closed / 20) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Conversion-Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Formular gestartet", value: 1240, pct: 100 },
                { label: "Step 3 erreicht", value: 812, pct: 65 },
                { label: "Lead abgeschickt", value: 412, pct: 33 },
                { label: "Angebot gesendet", value: 188, pct: 15 },
                { label: "Vertrag gesendet", value: 96, pct: 8 },
                { label: "Abschluss", value: 43, pct: 3.5 },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-4">
                  <div className="w-40 text-sm">{f.label}</div>
                  <div className="flex-1">
                    <div className="h-6 overflow-hidden rounded bg-muted">
                      <div className="flex h-full items-center justify-end bg-gradient-to-r from-primary to-emerald-500 px-2 text-xs font-medium text-primary-foreground" style={{ width: `${f.pct}%` }}>
                        {f.pct}%
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm tabular-nums">{f.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
