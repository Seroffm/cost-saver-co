import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Star,
  Play,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MultiStepForm } from "@/components/lead/MultiStepForm";
import { energyTypes } from "@/lib/lead-schema";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/logo.svg";

const search = z
  .object({
    start: z.enum(energyTypes).optional(),
    plz: z.string().optional(),
    kwh: z.coerce.number().int().positive().optional(),
  })
  .optional();

export const Route = createFileRoute("/angebot")({
  validateSearch: (s) => search.parse(s) ?? {},
  head: () => ({
    meta: [
      { title: "Kostenlose Tarifprüfung | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "In 2 Minuten zum persönlichen Strom- oder Gasangebot. Unverbindlich und kostenlos.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AngebotPage,
});

const steps = [
  {
    label: "Verbrauch angeben",
    desc: "PLZ und Jahresverbrauch eintragen. Dauert unter 2 Minuten.",
  },
  {
    label: "Angebot erhalten",
    desc: "Wir vergleichen alle 100+ Anbieter und melden uns persönlich.",
  },
  {
    label: "Wir erledigen alles",
    desc: "Kündigung, Ummeldung, Übergabe - kein Papierkram für Sie.",
  },
];

const testimonials = [
  {
    quote:
      "Ich hab den Vergleich nur aus Neugier gemacht. Nach 4 Minuten hatte ich ein konkretes Angebot und spare jetzt 28 Euro monatlich - ohne dass ich auch nur einen Brief schreiben musste.",
    name: "Markus Heitmann",
    location: "München",
    saved: "336 €/Jahr",
  },
  {
    quote:
      "Als Familie mit drei Kindern zählt jeder Euro. Unser neuer Gastarif kostet fast 200 Euro weniger pro Jahr. Der Ablauf war unkomplizierter als ich dachte.",
    name: "Familie Brenner",
    location: "Dortmund",
    saved: "198 €/Jahr",
  },
  {
    quote:
      "Ich war skeptisch wegen der Datenweitergabe. Aber alles war transparent, DSGVO-konform, und ein Berater hat mich persönlich angerufen. So stell ich mir guten Service vor.",
    name: "Claudia Mertens",
    location: "Berlin",
    saved: "420 €/Jahr",
  },
];

const faqs = [
  {
    q: "Ist der Vergleich wirklich komplett kostenlos?",
    a: "Ja, vollständig. Wir erhalten eine Provision vom neuen Anbieter - nicht von Ihnen. Für Sie entstehen zu keinem Zeitpunkt Kosten.",
  },
  {
    q: "Muss ich selbst beim alten Anbieter kündigen?",
    a: "Nein. Wir übernehmen die gesamte Abwicklung inklusive Kündigung beim bisherigen Anbieter und die Anmeldung beim neuen.",
  },
  {
    q: "Gibt es eine Versorgungsunterbrechung beim Wechsel?",
    a: "Ausgeschlossen. Das Energierecht garantiert einen nahtlosen Übergang. Ihre Versorgung läuft ohne eine einzige Minute Unterbrechung weiter.",
  },
  {
    q: "Was passiert mit meinen persönlichen Daten?",
    a: "Ihre Daten werden ausschließlich für den Tarifvergleich genutzt und DSGVO-konform in Deutschland verarbeitet. Keine Weitergabe ohne Ihre ausdrückliche Einwilligung.",
  },
  {
    q: "Bin ich verpflichtet, ein Angebot anzunehmen?",
    a: "Nein. Das Angebot ist völlig unverbindlich. Sie entscheiden selbst, ob und wann Sie wechseln.",
  },
];

function AngebotPage() {
  const { start, plz, kwh } = Route.useSearch();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/">
            <img src={logoUrl} alt="PRIME ENERGIE" className="h-10 w-auto" />
          </Link>

          <div className="hidden items-center gap-5 text-xs text-muted-foreground sm:flex">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-success" />
              SSL-verschlüsselt
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              DSGVO-konform
            </span>
            <span className="inline-flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-success text-success" />
              ))}
              <strong className="text-primary">4,8</strong>
              <span className="text-muted-foreground">(2.400+ Bewertungen)</span>
            </span>
          </div>

          <a
            href="tel:08001234567"
            className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success transition hover:bg-success/20"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">0800 123 4567</span>
          </a>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:grid md:grid-cols-[1fr_minmax(0,520px)] md:items-start md:gap-12 md:py-16">
        {/* Left: value prop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 md:mb-0"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3.5 py-1.5 text-xs font-semibold text-success">
            <Users className="h-3.5 w-3.5" />
            Persönliche Empfehlung aus meiner Community
          </div>

          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-primary md:text-[2.75rem]">
            Strom & Gas: Hören Sie auf, zu viel zu zahlen.
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Haushalte in Deutschland überzahlen im Schnitt{" "}
            <strong className="text-primary">380 € pro Jahr</strong>. Prüfen
            Sie jetzt kostenlos und unverbindlich, was Ihr Tarif wirklich
            kosten sollte.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "Persönliche Beratung durch zertifizierte Experten",
              "Alle 100+ geprüften Anbieter auf einen Blick",
              "Kein Aufwand: wir kündigen und melden an",
              "Keine Versorgungslücke - gesetzlich garantiert",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" />
                {b}
              </li>
            ))}
          </ul>

          {/* Social proof strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-success text-success" />
                ))}
              </span>
              <strong className="text-primary">4,8 / 5</strong>
              <span className="text-muted-foreground">aus 2.400+ Bewertungen</span>
            </span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground">
              <strong className="text-primary">50.000+</strong> erfolgreiche Wechsel
            </span>
          </div>

          {/* DSGVO note */}
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-success" />
            Ihre Daten sind sicher. Wir verarbeiten ausschließlich DSGVO-konform
            in Deutschland und geben nichts ohne Ihre Einwilligung weiter.
          </div>
        </motion.div>

        {/* Right: form (sticky on desktop) */}
        <motion.div
          id="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="md:sticky md:top-20 md:self-start"
        >
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card md:p-8">
            <MultiStepForm initialEnergy={start} initialPlz={plz} initialKwh={kwh} />
          </div>
        </motion.div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <div className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-border/50 md:grid-cols-4">
          {[
            { v: "100+", l: "geprüfte Anbieter" },
            { v: "50.000+", l: "erfolgreiche Wechsel" },
            { v: "380 €", l: "Ø Ersparnis pro Jahr" },
            { v: "0 €", l: "Kosten für Sie" },
          ].map((s) => (
            <div
              key={s.l}
              className="flex flex-col items-center bg-surface px-4 py-7 text-center"
            >
              <span className="font-display text-2xl font-extrabold text-primary">{s.v}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── VIDEO (influencer) ─── */}
      <section className="bg-primary">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_1.15fr] md:items-center md:py-20">
          {/* Left: context */}
          <div>
            <h2 className="font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">
              Warum ich PRIME ENERGIE meiner Community empfehle.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-primary-foreground/70">
              Ich habe selbst gewechselt und in weniger als einer Woche über
              300 Euro Jahresersparnis gesichert. Kein Stress, kein Risiko,
              keine versteckten Kosten. Genau das wollte ich weitergeben.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#form"
                className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-bold text-success-foreground transition hover:bg-success/90 active:scale-[0.98]"
              >
                Jetzt Tarif prüfen <ArrowRight className="h-4 w-4" />
              </a>
              <span className="text-xs text-primary-foreground/40">Kostenlos & unverbindlich</span>
            </div>
          </div>

          {/* Right: video placeholder */}
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

            <button
              type="button"
              className="group absolute inset-0 flex flex-col items-center justify-center gap-4"
              aria-label="Video abspielen"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-lg transition-transform duration-200 ease-out group-hover:scale-110">
                <Play className="ml-1 h-7 w-7 fill-primary text-primary" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-foreground/40">
                Video abspielen
              </span>
            </button>

            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4">
              <p className="text-sm font-semibold text-white">
                "Warum ich zu PRIME ENERGIE gewechselt habe"
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                [Influencer Name] - Video hier verknüpfen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
            So einfach funktioniert der Wechsel.
          </h2>

          <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col bg-background py-8 md:py-12",
                  i === 0 ? "md:pr-8" : i === 2 ? "md:pl-8" : "md:px-8",
                )}
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-success">
                  {s.label}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
            Was unsere Kunden sagen.
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="border-t-2 border-success/25 pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-success text-success" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground/80">
                  "{t.quote}"
                </blockquote>
                <footer className="mt-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{t.name}</span>,{" "}
                  {t.location}
                  {t.saved && (
                    <span className="ml-3 font-semibold text-success">{t.saved} gespart</span>
                  )}
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="font-display text-2xl font-extrabold text-primary md:text-3xl">
            Häufige Fragen.
          </h2>

          <div className="mt-8 divide-y divide-border">
            {faqs.map((f, i) => (
              <div key={i} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 text-left text-sm font-semibold text-primary"
                >
                  {f.q}
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 flex-none text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 flex-none text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="font-display text-3xl font-extrabold text-primary-foreground md:text-4xl">
            Bereit, zu wechseln?
          </h2>
          <p className="mt-3 text-primary-foreground/70">
            Es dauert 2 Minuten. Wir erledigen den Rest - kostenlos und
            unverbindlich.
          </p>
          <a
            href="#form"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-success px-8 py-4 text-base font-bold text-success-foreground transition hover:bg-success/90 active:scale-[0.98]"
          >
            Jetzt Tarif prüfen <ArrowRight className="h-5 w-5" />
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-primary-foreground/40">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> SSL-verschlüsselt
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> DSGVO-konform
            </span>
            <span>Kostenlos & unverbindlich</span>
          </div>
        </div>
      </section>
    </div>
  );
}
