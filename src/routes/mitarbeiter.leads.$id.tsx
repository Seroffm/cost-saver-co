import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Zap, FileText, Send, Save, MessageSquare, Calendar, FileSignature, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { getLead, statusColor, statusLabel, typeLabel, type Lead, type LeadStatus } from "@/lib/mock-leads";



export const Route = createFileRoute("/mitarbeiter/leads/$id")({
  head: () => ({ meta: [{ title: "Lead Detail – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }] }),
  loader: ({ params }) => {
    const lead = getLead(params.id);
    if (!lead) throw notFound();
    return { lead };
  },
  notFoundComponent: () => (
    <AdminShell title="Lead nicht gefunden">
      <Button asChild variant="outline"><Link to="/mitarbeiter/leads"><ArrowLeft className="mr-2 h-4 w-4" />Zurück</Link></Button>
    </AdminShell>
  ),
  errorComponent: () => <AdminShell title="Fehler"><p>Lead konnte nicht geladen werden.</p></AdminShell>,
  component: LeadDetail,
});

function LeadDetail() {
  const { lead } = Route.useLoaderData();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [note, setNote] = useState("");

  const timeline = [
    { icon: Calendar, label: "Lead eingegangen", date: lead.createdAt, done: true },
    { icon: MessageSquare, label: "Erstkontakt", date: lead.notes[0]?.date, done: lead.status !== "neu" },
    { icon: FileText, label: "Angebot gesendet", date: lead.status === "angebot_gesendet" || lead.status === "vertrag_gesendet" || lead.status === "abgeschlossen" ? "2026-06-13" : undefined, done: ["angebot_gesendet","vertrag_gesendet","abgeschlossen"].includes(lead.status) },
    { icon: FileSignature, label: "Vertrag gesendet", date: lead.status === "vertrag_gesendet" || lead.status === "abgeschlossen" ? "2026-06-14" : undefined, done: ["vertrag_gesendet","abgeschlossen"].includes(lead.status) },
    { icon: CheckCircle2, label: "Abgeschlossen", date: lead.status === "abgeschlossen" ? "2026-06-15" : undefined, done: lead.status === "abgeschlossen" },
  ];

  return (
    <AdminShell
      title={lead.name}
      subtitle={`${lead.id} · ${typeLabel[lead.type]} · ${lead.plz} ${lead.city}`}
      actions={<>
        <Button asChild variant="outline" size="sm"><Link to="/mitarbeiter/leads"><ArrowLeft className="mr-2 h-4 w-4" />Zurück</Link></Button>
        <Button size="sm"><Send className="mr-2 h-4 w-4" />Angebot senden</Button>
      </>}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Kontakt & Verbrauch</CardTitle>
              <Badge className={`${statusColor[lead.status]} border-0`}>{statusLabel[lead.status]}</Badge>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info icon={Mail} label="E-Mail" value={lead.email} />
              <Info icon={Phone} label="Telefon" value={lead.phone || "—"} />
              <Info icon={MapPin} label="Adresse" value={`${lead.plz} ${lead.city}`} />
              <Info icon={Zap} label="Aktueller Anbieter" value={lead.currentProvider} />
              <Info icon={Zap} label="Jahresverbrauch" value={`${lead.consumption.toLocaleString("de-DE")} kWh`} />
              <Info icon={FileText} label="Monatl. Abschlag" value={`${lead.monthlyPayment} €`} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Verlauf</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative space-y-6 border-l-2 border-muted pl-6">
                {timeline.map((t, i) => (
                  <li key={i} className="relative">
                    <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ${t.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <t.icon className="h-3 w-3" />
                    </div>
                    <div className="font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.date ? new Date(t.date).toLocaleString("de-DE") : "Ausstehend"}</div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Notizen ({lead.notes.length})</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {lead.notes.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Notizen.</p>}
              {lead.notes.map((n) => (
                <div key={n.id} className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{n.author}</span>
                    <span>{new Date(n.date).toLocaleString("de-DE")}</span>
                  </div>
                  <p className="mt-2 text-sm">{n.text}</p>
                </div>
              ))}
              <div className="space-y-2 pt-2">
                <Textarea placeholder="Neue Notiz hinzufügen…" value={note} onChange={(e) => setNote(e.target.value)} />
                <div className="flex justify-end">
                  <Button size="sm"><Save className="mr-2 h-4 w-4" />Speichern</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: scoring + actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Lead-Score</CardTitle></CardHeader>
            <CardContent className="text-center">
              <div className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full text-4xl font-bold ${lead.score > 80 ? "bg-emerald-500/10 text-emerald-600" : lead.score > 50 ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}`}>
                {lead.score}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {lead.score > 80 ? "Heißer Lead – sofort kontaktieren" : lead.score > 50 ? "Solider Lead" : "Niedrige Priorität"}
              </p>
              <div className="mt-4 text-left text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between"><span>Rechnung hochgeladen</span><span>{lead.hasInvoice ? "+15" : "0"}</span></div>
                <div className="flex justify-between"><span>Telefon vorhanden</span><span>{lead.phone ? "+10" : "0"}</span></div>
                <div className="flex justify-between"><span>Verbrauch</span><span>+{Math.min(40, Math.round(lead.consumption / 200))}</span></div>
                <div className="flex justify-between"><span>Quelle: {lead.source}</span><span>+5</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Status ändern</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="w-full" size="sm">Aktualisieren</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Erwartete Ersparnis</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-emerald-600">+{lead.expectedSavings} €</div>
              <p className="mt-1 text-xs text-muted-foreground">pro Jahr · {typeLabel[lead.type]}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Schnellaktionen</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm"><Phone className="mr-2 h-4 w-4" />Anrufen</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><Mail className="mr-2 h-4 w-4" />E-Mail senden</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><FileText className="mr-2 h-4 w-4" />Angebot erstellen</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><FileSignature className="mr-2 h-4 w-4" />Vertrag senden</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-muted p-2"><Icon className="h-4 w-4 text-muted-foreground" /></div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}
