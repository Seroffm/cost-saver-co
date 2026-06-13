import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Sparkles, Building2, Home, Briefcase,
  TrendingDown, AlertTriangle, FileSearch, Star, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TrustBar } from "@/components/site/TrustBar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EnergieClever – Strom & Gas günstiger machen" },
      { name: "description", content: "Kostenlose Tarifprüfung für Strom und Gas. Persönliche Beratung, geprüfte Anbieter, keine Versorgungsunterbrechung." },
      { property: "og:title", content: "EnergieClever – Strom & Gas günstiger machen" },
      { property: "og:description", content: "Kostenlose Tarifprüfung für Strom und Gas. Persönliche Beratung, geprüfte Anbieter, keine Versorgungsunterbrechung." },
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

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <Sparkles className="h-3.5 w-3.5" /> Bis zu 740 € sparen pro Jahr
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight text-primary md:text-6xl">
                Strom & Gas <span className="text-success">günstiger</span> machen.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Wir vergleichen Tarife für Sie persönlich – unabhängig, kostenlos und transparent. Ohne Tarif-Dschungel, ohne Risiko.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
                  <Link to="/angebot">Kostenlos Tarif prüfen <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/ablauf">So funktioniert's</Link>
                </Button>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" /> Unverbindlich
                <CheckCircle2 className="h-4 w-4 text-success" /> 2 Min. Aufwand
                <CheckCircle2 className="h-4 w-4 text-success" /> Keine Versorgungslücke
              </div>
            </motion.div>

            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="relative">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <div className="text-sm font-medium text-muted-foreground">Wofür suchen Sie einen Tarif?</div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {([
                    { key: "strom", label: "Strom", desc: "Privathaushalt" },
                    { key: "gas", label: "Gas", desc: "Heizung & Warmwasser" },
                    { key: "beides", label: "Strom & Gas", desc: "Im Paket sparen" },
                    { key: "gewerbe", label: "Gewerbe", desc: "Unternehmenstarif" },
                  ] as const).map((c) => (
                    <Link
                      key={c.key}
                      to="/angebot"
                      search={{ start: c.key }}
                      className="group rounded-xl border border-border bg-surface p-4 transition hover:border-success hover:bg-success/5"
                    >
                      <div className="font-semibold text-primary group-hover:text-success">{c.label}</div>
                      <div className="text-xs text-muted-foreground">{c.desc}</div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground">
                  <div className="text-sm">Direkt loslegen</div>
                  <Button asChild size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                    <Link to="/angebot">Start <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* PROBLEM */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">Energiekosten außer Kontrolle?</h2>
          <p className="mt-3 text-muted-foreground">Drei Gründe, warum die meisten Haushalte zu viel zahlen.</p>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: TrendingDown, title: "Zu hohe Abschläge", text: "Viele Anbieter passen Abschläge nicht an den realen Verbrauch an. Sie zahlen drauf – jeden Monat." },
            { icon: AlertTriangle, title: "Stille Preiserhöhungen", text: "Tarife verteuern sich automatisch. Ohne Wechsel rutschen Sie in den teuren Grundversorgungstarif." },
            { icon: FileSearch, title: "Tarif-Dschungel", text: "Bonus, Boni, Laufzeit, Preisgarantie – Vergleichsportale verwirren mehr, als sie helfen." },
          ].map((p) => (
            <motion.div key={p.title} {...fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LÖSUNG */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <span className="text-xs font-semibold uppercase tracking-wider text-success">Unsere Lösung</span>
              <h2 className="mt-2 text-3xl font-bold text-primary md:text-4xl">Persönliche Tarifprüfung statt Vergleichsportal.</h2>
              <p className="mt-4 text-muted-foreground">
                Ein echter Berater prüft Ihre Verbrauchs- und Vertragsdaten, filtert versteckte Fallen und schlägt Ihnen Tarife vor, die wirklich zu Ihnen passen. Kein Bot, kein Klick-Roulette.
              </p>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Unabhängige Auswahl aus geprüften Anbietern",
                  "Keine versteckten Kosten oder Provisionen für Sie",
                  "Komplette Abwicklung – inklusive Kündigung",
                  "Keine Versorgungsunterbrechung beim Wechsel",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-success" /> <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-card">
              <div className="text-sm opacity-80">Durchschnittliche Ersparnis</div>
              <div className="mt-2 text-5xl font-bold">487 €</div>
              <div className="mt-1 text-sm opacity-80">pro Haushalt und Jahr</div>
              <div className="my-6 h-px bg-primary-foreground/15" />
              <div className="grid grid-cols-2 gap-6">
                <Stat label="Geprüfte Tarife" value="1.200+" />
                <Stat label="Wechsel pro Monat" value="3.400" />
                <Stat label="Erfolgsquote" value="98%" />
                <Stat label="Beratung kostet" value="0 €" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABLAUF */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-primary md:text-4xl">In 3 Schritten zum besseren Tarif</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { n: "01", t: "Daten eingeben", d: "Online in unter 2 Minuten. PLZ, Verbrauch, Wunsch – fertig." },
            { n: "02", t: "Angebot erhalten", d: "Wir prüfen passende Tarife und melden uns mit einem persönlichen Vorschlag." },
            { n: "03", t: "Wechsel & sparen", d: "Auf Wunsch übernehmen wir die komplette Abwicklung – ohne Versorgungslücke." },
          ].map((s) => (
            <motion.div key={s.n} {...fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="text-sm font-mono text-success">{s.n}</div>
              <h3 className="mt-2 text-lg font-semibold text-primary">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ZIELGRUPPEN */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.h2 {...fadeUp} className="text-center text-3xl font-bold text-primary md:text-4xl">Für wen wir arbeiten</motion.h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Home, t: "Privathaushalte", d: "Familien, Singles, WGs – wir finden den Tarif, der zu Ihrem Verbrauch passt." },
              { icon: Briefcase, t: "Gewerbe", d: "Spezielle Konditionen für Selbstständige, Praxen und kleine Betriebe." },
              { icon: Building2, t: "Hausverwaltungen", d: "Effizienz für Mehrobjektportfolios – inkl. Mehrstandort-Bündelung." },
            ].map((z) => (
              <motion.div key={z.t} {...fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <z.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-primary">{z.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{z.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BEWERTUNGEN */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.h2 {...fadeUp} className="text-center text-3xl font-bold text-primary md:text-4xl">Was Kunden über uns sagen</motion.h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { n: "Sandra K.", c: "Familie, München", t: "Innerhalb von einem Tag hatte ich ein passendes Angebot. Spare jetzt 520 € im Jahr." },
            { n: "Markus B.", c: "Inhaber Café, Köln", t: "Endlich Klartext statt Klick-Strecke. Die Gewerbeberatung war Gold wert." },
            { n: "Familie Weiß", c: "Hannover", t: "Komplett ohne Stress. Kündigung beim alten Anbieter haben sie für uns übernommen." },
          ].map((r) => (
            <motion.div key={r.n} {...fadeUp} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-success">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-3 text-sm text-foreground">"{r.t}"</p>
              <div className="mt-4 text-sm font-semibold text-primary">{r.n}</div>
              <div className="text-xs text-muted-foreground">{r.c}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-4">
          <motion.h2 {...fadeUp} className="text-center text-3xl font-bold text-primary md:text-4xl">Häufige Fragen</motion.h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <motion.div {...fadeUp} className="overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-14">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">Bereit, weniger zu zahlen?</h2>
              <p className="mt-3 max-w-xl opacity-80">Starten Sie jetzt Ihre kostenlose Tarifprüfung. 2 Minuten – mehr brauchen wir nicht.</p>
              <div className="mt-4 flex items-center gap-2 text-sm opacity-80">
                <Phone className="h-4 w-4" /> Lieber persönlich? <a className="underline" href="tel:08001234567">0800 123 4567</a>
              </div>
            </div>
            <Button asChild size="lg" className="bg-success text-success-foreground hover:bg-success/90">
              <Link to="/angebot">Persönliches Angebot erhalten <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-80">{label}</div>
    </div>
  );
}

const faqs = [
  { q: "Ist die Beratung wirklich kostenlos?", a: "Ja. Wir werden vom neuen Anbieter vergütet, nicht von Ihnen. Für Sie entstehen keinerlei Kosten." },
  { q: "Wie lange dauert ein Wechsel?", a: "Der Wechselprozess dauert in der Regel 4–8 Wochen. Die Versorgung läuft währenddessen lückenlos weiter." },
  { q: "Gibt es eine Versorgungsunterbrechung?", a: "Nein. Strom und Gas fließen ohne Unterbrechung – nur der Vertragspartner wechselt." },
  { q: "Welche Daten brauchen Sie von mir?", a: "Postleitzahl, ungefährer Jahresverbrauch und Kontaktdaten reichen aus. Eine alte Jahresabrechnung beschleunigt die Prüfung." },
  { q: "Was passiert mit meinen Daten?", a: "Alle Daten werden DSGVO-konform in Deutschland verarbeitet und nur zur Tarifprüfung verwendet." },
  { q: "Bin ich verpflichtet, das Angebot anzunehmen?", a: "Nein. Die Beratung ist komplett unverbindlich. Sie entscheiden, ob Sie wechseln möchten." },
  { q: "Auch für Gewerbekunden?", a: "Ja, wir betreuen Selbstständige, kleine Unternehmen und Hausverwaltungen mit Sondertarifen." },
  { q: "Wie kündige ich meinen alten Vertrag?", a: "Auf Wunsch übernehmen wir die Kündigung beim alten Anbieter komplett für Sie." },
];
