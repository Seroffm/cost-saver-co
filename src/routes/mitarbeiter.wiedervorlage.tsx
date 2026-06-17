import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Phone, Mail, ChevronRight, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { leads, statusColor, statusLabel } from "@/lib/mock-leads";
import { useMockAuth } from "@/lib/mock-auth";

export const Route = createFileRoute("/mitarbeiter/wiedervorlage")({
  head: () => ({
    meta: [
      { title: "Wiedervorlage – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: WiedervorlagePage,
});

// Wiedervorlage-Termine aus den Leads ableiten – pro Render neu berechnet, damit ein frisch
// in der Lead-Detailseite gesetzter Termin sofort hier erscheint (inkl. "Heute"-Gruppe).
function buildFollowups() {
  // Primärquelle: Leads mit explizitem Wiedervorlage-Termin (lead.wiedervorlage).
  const explicit = leads
    .filter((l) => l.wiedervorlage)
    .map((l) => ({
      leadId: l.id,
      when: l.wiedervorlage!.date,
      reason: l.wiedervorlage!.comment || "Wiedervorlage",
      name: l.name,
      phone: l.phone,
      email: l.email,
      assignee: l.assignee,
      status: l.status,
    }));

  // Fallback für ältere Demo-Leads ohne explizite Wiedervorlage, anhand des Status synthetisiert.
  // TODO Supabase: entfällt, sobald jeder Lead `wiedervorlage_at` direkt aus der DB hat.
  const fallback = leads
    .filter(
      (l) =>
        !l.wiedervorlage &&
        ["wiedervorlage", "rueckfrage", "interessiert", "angebot_gesendet"].includes(l.status),
    )
    .map((l, i) => ({
      leadId: l.id,
      when: new Date(Date.now() + (i - 1) * 86400000 + 3600000 * 9).toISOString(),
      reason:
        l.status === "wiedervorlage"
          ? "Wiedervorlage"
          : l.status === "rueckfrage"
            ? "Rückfrage offen"
            : "Nachfassen Angebot",
      name: l.name,
      phone: l.phone,
      email: l.email,
      assignee: l.assignee,
      status: l.status,
    }));

  return [...explicit, ...fallback].sort((a, b) => a.when.localeCompare(b.when));
}

function groupKey(d: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  if (target < today) return "Überfällig";
  if (target.getTime() === today.getTime()) return "Heute";
  if (target.getTime() === tomorrow.getTime()) return "Morgen";
  return target.toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long" });
}

function WiedervorlagePage() {
  const { user: authUser, hasRole } = useMockAuth();
  const user = authUser ?? { name: "Mitarbeiter", role: "mitarbeiter" as const };
  const followups = buildFollowups();
  // Mitarbeiter see only their own follow-ups; Admin/Manager see all
  const visible = hasRole("admin", "manager")
    ? followups
    : followups.filter((f) => f.assignee === user.name);

  const grouped = visible.reduce<Record<string, typeof followups>>((acc, f) => {
    const k = groupKey(new Date(f.when));
    (acc[k] ||= []).push(f);
    return acc;
  }, {});

  const overdue = visible.filter(
    (f) => new Date(f.when) < new Date(new Date().setHours(0, 0, 0, 0)),
  ).length;

  return (
    <AdminShell
      title="Wiedervorlage"
      subtitle={
        hasRole("admin", "manager")
          ? "Alle anstehenden Rückrufe und Nachfass-Termine"
          : `Deine Termine, ${user.name.split(" ")[0]}`
      }
      actions={
        overdue > 0 ? (
          <Badge variant="destructive">
            <AlertCircle className="mr-1 h-3 w-3" />
            {overdue} überfällig
          </Badge>
        ) : undefined
      }
    >
      <div className="grid gap-6">
        {Object.entries(grouped).map(([day, items]) => (
          <div key={day}>
            <div className="mb-3 flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {day}
              </h2>
              <span className="text-xs text-muted-foreground">
                · {items.length} Termin{items.length === 1 ? "" : "e"}
              </span>
            </div>
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {items.map((f) => {
                    const date = new Date(f.when);
                    const timeStr = date.toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <li
                        key={f.leadId}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40"
                      >
                        <div className="grid h-12 w-12 flex-none place-items-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                          {timeStr}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">{f.name}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {f.reason}
                            </Badge>
                            <Badge className={`${statusColor[f.status]} border-0 text-[10px]`}>
                              {statusLabel[f.status]}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {f.phone && (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {f.phone}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {f.email}
                            </span>
                            <span>Berater: {f.assignee}</span>
                          </div>
                        </div>
                        <div className="flex flex-none gap-1">
                          {f.phone && (
                            <Button asChild size="sm" variant="outline">
                              <a href={`tel:${f.phone.replace(/\s/g, "")}`}>
                                <Phone className="mr-1 h-3.5 w-3.5" />
                                Anrufen
                              </a>
                            </Button>
                          )}
                          <Button asChild size="sm">
                            <Link to="/mitarbeiter/leads/$id" params={{ id: f.leadId }}>
                              Lead öffnen <ChevronRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
            <CalendarClock className="mx-auto h-10 w-10 text-muted-foreground/50" />
            <div className="mt-3 font-medium">Keine offenen Wiedervorlagen</div>
            <p className="mt-1 text-sm">Alles erledigt – starke Leistung.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
