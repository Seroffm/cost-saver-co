import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import imgStrom from "@/assets/page-strom.jpg";
import imgGas from "@/assets/page-gas.jpg";
import imgSolar from "@/assets/page-solar.jpg";
import imgBundle from "@/assets/page-strom-gas.jpg";
import imgWaerme from "@/assets/solution-waermestrom.jpg";
import imgAuto from "@/assets/solution-autostrom.jpg";

type Article = {
  slug: string;
  title: string;
  teaser: string;
  image: string;
  tag: string;
  read: string;
  date: string;
  author: string;
  body: { heading: string; paragraphs: string[] }[];
};

const articles: Article[] = [
  {
    slug: "strompreis-2026",
    title: "Strompreis 2026: Was Haushalte jetzt wissen müssen",
    teaser:
      "Netzentgelte steigen, CO₂-Preis zieht an, aber Großhandelspreise sinken. Was bedeutet das für Ihre nächste Jahresabrechnung?",
    image: imgStrom,
    tag: "Strom · Marktanalyse",
    read: "8 min",
    date: "12. Juni 2026",
    author: "Sarah Becker",
    body: [
      {
        heading: "Die wichtigsten Trends 2026",
        paragraphs: [
          "Im Jahr 2026 stehen Haushalte vor einer paradoxen Situation: Während die Beschaffungskosten an der Strombörse leicht sinken, steigen die regulatorischen Kosten. Allen voran Netzentgelte und CO₂-Preis. Für den durchschnittlichen Haushalt mit 3.500 kWh Jahresverbrauch bedeutet das eine Mehrbelastung von rund 70 €.",
          "Wer bisher in der Grundversorgung ist, zahlt im Schnitt 14–22 % mehr als Wechselkunden bei einem Sondertarif. Ein Anbieterwechsel bleibt damit der wirksamste Einzelhebel für die Stromrechnung.",
        ],
      },
      {
        heading: "Worauf jetzt achten",
        paragraphs: [
          "Preisgarantien sind 2026 wieder ein zentrales Kriterium. Tarife mit 12 oder besser 24 Monaten echter Preisgarantie schützen vor weiteren Strompreissprüngen. Vorsicht: Manche Anbieter werben mit 'eingeschränkter Preisgarantie', die Netzentgelte ausnimmt.",
          "Bonuszahlungen sind verlockend, aber rechnen Sie immer die Kosten ohne Bonus durch. Ein Tarif mit 250 € Sofortbonus, der nach 12 Monaten in einen teuren Folgetarif übergeht, ist oft teurer als ein Tarif ohne Bonus mit fairer Folgekonditionierung.",
        ],
      },
      {
        heading: "Unsere Empfehlung",
        paragraphs: [
          "Lassen Sie alle 12 Monate prüfen, ob Ihr Tarif noch passt. Das geht in unter 2 Minuten und kann mehrere hundert Euro sparen. Ohne Aufwand, ohne Versorgungslücke.",
        ],
      },
    ],
  },
  {
    slug: "oekostrom-labels",
    title: "Ökostrom erkennen: Echte Labels im Vergleich",
    teaser:
      "OK-Power, Grüner Strom-Label, TÜV Süd EE01. Welches Siegel garantiert wirklich neuen Ökostrom?",
    image: imgSolar,
    tag: "Strom · Ökostrom",
    read: "6 min",
    date: "8. Juni 2026",
    author: "Daniel Kraus",
    body: [
      {
        heading: "Was ist überhaupt Ökostrom?",
        paragraphs: [
          "Ökostrom ist nicht gleich Ökostrom. Der Begriff selbst ist nicht geschützt. Anbieter können auch dann Ökostrom verkaufen, wenn sie selbst keinen einzigen Cent in neue Anlagen investieren. Sie kaufen einfach Herkunftsnachweise aus Norwegen.",
          "Echte Wirkung entsteht nur, wenn der Tarif den Ausbau erneuerbarer Energien fördert. Genau das prüfen die unabhängigen Labels.",
        ],
      },
      {
        heading: "Die wichtigsten Siegel",
        paragraphs: [
          "Grüner Strom-Label: Strengstes Label, garantiert Förderbeitrag pro kWh in neue EE-Anlagen.",
          "OK-Power: Gutes Label, verlangt definierten Anteil neuer Anlagen.",
          "TÜV Süd EE01 / EE02: Solide, EE02 ist die strengere Variante.",
        ],
      },
    ],
  },
  {
    slug: "gaspreise-2026",
    title: "Gaspreise 2026: Prognose & Spar-Tipps",
    teaser:
      "Wie sich der Gaspreis im kommenden Heizjahr entwickeln dürfte. Und wann sich ein Festpreis lohnt.",
    image: imgGas,
    tag: "Gas · Prognose",
    read: "7 min",
    date: "5. Juni 2026",
    author: "Mira Aydin",
    body: [
      {
        heading: "Wo stehen wir 2026?",
        paragraphs: [
          "Die Gaspreise haben sich nach den Höchstständen 2022/23 stabilisiert, liegen aber weiter deutlich über dem Vor-Krisen-Niveau. Für 2026 erwarten wir leicht steigende Preise zum Winterhalbjahr.",
        ],
      },
      {
        heading: "Festpreis oder flexibel?",
        paragraphs: [
          "Für die meisten Haushalte mit Heizverbrauch ab 8.000 kWh empfiehlt sich aktuell ein 24-Monate-Festpreistarif. Der Aufpreis gegenüber variablen Tarifen ist gering, der Schutz vor Wintersprüngen aber wertvoll.",
        ],
      },
    ],
  },
  {
    slug: "solaranlage-kosten-2026",
    title: "Solaranlage-Kosten 2026: Alles auf einen Blick",
    teaser:
      "Was Sie heute für eine 10-kWp-Anlage zahlen, wie schnell sie sich rechnet und welche Förderung greift.",
    image: imgSolar,
    tag: "Solar · Investition",
    read: "9 min",
    date: "1. Juni 2026",
    author: "Sarah Becker",
    body: [
      {
        heading: "Aktuelle Preise",
        paragraphs: [
          "Eine schlüsselfertige 10-kWp-Anlage kostet 2026 zwischen 13.000 € und 18.000 €, inklusive Wechselrichter und Montage. Mit Stromspeicher (10 kWh) liegen Sie bei 20.000–26.000 €.",
        ],
      },
      {
        heading: "Wann sich das rechnet",
        paragraphs: [
          "Bei einem Eigenverbrauchsanteil von 30–40 % amortisiert sich eine Anlage typischerweise in 10–12 Jahren. Mit Speicher und E-Auto kann der Eigenverbrauch auf 70 % steigen, die Amortisationszeit sinkt auf 8–10 Jahre.",
        ],
      },
    ],
  },
  {
    slug: "bundle-doppelbonus",
    title: "Strom & Gas bündeln: Wann sich der Doppel-Bonus lohnt",
    teaser: "Bundles können doppelt sparen. Oder nichts bringen. Diese drei Fragen entscheiden.",
    image: imgBundle,
    tag: "Bundle · Ratgeber",
    read: "5 min",
    date: "28. Mai 2026",
    author: "Daniel Kraus",
    body: [
      {
        heading: "Wann sich Bundles lohnen",
        paragraphs: [
          "Bundles sparen Aufwand und bieten oft zusätzliche Boni. Wirtschaftlich lohnen sie sich aber nur, wenn der gebündelte Tarif auch einzeln betrachtet wettbewerbsfähig ist.",
        ],
      },
    ],
  },
  {
    slug: "waermestrom-tarif",
    title: "Wärmestrom: Wann sich ein Sondertarif rechnet",
    teaser:
      "Wärmepumpe oder Nachtspeicher? Wir zeigen, ab wann ein separater Wärmestromzähler Sinn ergibt.",
    image: imgWaerme,
    tag: "Strom · Wärmepumpe",
    read: "6 min",
    date: "22. Mai 2026",
    author: "Mira Aydin",
    body: [
      {
        heading: "Separater Zähler oder Mischzähler?",
        paragraphs: [
          "Wärmestromtarife sind in der Regel 5–10 ct/kWh günstiger als Haushaltsstrom. Ab einem Wärmepumpen-Verbrauch von 3.000 kWh pro Jahr lohnt sich der separate Zähler fast immer.",
        ],
      },
    ],
  },
  {
    slug: "e-auto-laden",
    title: "E-Auto laden zuhause: Der günstigste Weg",
    teaser:
      "Autostromtarif, dynamischer Tarif oder einfach Haushaltsstrom? Eine Entscheidungshilfe.",
    image: imgAuto,
    tag: "Strom · E-Mobilität",
    read: "7 min",
    date: "18. Mai 2026",
    author: "Sarah Becker",
    body: [
      {
        heading: "Welcher Tarif passt?",
        paragraphs: [
          "Wer regelmäßig nachts lädt und über einen Smart Meter verfügt, profitiert von dynamischen Stromtarifen mit stündlichen Börsenpreisen. Spar-Potenzial: 200–500 € pro Jahr.",
        ],
      },
    ],
  },
];

