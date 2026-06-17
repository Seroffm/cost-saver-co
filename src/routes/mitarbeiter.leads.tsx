import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Plus, Phone, Mail, ChevronRight, Flame, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { statusColor, statusLabel, typeLabel, type LeadStatus } from "@/lib/mock-leads";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLeads } from "@/lib/api-client";
import { mapLeadStatus, mapLeadType } from "@/lib/api-types";
import type { BackendLead } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/leads")({
  head: () => ({
    meta: [{ title: "Leads – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: LeadsPage,
});

function adaptLead(l: BackendLead) {
  return {
    id: l.id,
    lead_number: l.lead_number,
    name: `${l.first_name} ${l.last_name}`,
    email: l.email,
    phone: l.phone ?? "",
    type: mapLeadType(l.product_type, l.customer_type),
    status: mapLeadStatus(l.status),
    score: l.score,
    assignee: l.assigned_to ?? "—",
    createdAt: l.created_at,
  };
}

function LeadsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "alle">("alle");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leads"],
    queryFn: () => getLeads({ pageSize: 100 }),
  });

  const leads = useMemo(() => (data?.data ?? []).map(adaptLead), [data]);

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        if (filter !== "alle" && l.status !== filter) return false;
        if (q && !`${l.name} ${l.lead_number} ${l.email}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }),
    [leads, q, filter],
  );

  if (pathname !== "/mitarbeiter/leads") return <Outlet />;

  function exportCsv() {
    const headers = [
      "ID",
      "Lead-Nr.",
      "Name",
      "Email",
      "Telefon",
      "Typ",
      "Status",
      "Score",
      "Berater",
      "Erstellt",
    ];
    const rows = filtered.map((l) => [
      l.id,
      l.lead_number,
      l.name,
      l.email,
      l.phone,
      typeLabel[l.type],
      statusLabel[l.status],
      l.score,
      l.assignee,
      l.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell
      title="Leads"
      subtitle={isLoading ? "Laden…" : `${filtered.length} von ${leads.length} Leads`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            CSV-Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Neuer Lead
          </Button>
        </>
      }
    >
      {isError && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Leads konnten nicht geladen werden. Bitte neu anmelden.
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Lead suchen…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />
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
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Leads werden geladen…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Lead</th>
                    <th className="px-6 py-3 font-medium">Typ</th>
                    <th className="px-6 py-3 font-medium">Lead-Nr.</th>
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
                            {l.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium">{l.name}</div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {l.email}
                              </span>
                              {l.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {l.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{typeLabel[l.type]}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                        {l.lead_number}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${l.score > 80 ? "text-emerald-600" : l.score > 50 ? "text-amber-600" : "text-rose-600"}`}
                          >
                            {l.score}
                          </span>
                          {l.score > 80 && <Flame className="h-3.5 w-3.5 text-amber-500" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${statusColor[l.status]} border-0`}>
                          {statusLabel[l.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs truncate max-w-[120px]">
                        {l.assignee === "—" ? "—" : l.assignee.slice(0, 8) + "…"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link to="/mitarbeiter/leads/$id" params={{ id: l.id }}>
                            Öffnen <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-muted-foreground"
                      >
                        Keine Leads gefunden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
