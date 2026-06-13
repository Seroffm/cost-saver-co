import { Link } from "@tanstack/react-router";
import { Zap, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/ablauf", label: "So funktioniert's" },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/faq", label: "FAQ" },
  { to: "/kontakt", label: "Kontakt" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-success text-success-foreground">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg tracking-tight">EnergieClever</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="tel:08001234567" className="hidden items-center gap-1.5 text-sm font-medium text-primary md:inline-flex">
            <Phone className="h-4 w-4 text-success" />
            0800 123 4567
          </a>
          <Button asChild className="bg-success text-success-foreground shadow-soft hover:bg-success/90">
            <Link to="/angebot">Jetzt vergleichen</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
