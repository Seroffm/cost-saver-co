import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Phone, ShieldCheck, CheckCircle2, Lock, Star } from "lucide-react";
import { z } from "zod";
import { MultiStepForm } from "@/components/lead/MultiStepForm";
import { energyTypes } from "@/lib/lead-schema";

const search = z.object({
  start: z.enum(energyTypes).optional(),
  plz: z.string().optional(),
  kwh: z.coerce.number().int().positive().optional(),
}).optional();

export const Route = createFileRoute("/angebot")({
  validateSearch: (s) => search.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "Kostenlose Tarifprüfung | EnergieClever" },
      { name: "description", content: "In 2 Minuten zum persönlichen Strom- oder Gasangebot. Unverbindlich und kostenlos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AngebotPage,
});

function AngebotPage() {
  const { start, plz, kwh } = Route.useSearch();
  return (
    <div className="min-h-screen bg-surface">
      {/* Reduzierte Top-Bar */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-success text-success-foreground">
              <Zap className="h-4 w-4" />
            </span>
            <span className="font-display text-lg">EnergieClever</span>
          </Link>
          <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" /> SSL-verschlüsselt
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="flex gap-0.5 text-success">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
              </span>
              <strong className="text-primary">4,8/5</strong>
            </span>
          </div>
          <a href="tel:08001234567" className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Phone className="h-4 w-4 text-success" />
            <span className="hidden sm:inline">0800 123 4567</span>
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_minmax(0,560px)] md:py-16">
        {/* Hero links */}
        <div className="order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            Kostenlos & unverbindlich
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl">
            Ihr persönliches Strom- & Gasangebot in 2 Minuten.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Wir vergleichen für Sie. Sie entscheiden. Kein Account, kein Tariflotterie, keine Versorgungslücke.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {[
              "Persönliche Beratung durch zertifizierte Experten",
              "Alle geprüften Anbieter auf einen Blick",
              "Keine versteckten Kosten, keine Provisionen für Sie",
              "Komplette Abwicklung inklusive Kündigung",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2 text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">
            <ShieldCheck className="h-5 w-5 flex-none text-success" />
            Ihre Daten sind sicher. Wir verarbeiten ausschließlich DSGVO-konform in Deutschland und geben nichts ohne Ihre Einwilligung weiter.
          </div>
        </div>

        {/* Formular rechts */}
        <div className="order-1 md:order-2">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card md:p-8">
            <MultiStepForm initialEnergy={start} initialPlz={plz} initialKwh={kwh} />
          </div>
        </div>
      </div>
    </div>
  );
}
