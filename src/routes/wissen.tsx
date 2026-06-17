import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Zap, Flame, Sun, TrendingDown, FileText, Leaf } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-wissen.jpg";
import imgStrom from "@/assets/page-strom.jpg";
import imgGas from "@/assets/page-gas.jpg";
import imgSolar from "@/assets/page-solar.jpg";
import imgBundle from "@/assets/page-strom-gas.jpg";
import imgWaerme from "@/assets/solution-waermestrom.jpg";
import imgAuto from "@/assets/solution-autostrom.jpg";

export const Route = createFileRoute("/wissen")({
  head: () => ({
    meta: [
      { title: "Wissen: Ratgeber rund um Energie | PRIME ENERGIE" },
      {
        name: "description",
        content:
          "Ratgeber, Erklärartikel und Marktupdates rund um Strom, Gas, Solar und Wärmepumpe. Verständlich geschrieben, sorgfältig recherchiert.",
      },
      { property: "og:title", content: "Energie-Wissen & Ratgeber | PRIME ENERGIE" },
      {
        property: "og:description",
        content: "Verständlich erklärt: Strom, Gas, Solar, Wärmepumpe und mehr.",
      },
      { property: "og:image", content: "/__l5e/assets-v1/page-wissen" },
    ],
  }),
  component: WissenPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const categories = [
  { icon: Zap, label: "Strom", to: "/strom", color: "from-amber-400/20 to-amber-400/5" },
  { icon: Flame, label: "Gas", to: "/gas", color: "from-orange-400/20 to-orange-400/5" },
  { icon: Sun, label: "Solar", to: "/solar", color: "from-yellow-400/20 to-yellow-400/5" },
  { icon: TrendingDown, label: "Sparen", to: "/faq", color: "from-success/20 to-success/5" },
  { icon: FileText, label: "Verträge", to: "/ablauf", color: "from-primary/20 to-primary/5" },
  {
    icon: Leaf,
    label: "Nachhaltig",
    to: "/ueber-uns",
    color: "from-emerald-400/20 to-emerald-400/5",
  },
];

type Article = {
  title: string;
  teaser: string;
  image: string;
  tag: string;
  read: string;
  slug: string;
};

const featured: Article = {
  title: "Strompreis 2026: Was Haushalte jetzt wissen müssen",
  teaser:
    "Netzentgelte steigen, CO₂-Preis zieht an, aber Großhandelspreise sinken. Was bedeutet das für Ihre nächste Jahresabrechnung? Unsere Analyse mit konkreten Spar-Empfehlungen.",
  image: imgStrom,
  tag: "Strom · Marktanalyse",
  read: "8 min",
  slug: "strompreis-2026",
};

const articles: Article[] = [
  {
    title: "Ökostrom erkennen: Echte Labels im Vergleich",
    teaser:
      "OK-Power, Grüner Strom-Label, TÜV Süd EE01. Welches Siegel garantiert wirklich neuen Ökostrom?",
    image: imgStrom,
    tag: "Strom · Ökostrom",
    read: "6 min",
    slug: "oekostrom-labels",
  },
  {
    title: "Gaspreise 2026: Prognose & Spar-Tipps",
    teaser:
      "Wie sich der Gaspreis im kommenden Heizjahr entwickeln dürfte. Und wann sich ein Festpreis lohnt.",
    image: imgGas,
    tag: "Gas · Prognose",
    read: "7 min",
    slug: "gaspreise-2026",
  },
  {
    title: "Solaranlage-Kosten 2026: Alles auf einen Blick",
    teaser:
      "Was Sie heute für eine 10-kWp-Anlage zahlen, wie schnell sie sich rechnet und welche Förderung greift.",
    image: imgSolar,
    tag: "Solar · Investition",
    read: "9 min",
    slug: "solaranlage-kosten-2026",
  },
  {
    title: "Strom & Gas bündeln: Wann sich der Doppel-Bonus lohnt",
    teaser: "Bundles können doppelt sparen. Oder nichts bringen. Diese drei Fragen entscheiden.",
    image: imgBundle,
    tag: "Bundle · Ratgeber",
    read: "5 min",
    slug: "bundle-doppelbonus",
  },
  {
    title: "Wärmestrom: Wann sich ein Sondertarif rechnet",
    teaser:
      "Wärmepumpe oder Nachtspeicher? Wir zeigen, ab wann ein separater Wärmestromzähler Sinn ergibt.",
    image: imgWaerme,
    tag: "Strom · Wärmepumpe",
    read: "6 min",
    slug: "waermestrom-tarif",
  },
  {
    title: "E-Auto laden zuhause: Der günstigste Weg",
    teaser:
      "Autostromtarif, dynamischer Tarif oder einfach Haushaltsstrom? Eine Entscheidungshilfe.",
    image: imgAuto,
    tag: "Strom · E-Mobilität",
    read: "7 min",
    slug: "e-auto-laden",
  },
];

function WissenPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Energie verstehen"
        title={<>Wissen, das wirklich Strom spart.</>}
        lead="Ratgeber, Marktanalysen und Erklärartikel. Verständlich geschrieben, sorgfältig recherchiert. Damit Sie wissen, was Sie unterschreiben."
        image={heroImg}
        imageAlt="Aufgeschlagenes Buch und Lesebrille auf Holztisch"
        Icon={BookOpen}
        primaryCta={{ to: "/", label: "Direkt zur Tarifprüfung" }}
        secondaryCta={{ to: "/faq", label: "Zur FAQ" }}
      />

      {/* CATEGORIES */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <motion.div
              key={c.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.03 }}
            >
              <Link
                to={c.to}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-success/40"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-success ring-1 ring-success/20`}
                >
                  <c.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold text-primary group-hover:text-success">
                  {c.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-primary md:text-3xl">Im Fokus</h2>
          <Link to="/faq" className="text-sm font-semibold text-success hover:underline">
            Alle Themen <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>
        <motion.article
          {...fadeUp}
          className="group grid overflow-hidden rounded-3xl border border-border bg-card shadow-card md:grid-cols-2"
        >
          <div className="overflow-hidden">
            <img
              src={featured.image}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              {featured.tag} · {featured.read}
            </div>
            <h3 className="mt-5 text-2xl font-bold text-primary md:text-3xl">{featured.title}</h3>
            <p className="mt-4 text-muted-foreground">{featured.teaser}</p>
            <Link
              to="/wissen/$slug"
              params={{ slug: featured.slug }}
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-success hover:underline"
            >
              Artikel lesen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.article>
      </section>

      {/* ARTICLES GRID */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-primary md:text-3xl">Beliebte Artikel</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <motion.article
              key={a.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card"
            >
              <Link to="/wissen/$slug" params={{ slug: a.slug }} className="block">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-success">
                    {a.tag} · {a.read}
                  </div>
                  <h3 className="mt-2 text-lg font-semibold leading-snug text-primary group-hover:text-success">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.teaser}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER / CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 md:pb-24">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground shadow-card md:p-12">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <BookOpen className="h-10 w-10 text-success" />
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Lieber direkt sparen?</h2>
              <p className="mt-3 text-primary-foreground/80">
                Lassen Sie Ihren Tarif in nur 2 Minuten prüfen. Möglich sind bis zu 850 € Ersparnis
                pro Jahr.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-success px-6 py-3 text-sm font-bold text-success-foreground transition hover:bg-success/90"
            >
              Jetzt Tarif prüfen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
