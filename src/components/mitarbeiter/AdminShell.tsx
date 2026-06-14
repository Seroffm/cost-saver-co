import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Users, Inbox, BarChart3, Settings, LogOut, Bell, Search, Zap, Building2, Tag, UserCog, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navMain = [
  { to: "/mitarbeiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mitarbeiter/leads", label: "Leads", icon: Inbox, badge: 3 },
  { to: "/mitarbeiter/kunden", label: "Kunden", icon: Users },
  { to: "/mitarbeiter/statistiken", label: "Statistiken", icon: BarChart3 },
];

const navAdmin = [
  { to: "/mitarbeiter/anbieter", label: "Anbieter", icon: Building2 },
  { to: "/mitarbeiter/tarife", label: "Tarife", icon: Tag },
  { to: "/mitarbeiter/team", label: "Team", icon: UserCog },
  { to: "/mitarbeiter/vorlagen", label: "E-Mail-Vorlagen", icon: Mail },
  { to: "/mitarbeiter/einstellungen", label: "Einstellungen", icon: Settings },
];

export function AdminShell({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">EnergieClever</div>
            <div className="text-xs text-muted-foreground">Mitarbeiter-CRM</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navMain.map((item) => <NavLink key={item.to} item={item} pathname={pathname} />)}
          <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Verwaltung</div>
          {navAdmin.map((item) => <NavLink key={item.to} item={item} pathname={pathname} />)}
        </nav>
        <div className="border-t p-3">
          <button
            onClick={() => navigate({ to: "/mitarbeiter/login" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Abmelden
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur lg:px-8">
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Leads, Kunden, Verträge suchen…" className="pl-9" />
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <div className="flex items-center gap-2 rounded-full border px-2 py-1">
              <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">SB</AvatarFallback></Avatar>
              <div className="hidden text-xs sm:block">
                <div className="font-medium leading-none">Sarah Becker</div>
                <div className="text-muted-foreground">Admin</div>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function NavLink({ item, pathname }: { item: { to: string; label: string; icon: typeof Inbox; badge?: number }; pathname: string }) {
  const active = pathname === item.to || pathname.startsWith(item.to + "/");
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{item.label}</span>
      {item.badge ? <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">{item.badge}</Badge> : null}
    </Link>
  );
}
