import { createFileRoute } from "@tanstack/react-router";
import { Plus, Mail, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { employees, roleLabel } from "@/lib/mock-leads";

export const Route = createFileRoute("/mitarbeiter/team")({
  head: () => ({
    meta: [{ title: "Team – Mitarbeiter" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: TeamPage,
});

const roleColor = {
  admin: "bg-violet-500/15 text-violet-700",
  manager: "bg-blue-500/15 text-blue-700",
  mitarbeiter: "bg-slate-500/15 text-slate-700",
};

function TeamPage() {
  return (
    <AdminShell
      title="Team"
      subtitle={`${employees.filter((e) => e.active).length} aktive Mitarbeiter · ${employees.length} insgesamt`}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Mitarbeiter einladen
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((e) => (
          <Card key={e.id} className={!e.active ? "opacity-60" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {e.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{e.name}</div>
                    <Badge className={`${roleColor[e.role]} mt-1 border-0`}>
                      {roleLabel[e.role]}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {e.email}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Offen" value={e.open} />
                <Stat label="Abschlüsse" value={e.closed} />
                <Stat label="Conv." value={`${e.conversion}%`} />
              </div>
              {!e.active && <div className="mt-3 text-xs text-muted-foreground">Inaktiv</div>}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-muted/40 py-2">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
