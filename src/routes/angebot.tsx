import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Phone, ShieldCheck, CheckCircle2, Lock } from "lucide-react";
import { z } from "zod";
import { MultiStepForm } from "@/components/lead/MultiStepForm";
import { energyTypes } from "@/lib/lead-schema";

const search = z.object({
  start: z.enum(energyTypes).optional(),
}).optional();

export const Route = createFileRoute("/angebot")({
  validateSearch: (s) => search.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "Kostenlose Tarifprüfung – EnergieClever" },
      { name: "description", content: "In 2 Minuten zum persönlichen Strom- oder Gasangebot. Unverbindlich und kostenlos." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AngebotPage,
});

function AngebotPage() {
  const { start } = Route.useSearch();
  return (
    <div className="min-h-screen bg-surface">
      {/* Reduzierte Top-Bar */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </span>
            EnergieClever
          </Link>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Lock className="h-3.5 w-3.5 text-success" />
            Verschlüsselte Übertragung
          </div>
          <a href="tel:08001234567" className="flex items-center gap-2 text-sm font-medium text-primary">
            <Phone className="h-4 w-4 text-success" />
            <span className="hidden sm:inline">0800 123 4567</span>
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_minmax(0,560px)] md:py-16">
        {/* Hero links */}
        <div className="order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            100% kostenlos & unverbindlich
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-primary md:text-5xl">
            Ihr persönliches Strom- & Gasangebot in 2 Minuten.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Wir vergleichen für Sie. Sie entscheiden. Kein Account, keine Tarif-Roulette, keine Versorgungslücke.
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
            <MultiStepForm initialEnergy={start} />
          </div>
        </div>
      </div>
    </div>
  );
}