export const Route = createFileRoute("/wissen/$slug")({
  loader: ({ params }): { article: Article } => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return {};
    return {
      meta: [
        { title: `${a.title} | EnergieClever Wissen` },
        { name: "description", content: a.teaser },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.teaser },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-primary">Artikel nicht gefunden</h1>
        <p className="mt-4 text-muted-foreground">Diesen Beitrag gibt es leider nicht (mehr).</p>
        <Button asChild className="mt-6">
          <Link to="/wissen">Zur Wissens-Übersicht</Link>
        </Button>
      </div>
    </SiteLayout>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { article: a } = Route.useLoaderData() as { article: Article };
  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 md:py-20">
        <Link
          to="/wissen"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-success"
        >
          <ArrowLeft className="h-4 w-4" /> Alle Artikel
        </Link>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          {a.tag}
        </div>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-primary md:text-5xl">
          {a.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{a.teaser}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {a.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {a.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {a.read} Lesezeit
          </span>
        </div>
        <div className="mt-8 overflow-hidden rounded-3xl">
          <img src={a.image} alt="" className="w-full" />
        </div>

        <div className="prose prose-lg mt-10 max-w-none">
          {a.body.map((section) => (
            <div key={section.heading} className="mt-8 first:mt-0">
              <h2 className="font-display text-2xl font-bold text-primary">{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 leading-relaxed text-foreground/90">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary to-primary/90 p-8 text-primary-foreground md:p-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Lieber direkt sparen?</h2>
          <p className="mt-3 text-primary-foreground/80">
            2 Minuten Tarifprüfung. Bis zu 850 € Ersparnis pro Jahr.
          </p>
          <Button asChild className="mt-6 bg-success text-success-foreground hover:bg-success/90">
            <Link to="/angebot">
              Jetzt Tarif prüfen <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12">
          <h3 className="font-display text-xl font-bold text-primary">Weitere Artikel</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {articles
              .filter((x) => x.slug !== a.slug)
              .slice(0, 4)
              .map((o) => (
                <Link
                  key={o.slug}
                  to="/wissen/$slug"
                  params={{ slug: o.slug }}
                  className="group rounded-xl border bg-card p-4 transition hover:border-success/40"
                >
                  <div className="text-xs font-semibold text-success">{o.tag}</div>
                  <div className="mt-1 font-semibold text-primary group-hover:text-success">
                    {o.title}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
