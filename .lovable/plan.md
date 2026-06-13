## Scope Phase 1

Reine Frontend-Auslieferung. Kein Backend, kein Dashboard, keine DB. Das Formular sammelt alle Angaben, baut eine strukturierte Lead-Zusammenfassung und schickt sie per E-Mail an eine konfigurierbare Empfänger-Adresse. Phase 2 (Mitarbeiter-Dashboard mit Rollen, Status-System, Lead-Scoring, Statistiken) wird in einer späteren Iteration aufgesetzt — die Datenstruktur des Formulars wird aber schon so gebaut, dass sie 1:1 in die spätere `leads`-Tabelle passt.

## Design-Richtung

Fintech-Stil nach Briefing: Stripe/N26/Revolut-Anmutung. Dunkelblau (Vertrauen) als Primärfarbe, sattes Grün als CTA-/Ersparnis-Farbe, viel Weiß und Hellgrau. Inter als Body-Font, ein stärkerer Display-Schnitt für Headlines. Großzügige Whitespace, sanfte Schatten, abgerundete Karten (12–16px), dezente Hover-/Scroll-Animationen via Framer Motion. Mobile-first, alles unter 100kb CSS.

## Seitenstruktur (Routen)

```
/                  Hauptwebsite (Vertrauensaufbau)
/angebot           Lead-Landingpage mit Multi-Step-Formular (reduzierte Nav)
/danke             Danke-Seite nach Absenden
/ueber-uns
/ablauf
/faq
/kontakt
/datenschutz
/impressum
/widerruf
```

Jede Route mit eigenem `head()` (Titel, Description, OG-Tags). Geteilter Header/Footer auf Hauptseiten; `/angebot` hat eine reduzierte Top-Bar (Logo + Telefonnummer + Trust-Hinweis), keine Nav.

## Hauptseite `/` — Sektionen

1. Hero: Headline „Strom & Gas günstiger machen", Subline, Auswahl Strom/Gas/Beides/Gewerbe (führt direkt mit vorausgewähltem Schritt 1 auf `/angebot`), Haupt-CTA Grün
2. Trust-Leiste: kostenlos · unverbindlich · DSGVO · geprüfte Anbieter · keine Versorgungsunterbrechung
3. Problem-Sektion: zu hohe Abschläge, Preiserhöhungen, Tarifdschungel (3 Karten)
4. Lösung: kostenlose Tarifprüfung
5. Ablauf in 3 Schritten (Daten eingeben → Angebot erhalten → Wechsel)
6. Zielgruppen-Karten: Privathaushalte · Gewerbe · Hausverwaltungen
7. Kennzahlen-Band (Beispiel-Platzhalter, später ersetzbar)
8. Kundenbewertungen (3–6 Karten)
9. Team / Ansprechpartner (Platzhalter)
10. FAQ (Accordion, 8–10 Einträge)
11. Finaler CTA-Block → `/angebot`

## Lead-Landingpage `/angebot`

Zweispaltiges Layout auf Desktop (Hero+Trust links, Formular rechts in Karte). Mobile: Formular sofort sichtbar oben, Trust-Elemente darunter. Reduzierte Top-Bar.

## Multi-Step-Formular (8 Schritte, Progressive Disclosure)

Fortschrittsbalken oben, eine Frage pro Schritt, „Zurück"/„Weiter"-Buttons, finaler Button „Persönliches Angebot erhalten".

1. **Energieart**: Strom / Gas / Strom & Gas / Gewerbe (große Auswahlkarten mit Icon)
2. **Kundentyp**: Privat / Gewerbe / Hausverwaltung / Mehrere Standorte
3. **Standort**: PLZ (5-stellig, validiert), Ort, Straße (optional)
4. **Verbrauch** — bedingt nach Schritt 1:
   - Strom: „Jahresverbrauch bekannt?" → kWh-Input ODER Personenanzahl (Schätzung: 1=1500, 2=2500, 3=3500, 4=4250, 5+=5500 kWh)
   - Gas: kWh-Input ODER Wohnfläche + Heizart + Personen + Warmwasser-Toggle (Schätzformel hinterlegt)
   - Beides: beide Blöcke nacheinander
