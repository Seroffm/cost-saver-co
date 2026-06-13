import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Zap, Flame, Layers, Briefcase,
  Home, Building2, TrendingDown, AlertTriangle, FileSearch,
  Star, ShieldCheck, BadgeCheck, Award, Phone, MapPin,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { cn } from "@/lib/utils";

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
      <Testimonials />
      <RatgeberSection />
      <FaqSection />
      <FinalCta />
    </SiteLayout>
  );
}

/* ---------------------------------- HERO ---------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-success-soft via-background to-background">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-success/10 blur-3xl" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-10 md:pt-20 md:pb-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
          <motion.div {...fadeUp}>
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
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
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
    { n: "01", icon: FileSearch, t: "Daten eingeben", d: "PLZ, Verbrauch und Wunsch in unter 2 Minuten online angeben." },
    { n: "02", icon: TrendingDown, t: "Angebot erhalten", d: "Unser Berater prüft passende Tarife und meldet sich persönlich." },
    { n: "03", icon: CheckCircle2, t: "Wechseln & sparen", d: "Wir übernehmen Kündigung und Anmeldung — ohne Versorgungslücke." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-success">So einfach geht's</span>
        <h2 className="mt-2 font-display text-3xl font-bold text-primary md:text-4xl">In 3 Schritten zum besseren Tarif</h2>
        <p className="mt-3 text-muted-foreground">Kein Klick-Roulette, kein Vergleichsportal-Stress — sondern echte Beratung.</p>
      </motion.div>
      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" aria-hidden />
        {steps.map((s) => (
          <motion.div key={s.n} {...fadeUp} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-success text-success-foreground shadow-soft">
                <s.icon className="h-5 w-5" />
              </div>
              <div className="font-display text-sm font-bold text-muted-foreground">{s.n}</div>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-primary">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- BENEFITS -------------------------------- */

function BenefitsSection() {
  const items = [
    { icon: ShieldCheck, t: "Persönliche Beratung", d: "Echter Berater statt anonymes Portal. Wir kennen Ihre Situation." },
    { icon: Award, t: "Alle Anbieter geprüft", d: "Über 1.200 Tarife, kontinuierlich auf Seriosität und Konditionen geprüft." },
    { icon: BadgeCheck, t: "100 % kostenlos", d: "Wir werden vom neuen Anbieter vergütet — nicht von Ihnen." },
    { icon: CheckCircle2, t: "Sichere Abwicklung", d: "Kündigung, Anmeldung, Versorgung — alles aus einer Hand." },
  ];
  return (
    <section className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">Warum EnergieClever?</h2>
          <p className="mt-3 text-muted-foreground">Vier Gründe, warum tausende Haushalte uns ihrem alten Vergleichsportal vorziehen.</p>
        </motion.div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((b) => (
            <motion.div key={b.t} {...fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:shadow-card">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-success/10 text-success">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-primary">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
    <section className="bg-surface py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div {...fadeUp} className="text-center">
          <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">Häufige Fragen</h2>
          <p className="mt-3 text-muted-foreground">Alles, was Sie vor dem Wechsel wissen sollten.</p>
        </motion.div>
        <Accordion type="single" collapsible className="mt-10 space-y-2">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left font-semibold text-primary">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
