import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ – EnergieClever" }, { name: "description", content: "Antworten auf häufige Fragen zu Tarifwechsel, Beratung und Datenschutz." }] }),
  component: () => (
    <StaticPage title="Häufige Fragen">
      <h2>Ist die Beratung wirklich kostenlos?</h2>
      <p>Ja. Wir werden vom neuen Anbieter vergütet, nicht von Ihnen.</p>
      <h2>Wie lange dauert ein Wechsel?</h2>
      <p>In der Regel 4–8 Wochen. Versorgung läuft währenddessen lückenlos weiter.</p>
      <h2>Welche Daten brauchen Sie?</h2>
      <p>PLZ, ungefährer Jahresverbrauch, Kontaktdaten. Eine alte Rechnung beschleunigt die Prüfung.</p>
      <h2>Was passiert mit meinen Daten?</h2>
      <p>Verarbeitung DSGVO-konform in Deutschland, ausschließlich für die Tarifprüfung.</p>
      <h2>Bin ich verpflichtet zu wechseln?</h2>
      <p>Nein. Die Beratung ist unverbindlich, Sie entscheiden frei.</p>
    </StaticPage>
  ),
});
