import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Zap, FileText, Send, Save, MessageSquare, Calendar, FileSignature, CheckCircle2, Upload, Download, Clock, RefreshCw, AlertCircle, Inbox } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { getLead, statusColor, statusLabel, typeLabel, type Lead, type LeadStatus } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/leads/$id")({
  head: () => ({ meta: [{ title: "Lead Detail – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }] }),
  loader: ({ params }): { lead: Lead } => {
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

const docColor = {
  rechnung: "bg-amber-500/15 text-amber-700",
  angebot: "bg-blue-500/15 text-blue-700",
  vertrag: "bg-emerald-500/15 text-emerald-700",
  sonstiges: "bg-slate-500/15 text-slate-700",
};

const offerStatusColor = {
  entwurf: "bg-slate-500/15 text-slate-700",
  gesendet: "bg-violet-500/15 text-violet-700",
  angenommen: "bg-emerald-500/15 text-emerald-700",
  abgelehnt: "bg-rose-500/15 text-rose-700",
};

function LeadDetail() {
  const { lead } = Route.useLoaderData() as { lead: Lead };
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [note, setNote] = useState("");

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
            <CardContent className="p-0">
              <Tabs defaultValue="timeline">
                <div className="border-b px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="timeline">Verlauf</TabsTrigger>
                    <TabsTrigger value="notes">Notizen ({lead.notes.length})</TabsTrigger>
                    <TabsTrigger value="documents">Dokumente ({lead.documents.length})</TabsTrigger>
                    <TabsTrigger value="emails">E-Mails ({lead.emails.length})</TabsTrigger>
                    <TabsTrigger value="offers">Angebote ({lead.offers.length})</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="timeline" className="p-6">
                  <Timeline lead={lead} />
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 p-6">
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
                </TabsContent>

                <TabsContent value="documents" className="space-y-3 p-6">
                  {lead.documents.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Dokumente.</p>}
                  {lead.documents.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.size} · {new Date(d.uploadedAt).toLocaleDateString("de-DE")}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${docColor[d.kind]} border-0 capitalize`}>{d.kind}</Badge>
                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full"><Upload className="mr-2 h-4 w-4" />Dokument hochladen</Button>
                </TabsContent>

                <TabsContent value="emails" className="space-y-3 p-6">
                  {lead.emails.length === 0 && <p className="text-sm text-muted-foreground">Noch keine E-Mails.</p>}
                  {lead.emails.map((e) => (
                    <div key={e.id} className="flex gap-3 rounded-lg border p-3">
                      <div className={`mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-full ${e.direction === "in" ? "bg-blue-500/15 text-blue-600" : "bg-emerald-500/15 text-emerald-600"}`}>
                        {e.direction === "in" ? <Inbox className="h-4 w-4" /> : <Send className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <span className="truncate text-sm font-medium">{e.subject}</span>
                          <span className="flex-none text-xs text-muted-foreground">{new Date(e.date).toLocaleString("de-DE")}</span>
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {e.direction === "in" ? "Von" : "An"}: {e.direction === "in" ? e.from : e.to}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{e.preview}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="offers" className="space-y-3 p-6">
                  {lead.offers.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Angebote erstellt.</p>}
                  {lead.offers.map((o) => (
                    <div key={o.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">{o.providerName} · {o.tariffName}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {o.monthlyPrice} €/Monat · {o.yearlyPrice.toLocaleString("de-DE")} €/Jahr
                          </div>
                        </div>
                        <Badge className={`${offerStatusColor[o.status]} border-0 capitalize`}>{o.status}</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t pt-3">
                        <div className="text-sm font-medium text-emerald-600">Ersparnis: +{o.savings} €/Jahr</div>
                        {o.sentAt && <div className="text-xs text-muted-foreground">Versendet: {new Date(o.sentAt).toLocaleDateString("de-DE")}</div>}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full"><FileText className="mr-2 h-4 w-4" />Neues Angebot erstellen</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

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
              <div className="mt-4 space-y-1 text-left text-xs text-muted-foreground">
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
                  {Object.entries(statusLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
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
              <Button variant="outline" className="w-full justify-start" size="sm"><MessageSquare className="mr-2 h-4 w-4" />Rückfrage senden</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><FileText className="mr-2 h-4 w-4" />Angebot anfordern</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><Send className="mr-2 h-4 w-4" />Angebot senden</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><FileSignature className="mr-2 h-4 w-4" />Vertrag vorbereiten</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><FileSignature className="mr-2 h-4 w-4" />Vertrag senden</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><Clock className="mr-2 h-4 w-4" />Wiedervorlage setzen</Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><RefreshCw className="mr-2 h-4 w-4" />Lead neu zuweisen</Button>
              <Button variant="outline" className="w-full justify-start text-rose-600 hover:text-rose-700" size="sm"><AlertCircle className="mr-2 h-4 w-4" />Lead ablehnen</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

function Timeline({ lead }: { lead: Lead }) {
  const steps = [
    { icon: Calendar, label: "Lead eingegangen", date: lead.createdAt, done: true },
    { icon: MessageSquare, label: "Erstkontakt", date: lead.notes[0]?.date, done: lead.status !== "neu" },
    { icon: FileText, label: "Angebot erstellt", date: lead.offers[0]?.sentAt, done: ["angebot_erstellt","angebot_gesendet","interessiert","vertrag_vorbereitet","vertrag_gesendet","abgeschlossen"].includes(lead.status) },
    { icon: Send, label: "Angebot gesendet", date: lead.offers[0]?.sentAt, done: ["angebot_gesendet","interessiert","vertrag_vorbereitet","vertrag_gesendet","abgeschlossen"].includes(lead.status) },
    { icon: FileSignature, label: "Vertrag gesendet", date: lead.status === "vertrag_gesendet" || lead.status === "abgeschlossen" ? "2026-06-14" : undefined, done: ["vertrag_gesendet","abgeschlossen"].includes(lead.status) },
    { icon: CheckCircle2, label: "Abgeschlossen", date: lead.status === "abgeschlossen" ? "2026-06-15" : undefined, done: lead.status === "abgeschlossen" },
  ];
  return (
    <ol className="relative space-y-6 border-l-2 border-muted pl-6">
      {steps.map((t, i) => (
        <li key={i} className="relative">
          <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ${t.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            <t.icon className="h-3 w-3" />
          </div>
          <div className="font-medium">{t.label}</div>
          <div className="text-xs text-muted-foreground">{t.date ? new Date(t.date).toLocaleString("de-DE") : "Ausstehend"}</div>
        </li>
      ))}
    </ol>
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
