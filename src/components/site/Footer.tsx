import { Link } from "@tanstack/react-router";
import { Zap, Linkedin, Mail, Youtube, Phone, ChevronUp } from "lucide-react";

type Col = { title: string; links: { to: string; label: string }[] };

const columns: Col[] = [
  {
    title: "Strom",
    links: [
      { to: "/angebot", label: "Stromtarife" },
      { to: "/angebot", label: "Tarifrechner" },
      { to: "/angebot", label: "Ökostrom" },
      { to: "/angebot", label: "Gewerbestrom" },
      { to: "/faq", label: "Anbieterwechsel" },
    ],
  },
  {
    title: "Gas",
    links: [
      { to: "/angebot", label: "Gastarife" },
      { to: "/angebot", label: "Gasrechner" },
      { to: "/angebot", label: "Bio-Gas" },
      { to: "/angebot", label: "Gewerbegas" },
      { to: "/faq", label: "Gasanbieter wechseln" },
    ],
  },
  {
    title: "Service",
    links: [
      { to: "/ablauf", label: "So funktioniert's" },
      { to: "/kontakt", label: "Kontakt & Beratung" },
      { to: "/faq", label: "Hilfe & FAQ" },
      { to: "/ueber-uns", label: "Magazin" },
    ],
  },
  {
    title: "Über EnergieClever",
    links: [
      { to: "/ueber-uns", label: "Unternehmen" },
      { to: "/ueber-uns", label: "Karriere" },
      { to: "/ueber-uns", label: "Presse" },
      { to: "/ueber-uns", label: "Partnerprogramm" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Top row: logo + back-to-top */}
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="flex items-center gap-3 font-display text-xl font-extrabold text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-success text-success-foreground">
              <Zap className="h-4 w-4" />
            </span>
            EnergieClever
          </div>
          <button
            type="button"
            onClick={() =>
              typeof window !== "undefined" && window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:border-success hover:text-success"
          >
            <ChevronUp className="h-4 w-4" /> Zum Seitenanfang
          </button>
        </div>

        {/* Link columns */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <div className="font-display text-sm font-bold text-primary">{c.title}</div>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition hover:text-success">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact + social */}
        <div className="mt-14 grid gap-8 border-t border-border pt-10 md:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Persönliche Beratung
            </div>
            <a
              href="tel:08001234567"
              className="mt-2 inline-flex items-center gap-3 font-display text-2xl font-extrabold text-primary transition hover:text-success md:text-3xl"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-success/10 text-success">
                <Phone className="h-4 w-4" />
              </span>
              0800 123 4567
            </a>
            <div className="mt-2 text-sm text-muted-foreground">
              Mo–Fr 8–20 Uhr · kostenlos aus dem dt. Festnetz
            </div>
          </div>

          <div className="md:text-right">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Folgen Sie uns
            </div>
            <div className="mt-3 flex gap-2 md:justify-end">
              {[
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Mail, href: "mailto:hallo@energieclever.de", label: "E-Mail" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-success hover:text-success"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground">
          <div>© {year} EnergieClever · Alle Tarife unverbindlich · DSGVO-konform</div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link to="/impressum" className="hover:text-success">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-success">
              Datenschutz
            </Link>
            <Link to="/widerruf" className="hover:text-success">
              Widerruf
            </Link>
            <Link to="/faq" className="hover:text-success">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
