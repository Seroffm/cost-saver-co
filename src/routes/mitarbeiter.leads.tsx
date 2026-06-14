import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Filter, Plus, Phone, Mail, ChevronRight, Flame, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { leads, statusColor, statusLabel, typeLabel, type LeadStatus } from "@/lib/mock-leads";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/mitarbeiter/leads")({
  head: () => ({ meta: [{ title: "Leads – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // If a child route (detail) is active, render only the outlet
  if (pathname !== "/mitarbeiter/leads") return <Outlet />;

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "alle">("alle");

  const filtered = useMemo(() => leads.filter((l) => {
    if (filter !== "alle" && l.status !== filter) return false;
    if (q && !(`${l.name} ${l.id} ${l.city} ${l.email}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [q, filter]);

  function exportCsv() {
    const headers = ["ID", "Name", "Email", "Telefon", "PLZ", "Stadt", "Typ", "Verbrauch_kWh", "Aktueller_Anbieter", "Status", "Score", "Berater", "Erstellt"];
    const rows = filtered.map((l) => [l.id, l.name, l.email, l.phone, l.plz, l.city, typeLabel[l.type], l.consumption, l.currentProvider, statusLabel[l.status], l.score, l.assignee, l.createdAt]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <AdminShell
      title="Leads"
      subtitle={`${filtered.length} von ${leads.length} Leads`}
      actions={<>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />CSV-Export</Button>
        <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" />Filter</Button>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />Neuer Lead</Button>
      </>}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input placeholder="Lead suchen…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Tabs value={filter} onValueChange={(v) => setFilter(v as LeadStatus | "alle")}>
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="alle">Alle</TabsTrigger>
            <TabsTrigger value="neu">Neu</TabsTrigger>
            <TabsTrigger value="in_pruefung">In Prüfung</TabsTrigger>
            <TabsTrigger value="rueckfrage">Rückfrage</TabsTrigger>
            <TabsTrigger value="angebot_gesendet">Angebot</TabsTrigger>
            <TabsTrigger value="interessiert">Interessiert</TabsTrigger>
            <TabsTrigger value="vertrag_gesendet">Vertrag</TabsTrigger>
            <TabsTrigger value="abgeschlossen">Abgeschlossen</TabsTrigger>
            <TabsTrigger value="wiedervorlage">Wiedervorlage</TabsTrigger>
            <TabsTrigger value="nicht_erreichbar">Nicht erreichbar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Lead</th>
                  <th className="px-6 py-3 font-medium">Typ</th>
                  <th className="px-6 py-3 font-medium">Standort</th>
                  <th className="px-6 py-3 font-medium">Verbrauch</th>
                  <th className="px-6 py-3 font-medium">Score</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Berater</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((l) => (
                  <tr key={l.id} className="group transition-colors hover:bg-muted/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {l.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-medium">{l.name}</div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{l.email}</span>
                            {l.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{l.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge variant="outline">{typeLabel[l.type]}</Badge></td>
                    <td className="px-6 py-4 text-muted-foreground">{l.plz} {l.city}</td>
                    <td className="px-6 py-4">{l.consumption.toLocaleString("de-DE")} kWh</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${l.score > 80 ? "text-emerald-600" : l.score > 50 ? "text-amber-600" : "text-rose-600"}`}>{l.score}</span>
                        {l.score > 80 && <Flame className="h-3.5 w-3.5 text-amber-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge className={`${statusColor[l.status]} border-0`}>{statusLabel[l.status]}</Badge></td>
                    <td className="px-6 py-4 text-muted-foreground">{l.assignee}</td>
                    <td className="px-6 py-4 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/mitarbeiter/leads/$id" params={{ id: l.id }}>Öffnen <ChevronRight className="ml-1 h-4 w-4" /></Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
