import { Link } from "@tanstack/react-router";
import { Zap, Phone, UserPlus, Smartphone, User, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/angebot", label: "Strom", hasDropdown: true },
  { to: "/angebot", label: "Gas", hasDropdown: true },
  { to: "/angebot", label: "Strom + Gas", hasDropdown: true, highlight: true },
  { to: "/angebot", label: "Solar", hasDropdown: true },
  { to: "/faq", label: "Wissen", hasDropdown: false },
  { to: "/kontakt", label: "Service", hasDropdown: true },
  { to: "/ueber-uns", label: "Über uns", hasDropdown: true },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top utility row */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-primary">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-success text-success-foreground shadow-soft">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight">EnergieClever</span>
          </Link>

          {/* Spacer */}
          <div />

          {/* Right utilities */}
          <div className="flex items-center gap-1 md:gap-5">
            <a
              href="tel:08001234567"
              className="hidden items-center gap-2 text-sm font-semibold text-primary transition hover:text-success md:inline-flex"
            >
              <Phone className="h-4 w-4 text-success" />
              <span>0800 123 4567</span>
            </a>
            <Link
              to="/kontakt"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <UserPlus className="h-4 w-4 text-success" />
              <span>Freunde werben</span>
            </Link>
            <Link
              to="/angebot"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <Smartphone className="h-4 w-4 text-success" />
              <span>App</span>
            </Link>
            <Link
              to="/kontakt"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <User className="h-4 w-4 text-success" />
              <span>Login</span>
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Main nav row */}
        <nav className="hidden h-14 items-center justify-end gap-8 md:flex">
          {mainNav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className={cn(
                "group inline-flex items-center gap-1 text-sm transition",
                n.highlight ? "font-bold text-primary" : "font-medium text-primary hover:text-success",
              )}
              activeProps={{ className: "font-bold text-primary" }}
            >
              {n.highlight && <span className="mr-1 h-2 w-2 rounded-full bg-success" aria-hidden />}
              <span>{n.label}</span>
              {n.hasDropdown && (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-success" />
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {mainNav.map((n) => (
              <Link
                key={n.label}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between border-b border-border py-3 text-sm font-medium text-primary"
              >
                <span className="flex items-center gap-2">
                  {n.highlight && <span className="h-2 w-2 rounded-full bg-success" />}
                  {n.label}
                </span>
                {n.hasDropdown && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 py-4">
              <a href="tel:08001234567" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-primary">
                <Phone className="h-4 w-4 text-success" /> Anrufen
              </a>
              <Link to="/angebot" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-3 py-2 text-sm font-semibold text-success-foreground">
                Jetzt vergleichen
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