5. **Aktuelle Situation**: Anbieter (Text), monatlicher Abschlag (€), Vertragsende bekannt (Datum optional), Preisgarantie (ja/nein/weiß nicht)
6. **Ziel**: Multi-Select-Chips — günstigster Preis · Preisgarantie · Ökostrom · kurze Laufzeit · persönliche Beratung
7. **Kontaktdaten**: Vorname, Nachname, E-Mail, Telefon, beste Erreichbarkeit (Vormittag/Nachmittag/Abend), 2 Pflicht-Checkboxen (Datenschutz, Kontaktaufnahme). Sicherheitshinweis sichtbar.
8. **Optional Rechnung-Upload** + Absende-Button → bei Erfolg `/danke`

Validierung mit Zod pro Schritt. Step-Wechsel nur bei gültigen Feldern. State im React-Context, in `sessionStorage` gespiegelt damit Reload nicht verloren geht.

## Lead-Versand (statisch, ohne eigenes Backend)

Eine schmale TanStack-Server-Route `POST /api/lead` nimmt die Formular-Payload entgegen, validiert sie nochmal mit Zod und schickt sie per E-Mail an `LEAD_RECIPIENT_EMAIL`. Da in Phase 1 noch kein E-Mail-Provider eingerichtet ist (wurde bewusst weggelassen), wird die Route so vorbereitet, dass sie:
- den Lead als formatierten HTML- und Text-Block aufbereitet,
- ihn aktuell **nur in den Server-Logs** ausgibt (für Test/Demo) und einen Lead-ID-String (UUID) zurückgibt,
- mit einem TODO-Kommentar markiert ist, wo später `lovable-emails` oder ein Resend-Connector eingehängt wird (3-Zeilen-Change).

Hochgeladene Rechnung wird in Phase 1 NICHT versendet (Anhänge brauchen Storage). Datei wird clientseitig akzeptiert, Dateiname + Größe gehen mit; ein Hinweis im UI: „Rechnung wird beim Beratungsgespräch nachgereicht".

## Danke-Seite `/danke`

Zeigt Lead-ID, Zusammenfassung der Anfrage (aus URL-State oder sessionStorage), Hinweis auf nächste Schritte, Kontakt-Telefonnummer, Tracking-Event `lead_submitted` als `window.dataLayer.push` (GTM-ready, GTM-Container wird noch nicht eingebunden — nur die `dataLayer`-Pushs an allen Events).

## Tracking-Vorbereitung

Reine `dataLayer.push`-Events an den im Briefing genannten Stellen: `form_started`, `step_completed` (mit Step-Nummer), `lead_submitted`, `invoice_uploaded`. Kein GTM-/GA-/Pixel-Snippet wird noch nicht eingebaut (kommt mit Phase 2, wenn IDs vorhanden sind).

## Technisches

- Stack wie vorgegeben: TanStack Start + React 19 + Tailwind v4 + shadcn/ui-Komponenten (Button, Input, Label, RadioGroup, Checkbox, Accordion, Progress, Card)
- Framer Motion für dezente Section-Reveal- und Step-Transition-Animationen
- Zod für Schema-Validierung, eine `leadSchema.ts` als Single Source of Truth (clientseitig + serverseitig)
- Design-Tokens in `src/styles.css` unter `@theme` (Dunkelblau, Grün, Neutralpalette)
- Lighthouse-Ziel: Performance ≥ 90 mobile, A11y ≥ 95

## Was NICHT in Phase 1 enthalten ist

Mitarbeiter-Dashboard, Auth/Rollen, Lead-Status-System, Notizen, Angebots-/Vertrags-Generator, PDF-Signatur, E-Mail-Automationen, Lead-Scoring, Admin-Statistiken, GTM/GA/Pixel-Snippets, Storage für Rechnungen. Datenmodell-Vorbereitung dafür ist im Formular-Schema bereits enthalten, damit Migration in Phase 2 trivial wird.

## Phase 2 (zur späteren Anstoßung)

Lovable Cloud aktivieren → `customers`/`leads`/`lead_notes`/`lead_status_history`/`email_logs`/`documents`/`offers`/`employees`/`providers`/`tariffs` Tabellen + RLS + `user_roles`-Enum (admin/manager/employee) + Dashboard unter `/_authenticated/*` + E-Mail-Versand + Storage-Bucket für Rechnungen + Lead-Scoring-Funktion + Statistiken. Wird gestartet, sobald Phase 1 live und abgenommen ist.
