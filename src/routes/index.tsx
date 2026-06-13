import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Zap, Flame, Layers, Briefcase,
  Home, Building2, TrendingDown, AlertTriangle, FileSearch,
  Star, ShieldCheck, BadgeCheck, Award, Phone, MapPin,
  PhoneCall, FileSignature, PlugZap, Users, Sparkles, ChevronRight,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";
import solutionAutostrom from "@/assets/solution-autostrom.jpg";
import solutionWaermestrom from "@/assets/solution-waermestrom.jpg";
import solutionSolar from "@/assets/solution-solar.jpg";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EnergieClever – Strom & Gas vergleichen, bis zu 850 € sparen" },
      { name: "description", content: "Kostenloser Strom- und Gasvergleich mit persönlicher Beratung. Geprüfte Anbieter, einfacher Wechsel, keine Versorgungslücke." },
      { property: "og:title", content: "EnergieClever – Strom & Gas vergleichen, bis zu 850 € sparen" },
      { property: "og:description", content: "Kostenloser Strom- und Gasvergleich mit persönlicher Beratung. Geprüfte Anbieter, einfacher Wechsel, keine Versorgungslücke." },
    ],
  }),
  component: HomePage,
});

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

type Energy = "strom" | "gas" | "beides";

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <BenefitsSection />
      <AudienceSection />
      <StatsBand />
      <PriceBreakdown />
      <Testimonials />
      <MoreSolutions />
      <RatgeberSection />
      <FaqSection />
      <ContactSection />
      <FinalCta />
    </SiteLayout>
  );
}

/* ---------------------------------- HERO ---------------------------------- */

