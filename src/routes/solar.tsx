import { createFileRoute } from "@tanstack/react-router";
import { Sun, Battery, Thermometer, TrendingDown, ShieldCheck, BadgeCheck, Wrench, Leaf } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TopicHero, FeatureGrid, ImageSplit, FinalCta } from "@/components/site/TopicSections";
import heroImg from "@/assets/page-solar.jpg";
import splitImg from "@/assets/solution-solar.jpg";
import splitImg2 from "@/assets/solution-waermestrom.jpg";
import ctaBg from "@/assets/final-cta-bg.jpg";

export const Route = createFileRoute("/solar")({
  head: () => ({
    meta: [
      { title: "Solar & Wärmepumpe – unabhängig beraten | EnergieClever" },
      { name: "description", content: "Solaranlage, Stromspeicher und Wärmepumpe – wir vermitteln geprüfte Fachbetriebe, kennen die Förderungen und beraten ehrlich." },
      { property: "og:title", content: "Solar & Wärmepumpe | EnergieClever" },
      { property: "og:description", content: "Unabhängige Beratung zu Solaranlage, Stromspeicher und Wärmepumpe." },
      { property: "og:image", content: "/__l5e/assets-v1/page-solar" },
    ],
  }),
  component: SolarPage,
});

const features = [
  { icon: Sun, title: "Solaranlage planen", desc: "Wir kalkulieren Ertrag, Amortisation und passende Anlagengröße für Ihr Dach." },
  { icon: Battery, title: "Stromspeicher", desc: "Damit Ihr Strom auch abends fließt. Größenwahl ohne Übertreibung." },
  { icon: Thermometer, title: "Wärmepumpe", desc: "Wirtschaftlichkeitsprüfung & passender Wärmestromtarif aus einer Hand." },
  { icon: BadgeCheck, title: "Geprüfte Fachbetriebe", desc: "Wir vermitteln nur regionale Installateure mit lückenloser Referenzliste." },
  { icon: Wrench, title: "Förderung gesichert", desc: "BAFA, KfW, regionale Töpfe – wir wissen, was wann beantragt werden muss." },
  { icon: Leaf, title: "CO₂ runter, Wert rauf", desc: "Eigenversorgung senkt nicht nur Kosten, sondern hebt Ihren Immobilienwert." },
];

function SolarPage() {
  return (
    <SiteLayout>
      <TopicHero
        kicker="Eigene Energie produzieren"
        title={<>Ihr Dach kann mehr als nur Dach sein.</>}
        lead="Photovoltaik, Stromspeicher und Wärmepumpe – wir planen Ihre Energiezukunft ehrlich und ohne Vertriebsdruck. Mit geprüften Fachbetrieben aus Ihrer Region."
        image={heroImg}
        imageAlt="Einfamilienhaus mit Solaranlage auf dem Dach"
        Icon={Sun}
        primaryCta={{ to: "/kontakt", label: "Kostenlose Solar-Beratung" }}
        secondaryCta={{ to: "/ablauf", label: "So läuft die Planung ab" }}
      />

      <FeatureGrid
        title="Energie aus dem eigenen Haus"
        intro="Eine Solaranlage zahlt sich in 8–12 Jahren ab. Wir sorgen dafür, dass es schneller geht."
        items={features}
      />

      <ImageSplit
        eyebrow="Photovoltaik"
        title="Solaranlage – ehrlich kalkuliert"
        body="Die meisten Angebote rechnen mit Idealbedingungen. Wir kalkulieren mit Ihren tatsächlichen Dachflächen, Ihrem Verbrauchsprofil und realen Strompreis-Szenarien. Das Ergebnis: belastbare Zahlen, mit denen Sie planen können."
        image={splitImg}
        imageAlt="Photovoltaik-Module aus der Nähe"
        bullets={[
          "Dachvermessung per Satellit & Vor-Ort-Termin",
          "Verbrauchsanalyse aus Ihrer Jahresabrechnung",
          "Wirtschaftlichkeitsprüfung über 20 Jahre",
        ]}
      />

      <ImageSplit
        reverse
        eyebrow="Wärmepumpe"
        title="Heizen mit der Wärme der Umgebung"
        body="Eine Wärmepumpe braucht das richtige Haus, den richtigen Tarif und den richtigen Fachbetrieb. Wir prüfen alle drei – und sagen Ihnen ehrlich, wenn es noch nicht passt."
        image={splitImg2}
        imageAlt="Moderne Wärmepumpe im Außenbereich"
        bullets={[
          "Heizlastberechnung statt Pauschal-Angebot",
          "Passender Wärmestromtarif inklusive",
          "Fördermittel-Check inklusive Antragsbegleitung",
        ]}
      />

      <FinalCta
        title="Energie aus dem eigenen Haus."
        body="Wir hören erst zu – und beraten dann. Ohne Vertriebsdruck, ohne Vorkasse."
        image={ctaBg}
      />
    </SiteLayout>
  );
}
