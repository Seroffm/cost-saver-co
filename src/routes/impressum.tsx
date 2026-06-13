import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/impressum")({
  head: () => ({ meta: [{ title: "Impressum – EnergieClever" }] }),
  component: () => (
    <StaticPage title="Impressum">
      <p>EnergieClever GmbH (Platzhalter)<br />Musterstraße 1<br />10115 Berlin</p>
      <p>Vertreten durch: Geschäftsführung Max Muster<br />Handelsregister: HRB 000000 B<br />Umsatzsteuer-ID: DE000000000</p>
      <p>Telefon: 0800 123 4567<br />E-Mail: hallo@energieclever.de</p>
      <p className="text-xs text-muted-foreground">Diese Seite ist ein Platzhalter.</p>
    </StaticPage>
  ),
});
