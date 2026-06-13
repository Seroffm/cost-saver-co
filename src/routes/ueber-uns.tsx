import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({ meta: [{ title: "Über uns – EnergieClever" }, { name: "description", content: "Unabhängige Energieberatung aus Deutschland." }] }),
  component: () => (
    <StaticPage title="Über uns" lead="Wir sind ein unabhängiges Beratungsteam für Strom- und Gastarife. Sitz in Deutschland, Beratung auf Augenhöhe.">
      <h2>Unsere Mission</h2>
      <p>Energieverträge sollen verständlich sein. Wir übersetzen Tarif-Kleingedrucktes in klare Empfehlungen – ohne Provisionsdruck, ohne Verkaufsmasche.</p>
      <h2>Unser Team</h2>
      <p>Zertifizierte Energieberater, ehemalige Vertriebsprofis großer Versorger und Service-Spezialisten. Zusammen mit über 15 Jahren Branchenerfahrung.</p>
      <h2>Unser Versprechen</h2>
      <ul>
        <li>Beratung kostet Sie keinen Cent.</li>
        <li>Wir empfehlen nur Anbieter, die wir geprüft haben.</li>
        <li>Sie entscheiden, niemals wir.</li>
      </ul>
    </StaticPage>
  ),
});
