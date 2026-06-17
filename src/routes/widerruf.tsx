import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/widerruf")({
  head: () => ({ meta: [{ title: "Widerruf – EnergieClever" }] }),
  component: () => (
    <StaticPage
      title="Widerrufsbelehrung"
      lead="Verbraucher haben das Recht, einen geschlossenen Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen."
    >
      <h2>Widerrufsrecht</h2>
      <p>Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsabschlusses.</p>
      <h2>Folgen des Widerrufs</h2>
      <p>
        Im Falle eines wirksamen Widerrufs sind die beiderseits empfangenen Leistungen
        zurückzugewähren.
      </p>
      <h2>Wie widerrufen?</h2>
      <p>
        Schicken Sie uns eine formlose Erklärung per E-Mail an widerruf@energieclever.de oder per
        Post an unsere Anschrift.
      </p>
    </StaticPage>
  ),
});