function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 38%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.15) 100%), linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,0.95) 100%), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-success/20 blur-3xl" aria-hidden />



      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 md:pt-20 md:pb-16">

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={fadeUp.transition}>
            <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <BadgeCheck className="h-3.5 w-3.5" /> TÜV-geprüfte Anbieter · 100 % kostenlos
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-primary md:text-6xl">
              Strom & Gas in 2 Minuten <span className="text-success">vergleichen.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Bis zu <strong className="text-primary">850 € pro Jahr</strong> sparen — mit persönlicher
              Beratung statt Tarif-Roulette. Unabhängig, transparent, ohne versteckte Kosten.
            </p>

            <ul className="mt-6 grid max-w-md gap-2.5 text-sm">
              {[
                "Persönlicher Berater statt anonymem Portal",
                "Komplette Wechselabwicklung inkl. Kündigung",
                "Keine Versorgungslücke — garantiert",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2 text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-success" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["S", "M", "L", "K"].map((c, i) => (
                  <div key={i} className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary text-xs font-semibold text-primary-foreground">{c}</div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 text-success">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <div className="text-xs"><strong className="text-primary">4,8 / 5</strong> · 12.400 zufriedene Kunden</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Calculator (Check24-Style) */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <QuickCalculator />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function QuickCalculator() {
  const navigate = useNavigate();
  const [energy, setEnergy] = useState<Energy>("strom");
  const [plz, setPlz] = useState("");
  const [kwh, setKwh] = useState<number>(2500);

  const tabs: { k: Energy; label: string; icon: typeof Zap }[] = [
    { k: "strom", label: "Strom", icon: Zap },
    { k: "gas", label: "Gas", icon: Flame },
    { k: "beides", label: "Strom & Gas", icon: Layers },
  ];

  const kwhPresets = energy === "gas"
    ? [5000, 12000, 18000, 25000, 35000]
    : [1500, 2500, 3500, 4500, 5500];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    navigate({
      to: "/angebot",
      search: { start: energy, plz: plz || undefined, kwh: kwh || undefined } as never,
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-1.5 shadow-hero">
      <div className="rounded-xl bg-card p-5 md:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-lg font-bold text-primary">Tarifrechner</div>
            <div className="text-xs text-muted-foreground">Vergleich in unter 2 Minuten</div>
          </div>
          <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            bis 850 € sparen
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-lg bg-surface p-1">
          {tabs.map((t) => {
            const active = energy === t.k;
            return (
              <button
                key={t.k}
                type="button"
                onClick={() => setEnergy(t.k)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition",
                  active ? "bg-background text-primary shadow-soft" : "text-muted-foreground hover:text-primary",
                )}
              >
                <t.icon className={cn("h-4 w-4", active ? "text-success" : "")} />
                {t.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Postleitzahl
            </label>
            <div className="relative mt-1.5">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                inputMode="numeric"
                maxLength={5}
                value={plz}
                onChange={(e) => setPlz(e.target.value.replace(/\D/g, ""))}
                placeholder="z. B. 10115"
                className="h-12 pl-9 text-base"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jahresverbrauch · {kwh.toLocaleString("de-DE")} kWh
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {kwhPresets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setKwh(p)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm transition",
                    kwh === p
                      ? "border-success bg-success/10 text-success"
                      : "border-border text-muted-foreground hover:border-success/50 hover:text-primary",
                  )}
                >
                  {p.toLocaleString("de-DE")} kWh
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full bg-success text-base font-semibold text-success-foreground shadow-soft hover:bg-success/90"
          >
            Tarife vergleichen <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-success" /> SSL-verschlüsselt</span>
          <span className="inline-flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5 text-success" /> DSGVO-konform</span>
          <span className="inline-flex items-center gap-1"><Award className="h-3.5 w-3.5 text-success" /> Geprüfte Anbieter</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- TRUST STRIP ------------------------------ */

function TrustStrip() {
  const items = [
    { icon: BadgeCheck, label: "100 % kostenlos" },
    { icon: ShieldCheck, label: "TÜV-zertifizierter Vergleich" },
    { icon: Award, label: "Über 1.200 geprüfte Tarife" },
    { icon: CheckCircle2, label: "Keine Versorgungsunterbrechung" },
    { icon: Star, label: "4,8 / 5 (12.400 Bewertungen)" },
  ];
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm text-muted-foreground">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <i.icon className="h-4 w-4 text-success" />
            <span className="font-medium">{i.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ HOW IT WORKS ------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01", icon: FileSearch, t: "Daten eingeben", k: "~ 90 Sek.",
      d: "PLZ, Jahresverbrauch und Wunsch — fertig. Keine Registrierung, keine Zwangsfelder.",
      bullets: ["Online oder telefonisch", "Auch ohne alte Rechnung", "Verschlüsselte Übertragung"],
    },
    {
      n: "02", icon: PhoneCall, t: "Persönliches Angebot", k: "≤ 24 Std.",
      d: "Ein echter Berater prüft 1.200+ Tarife manuell und ruft mit dem besten Vorschlag zurück.",
      bullets: ["Vergleich inkl. Kleingedrucktem", "Bonus-Fallen ausgeschlossen", "Festpreisgarantie möglich"],
    },
    {
      n: "03", icon: FileSignature, t: "Wechseln & sparen", k: "Ø 380 €/Jahr",
      d: "Wir übernehmen Kündigung beim Altanbieter und Anmeldung beim Neuen — Sie machen nichts.",
      bullets: ["Lückenlose Versorgung", "Schriftliche Bestätigung", "Erinnerung vor Vertragsende"],
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          <Sparkles className="h-3.5 w-3.5" /> So einfach geht's
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
          Drei Schritte. <span className="text-success">Null</span> Papierkram.
        </h2>
        <p className="mt-3 text-muted-foreground">
          Links siehst du, was wir kombinieren — rechts, wie es im Detail abläuft.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* LEFT — Icon combo card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col justify-center rounded-3xl bg-success-soft p-6 sm:p-10 md:p-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            {steps.map((s, i) => {
              const Ic = s.icon;
              return (
                <Fragment key={s.n}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="flex w-[28%] min-w-[88px] max-w-[140px] flex-col items-center text-center"
                  >
                    <div className="grid aspect-square w-full place-items-center rounded-2xl bg-card shadow-soft ring-1 ring-border/40">
                      <Ic className="h-8 w-8 text-success sm:h-10 sm:w-10 md:h-12 md:w-12" />
                    </div>
                    <div className="mt-3 text-xs font-semibold text-primary sm:text-sm">
                      {s.t}
                    </div>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="flex shrink-0 items-center justify-center text-muted-foreground"
                    >
                      <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
                    </span>
                  )}
                </Fragment>
              );
            })}
          </div>
          <p className="mx-auto mt-8 max-w-sm text-center text-sm text-muted-foreground">
            Dein Wunsch + unser Marktcheck + persönliche Betreuung — alles in einem Paket.
          </p>
        </motion.div>

        {/* RIGHT — Accordion card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8"
        >
          <h3 className="font-display text-xl font-bold text-primary sm:text-2xl">
            So läuft dein Wechsel:
          </h3>

          <Accordion type="single" collapsible defaultValue="step-0" className="mt-4 flex-1">
            {steps.map((s, i) => {
              const Ic = s.icon;
              return (
                <AccordionItem
                  key={s.n}
                  value={`step-${i}`}
                  className="border-b border-border last:border-b-0"
                >
                  <AccordionTrigger className="py-4 text-left hover:no-underline">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-success/10 font-display text-sm font-bold text-success">
                        {s.n}
                      </span>
                      <span className="min-w-0 truncate font-display text-base font-bold text-primary sm:text-lg">
                        {s.t}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success text-success-foreground">
                        <Ic className="h-5 w-5" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                    </div>
                    <ul className="mt-4 grid gap-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="min-w-0">{b}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-primary">
                      <span className="uppercase tracking-wider text-muted-foreground">Dauer</span>
                      <span>{s.k}</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <Button
            asChild
            className="mt-6 w-full bg-success text-success-foreground hover:bg-success/90 sm:w-auto sm:self-start"
          >
            <Link to="/angebot">
              Jetzt passendes Angebot sichern <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------- BENEFITS -------------------------------- */

function BenefitsSection() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <TrendingDown className="h-3.5 w-3.5" /> Spar-Rechner
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
            Wie viel <span className="text-success">sparst du</span>?
          </h2>
          <p className="mt-3 text-muted-foreground">Schieb die Regler — wir rechnen live.</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <SavingsCalculator />
          <ComparisonCard />
        </div>
      </div>
    </section>
  );
}

function SavingsCalculator() {
  const [persons, setPersons] = useState(3);
  const [kwh, setKwh] = useState(3500);
  const [energy, setEnergy] = useState<"strom" | "gas">("strom");

  const result = useMemo(() => {
    const pricePerKwh = energy === "strom" ? 0.41 : 0.12;
    const cleverPrice = energy === "strom" ? 0.31 : 0.085;
    const base = energy === "strom" ? 145 : 110;
    const grund = Math.round(base + kwh * pricePerKwh);
    const portal = Math.round(grund * 0.87);
    const clever = Math.round(base + kwh * cleverPrice);
    const saved = grund - clever;
    return { grund, portal, clever, saved };
  }, [kwh, energy]);

  const max = Math.max(result.grund, result.portal, result.clever);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card md:p-9">
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-success/10 blur-3xl" aria-hidden />

      {/* Energy switch */}
      <div className="relative flex items-center justify-between">
        <div className="inline-flex rounded-full bg-surface p-1">
          {(["strom", "gas"] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                setEnergy(e);
                setKwh(e === "gas" ? 14000 : 3500);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition",
                energy === e ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:text-primary",
              )}
            >
              {e === "strom" ? <Zap className="h-3.5 w-3.5" /> : <Flame className="h-3.5 w-3.5" />}
              {e === "strom" ? "Strom" : "Gas"}
            </button>
          ))}
        </div>
        <div className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Live-Rechnung
        </div>
      </div>

      {/* Persons slider */}
      <div className="relative mt-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Users className="h-4 w-4 text-success" /> Personen im Haushalt
          </div>
          <div className="font-display text-xl font-extrabold tabular-nums text-primary">{persons}</div>
        </div>
        <Slider
          value={[persons]}
          min={1}
          max={6}
          step={1}
          onValueChange={(v) => {
            const p = v[0];
            setPersons(p);
            const map = energy === "gas"
              ? { 1: 5000, 2: 9000, 3: 14000, 4: 18000, 5: 22000, 6: 26000 }
              : { 1: 1500, 2: 2500, 3: 3500, 4: 4500, 5: 5500, 6: 6500 };
            setKwh(map[p as 1 | 2 | 3 | 4 | 5 | 6]);
          }}
          className="mt-4"
        />
        <div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6+</span>
        </div>
      </div>

      {/* kWh slider */}
      <div className="relative mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <PlugZap className="h-4 w-4 text-success" /> Jahresverbrauch
          </div>
          <div className="font-display text-xl font-extrabold tabular-nums text-primary">
            {kwh.toLocaleString("de-DE")} <span className="text-sm font-bold text-muted-foreground">kWh</span>
          </div>
        </div>
        <Slider
          value={[kwh]}
          min={energy === "gas" ? 3000 : 1000}
          max={energy === "gas" ? 30000 : 8000}
          step={energy === "gas" ? 500 : 100}
          onValueChange={(v) => setKwh(v[0])}
          className="mt-4"
        />
      </div>

      {/* Live bar chart */}
      <div className="relative mt-8 space-y-3">
        {[
          { label: "Grundversorger", value: result.grund, color: "bg-primary/70", text: "text-primary" },
          { label: "Portal-Tarif", value: result.portal, color: "bg-primary/40", text: "text-primary" },
          { label: "EnergieClever", value: result.clever, color: "bg-success", text: "text-success", highlight: true },
        ].map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs">
              <span className={cn(b.highlight ? "font-semibold text-success" : "text-muted-foreground")}>
                {b.label}
              </span>
              <span className={cn("font-semibold tabular-nums", b.text)}>{b.value.toLocaleString("de-DE")} €/Jahr</span>
            </div>
            <div className="mt-1 h-2.5 rounded-full bg-border/60">
              <div
                className={cn("h-full rounded-full transition-all duration-500 ease-out", b.color)}
                style={{ width: `${(b.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Saving callout */}
      <div className="relative mt-7 flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-success/15 via-success/10 to-transparent p-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-success">Deine Ersparnis</div>
          <div className="font-display text-4xl font-extrabold tabular-nums text-primary">
            {result.saved.toLocaleString("de-DE")} €<span className="text-base font-bold text-muted-foreground"> / Jahr</span>
          </div>
        </div>
        <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
          <Link to="/angebot">Sichern <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}

function ComparisonCard() {
  const rows = [
    { l: "Persönlicher Berater statt Chatbot", us: true, them: false },
    { l: "Kündigung beim Altanbieter inklusive", us: true, them: false },
    { l: "Tarife manuell auf Fallen geprüft", us: true, them: false },
    { l: "Kein Bonus-Hopping nach 12 Monaten", us: true, them: false },
    { l: "Provision wird offen ausgewiesen", us: true, them: false },
    { l: "100 % kostenlos", us: true, them: true },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-2 shadow-card">
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 rounded-2xl bg-primary px-5 py-4 text-primary-foreground">
        <div className="text-xs uppercase tracking-[0.18em] opacity-70">Leistung</div>
        <div className="w-24 text-center font-display text-sm font-bold text-success">Wir</div>
        <div className="w-24 text-center font-display text-sm font-bold opacity-60">Portal</div>
      </div>
      <ul className="divide-y divide-border">
        {rows.map((r) => (
          <li key={r.l} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 px-5 py-3.5 transition hover:bg-success/5">
            <div className="text-sm text-foreground">{r.l}</div>
            <div className="flex w-24 justify-center">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-success text-success-foreground">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>
            <div className="flex w-24 justify-center">
              {r.them ? (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-muted text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Live ticker */}
      <div className="m-2 mt-3 flex items-center justify-between gap-4 rounded-2xl bg-surface p-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-success">Heute gespart</div>
            <div className="font-display text-lg font-extrabold tabular-nums text-primary">€ 18.420</div>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div className="font-semibold text-primary">47 Haushalte</div>
          <div>in den letzten 24 h</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- AUDIENCE -------------------------------- */

function AudienceSection() {
  const items = [
    { icon: Home, t: "Privathaushalte", d: "Singles, Familien, WGs — den passenden Tarif für jeden Verbrauch.", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=70" },
    { icon: Briefcase, t: "Gewerbe", d: "Sondertarife für Selbstständige, Praxen und kleine Betriebe.", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=70" },
    { icon: Building2, t: "Hausverwaltungen", d: "Effizienz für Mehrobjektportfolios mit Bündelung mehrerer Standorte.", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=70" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">Für wen wir arbeiten</h2>
      </motion.div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((z) => (
          <motion.div key={z.t} {...fadeUp} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-card">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <img src={z.img} alt={z.t} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-card/95 text-success shadow-soft">
                <z.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-bold text-primary">{z.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{z.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- STATS ------------------------------- */

function StatsBand() {
  const stats = [
    { v: "50.000+", l: "Erfolgreiche Wechsel" },
    { v: "380 €", l: "Ø Ersparnis pro Jahr" },
    { v: "4,8 ★", l: "Kundenzufriedenheit" },
    { v: "100 %", l: "Kostenlos & unverbindlich" },
  ];
  return (
    <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-success/20 blur-3xl" aria-hidden />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-success/10 blur-3xl" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
        {stats.map((s) => (
          <motion.div key={s.l} {...fadeUp} className="text-center md:text-left">
            <div className="font-display text-4xl font-extrabold text-success md:text-5xl">{s.v}</div>
            <div className="mt-1 text-sm opacity-80">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- PRICE BREAKDOWN ---------------------------- */

type Slice = {
  key: string;
  label: string;
  short: string;
  value: number;
  color: string;
  desc: string;
};

function PriceBreakdown() {
  const slices: Slice[] = [
    {
      key: "beschaffung",
      label: "Beschaffung & Vertrieb",
      short: "Energiekosten",
      value: 43,
      color: "hsl(var(--success))",
      desc: "Einkauf der Energie an der Strombörse, Vertrieb, Service und Marge des Versorgers. Hier liegt das größte Sparpotenzial beim Anbieterwechsel.",
    },
    {
      key: "netz",
      label: "Netzentgelte & Messung",
      short: "Netz & Messung",
      value: 26,
      color: "#1f3a2e",
      desc: "Regulierte Gebühren für die Nutzung der Strom- und Gasnetze sowie Messstellenbetrieb. Fix pro Region — unabhängig vom Anbieter.",
    },
    {
      key: "steuern",
      label: "Steuern, Abgaben & Umlagen",
      short: "Steuern & Abgaben",
      value: 31,
      color: "#e8a64b",
      desc: "Stromsteuer, Konzessionsabgabe, KWKG-, Offshore- und §19-Umlage sowie Mehrwertsteuer. Gesetzlich festgelegt, für alle Anbieter gleich.",
    },
  ];

  const [active, setActive] = useState<string>("beschaffung");
  const current = slices.find((s) => s.key === active) ?? slices[0];

  // Donut geometry
  const size = 320;
  const stroke = 46;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = slices.map((s) => {
    const len = (s.value / 100) * circumference;
    const seg = {
      ...s,
      dasharray: `${len} ${circumference - len}`,
      dashoffset: -offset,
    };
    offset += len;
    return seg;
  });

  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-success">
            Transparenz
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Wie setzt sich dein Strompreis zusammen?
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Nur ein Bruchteil deiner Stromrechnung geht an den Anbieter selbst — der Rest sind Netze und Steuern. Genau hier setzen wir an.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="grid items-center gap-12 rounded-3xl border border-border bg-background p-6 md:grid-cols-2 md:p-12"
        >
          {/* Donut */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[360px] items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full -rotate-90">
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth={stroke}
              />
              {segments.map((s) => {
                const isActive = s.key === active;
                return (
                  <circle
                    key={s.key}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={isActive ? stroke + 6 : stroke}
                    strokeDasharray={s.dasharray}
                    strokeDashoffset={s.dashoffset}
                    className="cursor-pointer transition-all duration-300"
                    style={{ opacity: isActive ? 1 : 0.55 }}
                    onMouseEnter={() => setActive(s.key)}
                    onClick={() => setActive(s.key)}
                  />
                );
              })}
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold tracking-tight md:text-6xl">
                {current.value}<span className="text-2xl md:text-3xl">%</span>
              </div>
              <div className="mt-1 max-w-[55%] text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {current.short}
              </div>
            </div>
          </div>

          {/* Legend / details */}
          <div>
            <div className="space-y-2">
              {slices.map((s) => {
                const isActive = s.key === active;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onMouseEnter={() => setActive(s.key)}
                    onClick={() => setActive(s.key)}
                    className={cn(
                      "group flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-all",
                      isActive
                        ? "border-foreground/15 bg-muted/60 shadow-sm"
                        : "border-transparent hover:bg-muted/40"
                    )}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="flex-1 text-sm font-semibold md:text-base">{s.label}</span>
                    <span className="text-base font-bold tabular-nums md:text-lg">{s.value}%</span>
                  </button>
                );
              })}
            </div>

            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-2xl bg-muted/50 p-5 text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              {current.desc}
            </motion.div>

            <p className="mt-6 text-xs text-muted-foreground">
              Beispielhafte Aufteilung für einen Jahresverbrauch von 2.900 kWh. Anteile variieren je nach Tarif und Netzgebiet.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------- TESTIMONIALS ----------------------------- */


function Testimonials() {
  const items = [
    { n: "Sandra K.", c: "Familie, München", t: "Innerhalb eines Tages hatte ich ein passendes Angebot. Spare jetzt 520 € im Jahr — ohne Stress." },
    { n: "Markus B.", c: "Inhaber Café, Köln", t: "Endlich Klartext statt Klick-Strecke. Die Gewerbeberatung war Gold wert." },
    { n: "Familie Weiß", c: "Hannover", t: "Komplett ohne Aufwand. Kündigung beim alten Anbieter haben sie für uns übernommen." },
  ];
  return (
    <section className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">Was Kunden über uns sagen</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((r) => (
            <motion.div key={r.n} {...fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-success">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">„{r.t}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {r.n.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.c}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- MORE SOLUTIONS ----------------------------- */

function MoreSolutions() {
  const items = [
    {
      img: solutionAutostrom,
      title: "Autostrom",
      bullets: ["Zuhause und unterwegs laden", "Sondertarif für E-Auto-Halter", "100 % Ökostrom aus Europa"],
      cta: "Zum Autostrom",
      to: "/angebot",
    },
    {
      img: solutionWaermestrom,
      title: "Wärmestrom",
      bullets: ["Günstiger heizen mit Strom", "Für Wärmepumpe & Nachtspeicher", "Alternativ zum Haushaltsstrom"],
      cta: "Zum Wärmestrom",
      to: "/angebot",
    },
    {
      img: solutionSolar,
      title: "Solaranlage",
      bullets: ["Solaranlage kaufen oder mieten", "Mit geprüften Fach-Partnern", "Nachhaltig und unabhängig"],
      cta: "Jetzt beraten lassen",
      to: "/kontakt",
    },
  ];

  return (
    <section className="bg-success-soft py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.h2 {...fadeUp} className="max-w-3xl font-display text-3xl font-extrabold leading-tight text-primary md:text-5xl">
          Noch mehr clevere Energie-Lösungen<span className="text-success">.</span>
        </motion.h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-[4/3] overflow-hidden bg-success-soft">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display text-3xl font-extrabold text-primary">
                  {it.title}<span className="text-success">.</span>
                </h3>
                <ul className="mt-6 space-y-3 text-[15px] text-foreground">
                  {it.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-success" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-2">
                  <Link
                    to={it.to}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-success px-6 py-3 text-sm font-semibold text-primary transition hover:bg-success hover:text-success-foreground"
                  >
                    {it.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- RATGEBER -------------------------------- */

function RatgeberSection() {
  const items = [
    { t: "Anbieterwechsel: Schritt für Schritt", d: "So läuft Ihr Wechsel reibungslos — von der Kündigung bis zur ersten Abrechnung.", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=70", to: "/ablauf" },
    { t: "Strompreise verstehen", d: "Grundpreis, Arbeitspreis, Boni: Was wirklich in Ihrem Tarif steckt.", img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=70", to: "/faq" },
    { t: "Über EnergieClever", d: "Warum wir unabhängig sind und wie wir Geld verdienen — transparent erklärt.", img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=70", to: "/ueber-uns" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <motion.div {...fadeUp} className="flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-success">Ratgeber</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">Wissen, das spart</h2>
        </div>
        <Link to="/faq" className="hidden text-sm font-semibold text-primary hover:text-success md:inline-flex">
          Alle Artikel <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </motion.div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((r) => (
          <motion.div key={r.t} {...fadeUp}>
            <Link to={r.to} className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-card">
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <img src={r.img} alt={r.t} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold text-primary group-hover:text-success">{r.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.d}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-success">
                  Weiterlesen <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ---------------------------------- */

function FaqSection() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div {...fadeUp} className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-success">FAQ</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-primary md:text-5xl">
            Häufige Fragen rund um Ihren Tarifwechsel
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-x-12 md:grid-cols-2">
          {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((col, ci) => (
            <Accordion key={ci} type="single" collapsible className="divide-y divide-border border-t border-border">
              {col.map((f, i) => (
                <AccordionItem key={i} value={`c${ci}-${i}`} className="border-b-0">
                  <AccordionTrigger className="py-5 text-left text-base font-semibold text-primary hover:text-success hover:no-underline [&[data-state=open]]:text-success">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FINAL CTA ------------------------------- */

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div {...fadeUp} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-success to-success/80 p-10 text-success-foreground shadow-card md:p-14">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">Bereit, weniger zu zahlen?</h2>
            <p className="mt-3 max-w-xl opacity-95">
              Starten Sie jetzt Ihre kostenlose Tarifprüfung. 2 Minuten — mehr brauchen wir nicht.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm opacity-95">
              <Phone className="h-4 w-4" /> Lieber persönlich? <a className="font-semibold underline" href="tel:08001234567">0800 123 4567</a>
            </div>
          </div>
          <Button asChild size="lg" className="h-12 bg-primary text-base text-primary-foreground hover:bg-primary/90">
            <Link to="/angebot">Persönliches Angebot erhalten <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

const faqs = [
  { q: "Ist die Beratung wirklich kostenlos?", a: "Ja. Wir werden vom neuen Anbieter vergütet, nicht von Ihnen. Für Sie entstehen keinerlei Kosten." },
  { q: "Wie lange dauert ein Wechsel?", a: "Der Wechselprozess dauert in der Regel 4–8 Wochen. Die Versorgung läuft währenddessen lückenlos weiter." },
  { q: "Gibt es eine Versorgungsunterbrechung?", a: "Nein. Strom und Gas fließen ohne Unterbrechung — nur der Vertragspartner wechselt." },
  { q: "Welche Daten brauchen Sie von mir?", a: "Postleitzahl, ungefährer Jahresverbrauch und Kontaktdaten reichen aus. Eine alte Jahresabrechnung beschleunigt die Prüfung." },
  { q: "Was passiert mit meinen Daten?", a: "Alle Daten werden DSGVO-konform in Deutschland verarbeitet und nur zur Tarifprüfung verwendet." },
  { q: "Bin ich verpflichtet, das Angebot anzunehmen?", a: "Nein. Die Beratung ist komplett unverbindlich. Sie entscheiden, ob Sie wechseln möchten." },
  { q: "Auch für Gewerbekunden?", a: "Ja, wir betreuen Selbstständige, kleine Unternehmen und Hausverwaltungen mit Sondertarifen." },
  { q: "Wie kündige ich meinen alten Vertrag?", a: "Auf Wunsch übernehmen wir die Kündigung beim alten Anbieter komplett für Sie." },
];
