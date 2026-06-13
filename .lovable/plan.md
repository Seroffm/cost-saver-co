## Ziel

Die Seite wirkt aktuell generisch (dunkelblauer Fintech-Look). Sie soll wie eine echte Energie-Vergleichsseite aussehen — frisch, hell, mit lebendigem Grün-Akzent (Lichtblick) und einem prominenten Tarifrechner direkt im Hero (Check24).

## Design-Entscheidungen (vom Nutzer gewählt)

- **Palette**: Weiß-Basis, Dunkelblau `#0a1f44` für Text/Headlines, sattes Grün `#00c389` als CTA/Akzent, Hellgrau `#f2f6f4` als Surface
- **Typo**: Sora (Display/Headlines) + Manrope (Body) via Google Fonts (`<link>` in `__root.tsx`)
- **Layout**: Check24-Style — großer Tarifrechner im Hero, Trust-Badges direkt darunter, dann Content-Sektionen

## Was sich konkret ändert

### 1. Design-Tokens (`src/styles.css`)
- Primary → Dunkelblau `#0a1f44` (statt aktuelles OKLCH-Blau)
- Success/Accent → frisches Grün `#00c389` (statt aktuelles Grün, das blasser ist)
- Surface → `#f2f6f4` (warmes Hellgrau-Grün statt kaltem Weiß)
- `--font-display: "Sora"`, `--font-sans: "Manrope"`
- Headlines bekommen `font-display`, härtere Tracking, größere Größen
- Card-Radius leicht reduziert (rounded-xl statt 2xl) → Check24-Anmutung
- Schatten weicher, weniger „Fintech-glow"

### 2. Google Fonts laden (`src/routes/__root.tsx`)
- `<link rel="preconnect">` zu fonts.googleapis/gstatic
- Stylesheet-Link für Sora 600/700/800 + Manrope 400/500/600

### 3. Hauptseite `/` (`src/routes/index.tsx`) — komplett überarbeitet
- **Hero (Check24-Style)**: Heller Hintergrund mit dezentem grünen Verlauf, große Sora-Headline „Strom & Gas in 2 Minuten vergleichen", Subline, **Tarif-Schnellrechner direkt im Hero** als breite weiße Karte mit Schatten:
  - Toggle Strom / Gas / Beides (Pills)
  - PLZ-Input + Verbrauch-Select (1500/2500/3500/4500/5500 kWh) + großer grüner Button „Tarife vergleichen" → leitet auf `/angebot?start=…&plz=…&kwh=…`
  - Rechts daneben dezentes „bis zu 850 €/Jahr sparen"-Badge
- **Trust-Leiste** direkt unter Hero (TÜV-Hinweis, DSGVO, kostenlos, geprüfte Anbieter, 4,8/5 Sterne)
- **„So einfach geht's" in 3 Schritten** (Karten mit großen Nummern + Icons, helles Grün)
- **Vorteile-Sektion** (4 Karten: persönliche Beratung, alle Anbieter, kostenlos, sichere Abwicklung)
- **Zielgruppen** (Privat / Gewerbe / Hausverwaltung — Karten mit echten Stock-Bildern via Unsplash-Pattern)
- **Kennzahlen-Band** auf dunkelblauem Grund mit grünen Zahlen (50.000+ Wechsel, Ø 380 € Ersparnis, 4,8★, 100% kostenlos)
- **Testimonials** (3 Karten mit Avatar-Initialen + Sterne)
- **Ratgeber-Teaser** (Magazin-Anmutung: 3 Karten mit Bild, Titel, Lead — verlinken auf `/ablauf`, `/faq`, `/ueber-uns`)
- **FAQ-Accordion** (8 Einträge, ruhig hell)
- **Finaler CTA-Block** auf grünem Verlauf

### 4. Lead-Landingpage `/angebot` (`src/routes/angebot.tsx`) — Politur
- Hero-Bereich: hellerer Hintergrund (Surface statt dunkelblau-getönt), Headline in Sora, Trust-Badge oben mit Sterne-Bewertung
- Formular-Karte: weicherer Schatten, klarere Sektion-Trennung
- Reduzierte Top-Bar bekommt 4,8★-Hinweis neben Telefonnummer
- `useSearch` liest zusätzlich `plz` und `kwh` aus URL und prefilled Schritt 3+4 im `MultiStepForm`

### 5. Header / Footer (`src/components/site/Header.tsx`, `Footer.tsx`)
- Header: weißer Hintergrund, dezenter Bottom-Border, Logo links, schlanke Nav, **grüner CTA-Button rechts** „Jetzt vergleichen"
- Footer: heller (Surface), 4 Spalten (Produkte, Service, Rechtliches, Kontakt), unten Trust-Icons

### 6. MultiStepForm (`src/components/lead/MultiStepForm.tsx`) — visuelle Anpassung
- Progress-Bar grün
- Auswahlkarten mit dickerem Border bei Selektion, Hover mit grünem Tint
- „Weiter"-Button in Grün (`bg-success`)
- Akzeptiert optional `initialPlz` und `initialKwh` Props für URL-Prefill

### 7. Reduzierte Top-Bar auf `/angebot`
- Bleibt schlank, bekommt rechts neben Telefonnummer 4,8★-Mini-Trustbadge

## Was NICHT geändert wird

- Routenstruktur, Schema (`lead-schema.ts`), Server-Function (`submitLead`), Tracking, Validierung — alles Frontend-/Presentation-Layer
- Statische Seiten (`/ablauf`, `/faq`, etc.) bekommen nur den Token-Refresh automatisch mit, kein neuer Content
- Kein Backend, keine Bilder-Uploads — Stock-Bilder via `images.unsplash.com` als externe URLs

## Technisches

- Tailwind v4: alle Farben über `@theme inline` Tokens in `src/styles.css`, keine hardcoded Hex-Werte in Komponenten
- Fonts via `<link>` im Root-Route-`head()`, nicht via `@import` in CSS (Lightning-CSS-konform)
- Framer Motion bleibt für sanfte Section-Reveals
- Lucide-Icons bleiben
