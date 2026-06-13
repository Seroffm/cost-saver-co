import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/ablauf")({
  head: () => ({ meta: [{ title: "Ablauf – EnergieClever" }, { name: "description", content: "So funktioniert die kostenlose Tarifprüfung Schritt für Schritt." }] }),
  component: () => (
    <StaticPage title="So läuft Ihre Tarifprüfung ab" lead="Transparent, persönlich und ohne versteckte Schritte – in vier Etappen zum besseren Tarif.">
      <h2>1. Anfrage senden</h2>
      <p>Sie beantworten unser kurzes Online-Formular. Das dauert keine zwei Minuten und ist komplett unverbindlich.</p>
      <h2>2. Persönliche Prüfung</h2>
      <p>Ein Berater prüft Ihre Verbrauchs- und Vertragsdaten und filtert passende Tarife aus unserem Pool geprüfter Anbieter.</p>
      <h2>3. Angebot erhalten</h2>
      <p>Sie erhalten ein konkretes Angebot per E-Mail oder Telefon – inklusive Sparpotenzial und Vertragsdetails.</p>
      <h2>4. Wechsel auf Wunsch</h2>
      <p>Wenn Sie zustimmen, übernehmen wir die komplette Abwicklung – inklusive Kündigung beim alten Anbieter. Ohne Versorgungslücke.</p>
    </StaticPage>
  ),
});
