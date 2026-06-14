import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Leaf, Shield, Star, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { tariffs, providers } from "@/lib/mock-leads";

export const Route = createFileRoute("/tarife")({
  head: () => ({
    meta: [
      { title: "Strom- & Gastarife im Vergleich | EnergieClever" },
      { name: "description", content: "Aktuelle Strom- und Gastarife geprüfter Anbieter im transparenten Vergleich. Preisgarantie, Ökostrom, Vertragslaufzeit auf einen Blick." },
      { property: "og:title", content: "Strom- & Gastarife im Vergleich | EnergieClever" },
      { property: "og:description", content: "Aktuelle Tarife geprüfter Anbieter im transparenten Vergleich." },
    ],
  }),
  component: TarifePage,
});

type Kind = "alle" | "strom" | "gas";
type Segment = "alle" | "privat" | "gewerbe";

function TarifePage() {
  const [kind, setKind] = useState<Kind>("alle");
  const [segment, setSegment] = useState<Segment>("alle");
  const [ecoOnly, setEcoOnly] = useState(false);
  const [q, setQ] = useState("");
  const [kwh, setKwh] = useState(3000);

  const filtered = useMemo(() => {
    return tariffs.filter((t) => {
      if (kind !== "alle" && t.type !== kind) return false;
      if (segment !== "alle" && t.segment !== segment) return false;
      if (ecoOnly && !t.eco) return false;
      if (q && !(`${t.name} ${t.provider}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    }).map((t) => {
      const yearly = (t.pricePerKwh / 100) * kwh + t.basePrice * 12;
      return { ...t, yearly };
    }).sort((a, b) => a.yearly - b.yearly);
  }, [kind, segment, ecoOnly, q, kwh]);

  return (
    <SiteLayout>
      <section className="border-b bg-gradient-to-b from-success/5 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <BadgeCheck className="h-3.5 w-3.5" /> Transparenter Tarifvergleich
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
            Aktuelle Strom- & Gastarife
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Ein Auszug aus unseren über 1.200 geprüften Tarifen. Vergleichen Sie Preis pro kWh, Grundpreis, Laufzeit und Preisgarantie auf einen Blick.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-card p-5 shadow-soft md:p-6">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Suche</label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Anbieter oder Tarifname…" className="pl-9" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Energieart</label>
              <div className="mt-1.5 flex rounded-md border p-0.5">
                {(["alle", "strom", "gas"] as Kind[]).map((k) => (
                  <button key={k} onClick={() => setKind(k)} className={`px-3 py-1.5 text-sm font-medium rounded ${kind === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {k === "alle" ? "Alle" : k[0].toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Segment</label>
              <div className="mt-1.5 flex rounded-md border p-0.5">
                {(["alle", "privat", "gewerbe"] as Segment[]).map((s) => (
                  <button key={s} onClick={() => setSegment(s)} className={`px-3 py-1.5 text-sm font-medium rounded ${segment === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {s[0].toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={ecoOnly} onChange={(e) => setEcoOnly(e.target.checked)} className="h-4 w-4" />
                <Leaf className="h-4 w-4 text-success" /> Nur Ökotarife
              </label>
            </div>
          </div>
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jahresverbrauch · {kwh.toLocaleString("de-DE")} kWh
            </label>
            <input type="range" min={500} max={50000} step={100} value={kwh} onChange={(e) => setKwh(Number(e.target.value))} className="mt-2 w-full" />
          </div>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">{filtered.length} Tarife gefunden – sortiert nach jährlichen Gesamtkosten</div>

        <div className="mt-4 grid gap-4">
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="grid items-center gap-4 rounded-2xl border bg-card p-5 shadow-soft md:grid-cols-[1.4fr_1fr_1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-display text-lg font-bold text-primary">{t.provider}</div>
                  <Badge variant="outline">{t.type === "strom" ? "Strom" : "Gas"}</Badge>
                  <Badge variant="outline">{t.segment === "privat" ? "Privat" : "Gewerbe"}</Badge>
                  {t.eco && <Badge className="bg-success/15 text-success border-0"><Leaf className="mr-1 h-3 w-3" />Öko</Badge>}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{t.name}</div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span><Shield className="mr-1 inline h-3 w-3" />{t.priceGuarantee} Monate Preisgarantie</span>
                  <span>{t.duration} Monate Laufzeit</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="text-muted-foreground">Arbeitspreis</div>
                <div className="text-lg font-semibold text-primary">{t.pricePerKwh.toFixed(2)} ct/kWh</div>
                <div className="text-xs text-muted-foreground">Grundpreis {t.basePrice.toFixed(2)} €/Monat</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Geschätzte Jahreskosten</div>
                <div className="font-display text-2xl font-extrabold text-success">{t.yearly.toFixed(0)} €</div>
                <div className="text-xs text-muted-foreground">bei {kwh.toLocaleString("de-DE")} kWh</div>
              </div>
              <Button asChild className="bg-success text-success-foreground hover:bg-success/90">
                <Link to="/angebot">Beraten lassen <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              Keine Tarife passen zu deinem Filter.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-display text-2xl font-bold text-primary">Unsere Partner-Anbieter</h2>
        <p className="mt-2 text-muted-foreground">Eine Auswahl der über 80 geprüften Versorger, mit denen wir zusammenarbeiten.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {providers.map((p) => (
            <div key={p.id} className="rounded-xl border bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-primary">{p.name}</div>
                {p.partner && <Badge className="bg-success/15 text-success border-0">Partner</Badge>}
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {p.rating.toFixed(1)} · {p.tariffsCount} Tarife
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
