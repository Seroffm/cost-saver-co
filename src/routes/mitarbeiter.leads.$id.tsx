import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Mail, Phone, MapPin, Zap, FileText, Send, Save, MessageSquare, Calendar, FileSignature, CheckCircle2, Upload, Download, Clock, RefreshCw, AlertCircle, Inbox, MoreVertical, CalendarClock } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { cn } from "@/lib/utils";
import { useMockAuth, roleBadgeLabel } from "@/lib/mock-auth";
import {
  getLead, statusColor, statusLabel, typeLabel,
  type Lead, type LeadStatus, type LeadNote, type LeadHistoryEntry, type LeadWiedervorlage, type LeadDocument,
} from "@/lib/mock-leads";
import { getNextTask, completeTasksForLead, leadHasOpenTask, DEFAULT_WIEDERVORLAGE_TIME } from "@/lib/mock-tasks";

/** Kleine Formatierungshelfer für die Anzeige "am DD.MM.YYYY um HH:MM Uhr". */
function formatDateDe(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE");
}
function formatTimeDe(iso: string) {
  return new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}
function formatDateTimeDe(iso: string) {
  return `${formatDateDe(iso)} um ${formatTimeDe(iso)} Uhr`;
}
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const { user } = useMockAuth();
  const navigate = useNavigate();

  // "status" = aktuelle Auswahl im Dropdown, "currentStatus" = tatsächlich gespeicherter Status des Leads.
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead.status);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<LeadNote[]>(lead.notes);
  const [history, setHistory] = useState<LeadHistoryEntry[]>(lead.history);
  const [wiedervorlage, setWiedervorlage] = useState<LeadWiedervorlage | undefined>(lead.wiedervorlage);
  const [documents, setDocuments] = useState<LeadDocument[]>(lead.documents);
  const [hasOpenTask, setHasOpenTask] = useState(() => leadHasOpenTask(lead));

  const [wvOpen, setWvOpen] = useState(false);
  const [wvDate, setWvDate] = useState("");
  const [wvTime, setWvTime] = useState("");
  const [wvComment, setWvComment] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // TODO Supabase: Notiz per Server-Function in `lead_notes` einfügen (insert), Liste per Query laden.
  function handleSaveNote() {
    const text = note.trim();
    if (!text) return;
    const newNote: LeadNote = {
      id: `n${Date.now()}`,
      author: user.name,
      authorRole: user.role,
      date: new Date().toISOString(),
      text,
      isImportant: false,
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    lead.notes = updated;
    setNote("");
  }

  // TODO Supabase: `lead_notes.is_important` per Server-Function aktualisieren (update).
  function toggleImportant(id: string) {
    const updated = notes.map((n) => (n.id === id ? { ...n, isImportant: !n.isImportant } : n));
    setNotes(updated);
    lead.notes = updated;
  }

  // TODO Supabase: `leads.status` per Server-Function aktualisieren – `lead_status_history`
  // wird dort per DB-Trigger befüllt, hier simulieren wir den Verlaufseintrag lokal.
  function handleStatusUpdate() {
    if (status === currentStatus) return;
    const now = new Date().toISOString();
    const entry: LeadHistoryEntry = {
      id: `h${Date.now()}`,
      date: now,
      author: user.name,
      type: "status_change",
      text: `${user.name} hat den Status am ${formatDateTimeDe(now)} von ${statusLabel[currentStatus]} auf ${statusLabel[status]} geändert.`,
    };
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    setCurrentStatus(status);
    lead.status = status;
    lead.history = updatedHistory;
    setHasOpenTask(leadHasOpenTask(lead));
  }

  function openWiedervorlage() {
    const today = new Date().toISOString().slice(0, 10);
    setWvDate(wiedervorlage?.date ? wiedervorlage.date.slice(0, 10) : today);
    setWvTime(wiedervorlage?.date ? wiedervorlage.date.slice(11, 16) : "");
    setWvComment(wiedervorlage?.comment ?? "");
    setWvOpen(true);
  }

  // TODO Supabase: `leads.wiedervorlage_at` + Kommentar per Server-Function aktualisieren.
  function handleSaveWiedervorlage() {
    if (!wvDate) return;
    const isUpdate = !!wiedervorlage;
    const time = wvTime || DEFAULT_WIEDERVORLAGE_TIME; // Anforderung 7: 07:30 Default ohne Uhrzeit
    const iso = `${wvDate}T${time}:00`;
    const now = new Date().toISOString();
    const wv: LeadWiedervorlage = {
      date: iso,
      comment: wvComment.trim() || undefined,
      createdBy: user.name,
      createdAt: now,
    };
    setWiedervorlage(wv);
    lead.wiedervorlage = wv;
    setHasOpenTask(true);

    const entry: LeadHistoryEntry = {
      id: `h${Date.now()}`,
      date: now,
      author: user.name,
      type: "wiedervorlage",
      text: `${user.name} hat eine Wiedervorlage für den ${formatDateDe(iso)} erstellt.${wvComment.trim() ? ` Kommentar: „${wvComment.trim()}“` : ""}`,
    };
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    lead.history = updatedHistory;

    setWvOpen(false);
    toast.success(isUpdate ? "Wiedervorlage erfolgreich aktualisiert" : "Wiedervorlage erfolgreich gespeichert");
  }

  // Anforderung 6: aktuelle Aufgabe(n) dieses Leads erledigen.
  // TODO Supabase: leads.wiedervorlage_at = NULL bzw. tasks.completed_at setzen.
  function handleCompleteTask() {
    const changed = completeTasksForLead(lead);
    if (!changed) return;
    setWiedervorlage(undefined);
    setHasOpenTask(false);

    const now = new Date().toISOString();
    const entry: LeadHistoryEntry = {
      id: `h${Date.now()}`,
      date: now,
      author: user.name,
      type: "system",
      text: `${user.name} hat die offene Aufgabe für diesen Lead als erledigt markiert.`,
    };
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    lead.history = updatedHistory;

    toast.success("Aufgabe als erledigt markiert");
  }

  // Anforderung 5: zur ältesten, höchstpriorisierten offenen Aufgabe springen.
  function handleOpenNextTask() {
    const next = getNextTask();
    if (!next) {
      toast.success("Keine offenen Aufgaben mehr 🎉");
      return;
    }
    if (next.leadId === lead.id) {
      toast.success("Diese Aufgabe ist bereits die nächste offene Aufgabe.");
      return;
    }
    navigate({ to: "/mitarbeiter/leads/$id", params: { id: next.leadId } });
  }

  // Anforderung 3: Dokument-Upload (nur Metadaten + Object-URL für die aktuelle Session).
  // TODO Supabase Storage: Datei in Bucket `lead-documents` hochladen, `storage_path` speichern.
  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newDocs: LeadDocument[] = Array.from(files).map((file) => ({
      id: `d${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: file.name,
      kind: "sonstiges",
      size: formatFileSize(file.size),
      uploadedAt: new Date().toISOString(),
      uploadedBy: user.name,
      objectUrl: URL.createObjectURL(file),
    }));
    const updated = [...newDocs, ...documents];
    setDocuments(updated);
    lead.documents = updated;
    e.target.value = "";
    toast.success(newDocs.length === 1 ? "Dokument hochgeladen" : `${newDocs.length} Dokumente hochgeladen`);
  }

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
              <Badge className={`${statusColor[currentStatus]} border-0 px-4 py-1.5 text-sm font-bold`}>{statusLabel[currentStatus]}</Badge>
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
                    <TabsTrigger value="notes">Notizen ({notes.length})</TabsTrigger>
                    <TabsTrigger value="documents">Dokumente ({documents.length})</TabsTrigger>
                    <TabsTrigger value="emails">E-Mails ({lead.emails.length})</TabsTrigger>
                    <TabsTrigger value="offers">Angebote ({lead.offers.length})</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="timeline" className="p-6">
                  <Timeline lead={lead} status={currentStatus} notes={notes} />
                  {history.length > 0 && (
                    <div className="mt-8">
                      <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Aktivität</h3>
                      <ul className="space-y-3">
                        {history.map((h) => (
                          <li key={h.id} className="rounded-lg border bg-muted/30 p-3 text-sm">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">{h.author}</span>
                              <span>{formatDateTimeDe(h.date)}</span>
                            </div>
                            <p className="mt-1">{h.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 p-6">
                  {notes.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Notizen.</p>}
                  {notes.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "rounded-lg border bg-muted/30 p-4",
                        n.isImportant && "border-rose-400 bg-rose-50/60 dark:border-rose-500/60 dark:bg-rose-950/20",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground">{n.author}</span>
                          {n.authorRole && <Badge variant="outline" className="text-[10px]">{roleBadgeLabel[n.authorRole]}</Badge>}
                          {n.isImportant && <Badge className="border-0 bg-rose-500/15 text-[10px] text-rose-700 dark:text-rose-300">Wichtig</Badge>}
                        </div>
                        <div className="flex flex-none items-center gap-1">
                          <span className="text-xs text-muted-foreground">{formatDateTimeDe(n.date)}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Notiz-Aktionen">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleImportant(n.id)}>
                                {n.isImportant ? "Markierung entfernen" : "Als wichtig markieren"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{n.text}</p>
                    </div>
                  ))}
                  <div className="space-y-2 pt-2">
                    <Textarea placeholder="Neue Notiz hinzufügen…" value={note} onChange={(e) => setNote(e.target.value)} />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleSaveNote} disabled={!note.trim()}>
                        <Save className="mr-2 h-4 w-4" />Speichern
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-3 p-6">
                  {documents.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Dokumente.</p>}
                  {documents.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-md bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.size} · {formatDateDe(d.uploadedAt)}
                            {d.uploadedBy ? ` · hochgeladen von ${d.uploadedBy}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${docColor[d.kind]} border-0 capitalize`}>{d.kind}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!d.objectUrl}
                          onClick={() => d.objectUrl && window.open(d.objectUrl, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    className="hidden"
                    onChange={handleFilesSelected}
                  />
                  <Button variant="outline" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />Dokument hochladen
                  </Button>
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
          <Card className="border-primary/30">
            <CardHeader><CardTitle className="text-base">Aufgabe</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {hasOpenTask ? (
                <>
                  <p className="text-sm text-muted-foreground">Für diesen Lead liegt eine offene Aufgabe vor.</p>
                  <Button variant="outline" className="w-full" size="sm" onClick={handleCompleteTask}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />Aufgabe abgeschlossen
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Keine offene Aufgabe für diesen Lead.</p>
              )}
              <Button className="w-full" size="sm" onClick={handleOpenNextTask}>
                <ArrowRight className="mr-2 h-4 w-4" />Nächste Aufgabe öffnen
              </Button>
            </CardContent>
          </Card>

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
              <Button className="w-full" size="sm" onClick={handleStatusUpdate} disabled={status === currentStatus}>
                Aktualisieren
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Erwartete Ersparnis</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-emerald-600">+{lead.expectedSavings} €</div>
              <p className="mt-1 text-xs text-muted-foreground">pro Jahr · {typeLabel[lead.type]}</p>
            </CardContent>
          </Card>

          {wiedervorlage && (
            <Card>
              <CardHeader><CardTitle className="text-base">Wiedervorlage</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  {formatDateDe(wiedervorlage.date)}, {formatTimeDe(wiedervorlage.date)} Uhr
                </div>
                {wiedervorlage.comment && <p className="text-xs text-muted-foreground">{wiedervorlage.comment}</p>}
              </CardContent>
            </Card>
          )}

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
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={openWiedervorlage}>
                <Clock className="mr-2 h-4 w-4" />{wiedervorlage ? "Wiedervorlage bearbeiten" : "Wiedervorlage setzen"}
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm"><RefreshCw className="mr-2 h-4 w-4" />Lead neu zuweisen</Button>
              <Button variant="outline" className="w-full justify-start text-rose-600 hover:text-rose-700" size="sm"><AlertCircle className="mr-2 h-4 w-4" />Lead ablehnen</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={wvOpen} onOpenChange={setWvOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wiedervorlage setzen</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wv-date">Datum</Label>
                <Input id="wv-date" type="date" value={wvDate} onChange={(e) => setWvDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wv-time">Uhrzeit (optional)</Label>
                <Input id="wv-time" type="time" value={wvTime} onChange={(e) => setWvTime(e.target.value)} />
                <p className="text-xs text-muted-foreground">Ohne Angabe: {DEFAULT_WIEDERVORLAGE_TIME} Uhr</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wv-comment">Kommentar</Label>
              <Textarea
                id="wv-comment"
                placeholder="z. B. Kunde morgen erneut anrufen"
                value={wvComment}
                onChange={(e) => setWvComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWvOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveWiedervorlage} disabled={!wvDate}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}

function Timeline({ lead, status, notes }: { lead: Lead; status: LeadStatus; notes: LeadNote[] }) {
  const firstContactNote = notes[notes.length - 1];
  const steps = [
    { icon: Calendar, label: "Lead eingegangen", date: lead.createdAt, done: true },
    { icon: MessageSquare, label: "Erstkontakt", date: firstContactNote?.date, done: status !== "neu" },
    { icon: FileText, label: "Angebot erstellt", date: lead.offers[0]?.sentAt, done: ["angebot_erstellt","angebot_gesendet","interessiert","vertrag_vorbereitet","vertrag_gesendet","abgeschlossen"].includes(status) },
    { icon: Send, label: "Angebot gesendet", date: lead.offers[0]?.sentAt, done: ["angebot_gesendet","interessiert","vertrag_vorbereitet","vertrag_gesendet","abgeschlossen"].includes(status) },
    { icon: FileSignature, label: "Vertrag gesendet", date: status === "vertrag_gesendet" || status === "abgeschlossen" ? "2026-06-14" : undefined, done: ["vertrag_gesendet","abgeschlossen"].includes(status) },
    { icon: CheckCircle2, label: "Abgeschlossen", date: status === "abgeschlossen" ? "2026-06-15" : undefined, done: status === "abgeschlossen" },
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
