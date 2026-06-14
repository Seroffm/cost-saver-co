import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";

export const Route = createFileRoute("/mitarbeiter/einstellungen")({
  head: () => ({ meta: [{ title: "Einstellungen – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AdminShell title="Einstellungen" subtitle="Profil, Benachrichtigungen und Team">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Profil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Vorname</Label><Input defaultValue="Sarah" /></div>
              <div className="space-y-1.5"><Label>Nachname</Label><Input defaultValue="Becker" /></div>
            </div>
            <div className="space-y-1.5"><Label>E-Mail</Label><Input defaultValue="sarah.becker@energieclever.de" /></div>
            <div className="space-y-1.5"><Label>Telefon</Label><Input defaultValue="+49 221 1234567" /></div>
            <Button>Änderungen speichern</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Benachrichtigungen</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Neuer Lead zugewiesen", desc: "E-Mail bei jeder neuen Zuweisung" },
              { label: "Lead ohne Reaktion > 24h", desc: "Erinnerung an offene Leads" },
              { label: "Vertrag unterschrieben", desc: "Sofort-Benachrichtigung" },
              { label: "Wöchentlicher Report", desc: "Montags 08:00 Uhr" },
            ].map((n, i) => (
              <div key={n.label} className="flex items-start justify-between gap-4 rounded-lg border p-3">
                <div>
                  <div className="font-medium">{n.label}</div>
                  <div className="text-xs text-muted-foreground">{n.desc}</div>
                </div>
                <Switch defaultChecked={i !== 3} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Team-Mitglieder</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                <tr><th className="py-2 font-medium">Name</th><th className="py-2 font-medium">Rolle</th><th className="py-2 font-medium">E-Mail</th><th className="py-2 font-medium">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { name: "Sarah Becker", role: "Admin", email: "sarah.becker@energieclever.de", status: "Aktiv" },
                  { name: "Daniel Kraus", role: "Senior Berater", email: "daniel.kraus@energieclever.de", status: "Aktiv" },
                  { name: "Mira Aydin", role: "Berater", email: "mira.aydin@energieclever.de", status: "Aktiv" },
                  { name: "Jonas Vogt", role: "Berater", email: "jonas.vogt@energieclever.de", status: "Eingeladen" },
                ].map((u) => (
                  <tr key={u.email}>
                    <td className="py-3 font-medium">{u.name}</td>
                    <td className="py-3 text-muted-foreground">{u.role}</td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3"><span className={`rounded px-2 py-0.5 text-xs ${u.status === "Aktiv" ? "bg-emerald-500/15 text-emerald-700" : "bg-amber-500/15 text-amber-700"}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4"><Button variant="outline" size="sm">Mitarbeiter einladen</Button></div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
