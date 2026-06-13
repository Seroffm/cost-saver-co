import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/kontakt")({
  head: () => ({ meta: [{ title: "Kontakt – EnergieClever" }, { name: "description", content: "So erreichen Sie unser Beratungsteam." }] }),
  component: () => (
    <StaticPage title="Kontakt" lead="Sie erreichen uns persönlich – per Telefon, E-Mail oder direkt über das Formular.">
      <div className="not-prose mt-6 grid gap-4 md:grid-cols-3">
        {[
          { icon: Phone, label: "Telefon", value: "0800 123 4567", href: "tel:08001234567" },
          { icon: Mail, label: "E-Mail", value: "hallo@energieclever.de", href: "mailto:hallo@energieclever.de" },
          { icon: MapPin, label: "Sitz", value: "Berlin, Deutschland" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <c.icon className="h-5 w-5 text-success" />
            <div className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{c.label}</div>
            {c.href ? (
              <a href={c.href} className="mt-1 block font-semibold text-primary hover:underline">{c.value}</a>
            ) : (
              <div className="mt-1 font-semibold text-primary">{c.value}</div>
            )}
          </div>
        ))}
      </div>
      <h2>Beratungszeiten</h2>
      <p>Montag bis Freitag, 8:00 – 20:00 Uhr. Samstag 10:00 – 16:00 Uhr.</p>
    </StaticPage>
  ),
});
