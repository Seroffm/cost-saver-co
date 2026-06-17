import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({ meta: [{ title: "Datenschutz – EnergieClever" }] }),
  component: () => (
    <StaticPage
      title="Datenschutzerklärung"
      lead="Wir verarbeiten Ihre Daten ausschließlich gemäß DSGVO."
    >
      <h2>1. Verantwortlicher</h2>
      <p>EnergieClever GmbH (Platzhalter), Musterstraße 1, 10115 Berlin.</p>
      <h2>2. Welche Daten wir erheben</h2>
      <p>
        Kontaktdaten (Name, E-Mail, Telefon), Postleitzahl, Verbrauchsangaben sowie freiwillige
        Angaben aus dem Formular.
      </p>
      <h2>3. Zweck der Verarbeitung</h2>
      <p>Persönliche Tarifprüfung und Kontaktaufnahme im Rahmen Ihrer Anfrage.</p>
      <h2>4. Ihre Rechte</h2>
      <p>
        Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf der
        Einwilligung sowie Beschwerde bei der Aufsichtsbehörde.
      </p>
      <h2>5. Speicherdauer</h2>
      <p>Wir speichern Anfragen nur so lange wie zur Beratung erforderlich, maximal 24 Monate.</p>
      <p className="text-xs text-muted-foreground">
        Diese Seite ist ein Platzhalter und ersetzt keine individuelle Rechtsberatung.
      </p>
    </StaticPage>
  ),
});
