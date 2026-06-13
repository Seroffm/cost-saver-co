import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </span>
            EnergieClever
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Unabhängige Strom- und Gasberatung für Privat und Gewerbe in Deutschland.
          </p>
        </div>
        <FooterCol title="Angebot" links={[
          { to: "/angebot", label: "Tarif prüfen" },
          { to: "/ablauf", label: "Ablauf" },
          { to: "/faq", label: "FAQ" },
        ]} />
        <FooterCol title="Unternehmen" links={[
          { to: "/ueber-uns", label: "Über uns" },
          { to: "/kontakt", label: "Kontakt" },
        ]} />
        <FooterCol title="Rechtliches" links={[
          { to: "/datenschutz", label: "Datenschutz" },
          { to: "/impressum", label: "Impressum" },
          { to: "/widerruf", label: "Widerruf" },
        ]} />
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EnergieClever · Alle Tarife unverbindlich · DSGVO-konform
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-foreground">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
