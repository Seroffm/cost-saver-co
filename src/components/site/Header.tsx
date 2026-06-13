import { Link } from "@tanstack/react-router";
import { Zap, Phone, UserPlus, Smartphone, User, ChevronDown, Menu, X, Flame, Sun, PlugZap, Home, Building2, Car, Battery, Wrench, HelpCircle, FileText, Mail, Users, Award, Leaf, ArrowRight } from "lucide-react";
import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DropdownLink = { to: string; label: string; desc: string; icon: React.ComponentType<{ className?: string }> };
type DropdownContent = { intro?: { title: string; text: string; cta: { to: string; label: string } }; links: DropdownLink[] };
type NavItem = { to: string; label: string; highlight?: boolean; dropdown?: DropdownContent };

const mainNav: NavItem[] = [
  {
    to: "/angebot",
    label: "Strom",
    dropdown: {
      intro: { title: "Strom vergleichen", text: "Bis zu 850 € pro Jahr sparen mit geprüften Anbietern.", cta: { to: "/angebot", label: "Jetzt vergleichen" } },
      links: [
        { to: "/angebot", label: "Haushaltsstrom", desc: "Klassischer Stromtarif für zuhause", icon: Home },
        { to: "/angebot", label: "Ökostrom", desc: "100 % erneuerbare Energie", icon: Leaf },
        { to: "/angebot", label: "Autostrom", desc: "Spezialtarif für E-Autos", icon: Car },
        { to: "/angebot", label: "Wärmestrom", desc: "Für Wärmepumpe & Nachtspeicher", icon: Battery },
      ],
    },
  },
  {
    to: "/angebot",
    label: "Gas",
    dropdown: {
      intro: { title: "Gas vergleichen", text: "Faire Gaspreise — transparent und ohne Lockangebote.", cta: { to: "/angebot", label: "Tarife ansehen" } },
      links: [
        { to: "/angebot", label: "Erdgas Privat", desc: "Günstige Tarife für Haushalte", icon: Flame },
        { to: "/angebot", label: "Gas Gewerbe", desc: "Sondervertrag für Unternehmen", icon: Building2 },
        { to: "/angebot", label: "Bio-Erdgas", desc: "Klimaneutral mit CO₂-Ausgleich", icon: Leaf },
      ],
    },
  },
  {
    to: "/angebot",
    label: "Strom + Gas",
    highlight: true,
    dropdown: {
      intro: { title: "Doppel-Bonus sichern", text: "Strom & Gas kombinieren und doppelt sparen.", cta: { to: "/angebot", label: "Bundle berechnen" } },
      links: [
        { to: "/angebot", label: "Komfort-Bundle", desc: "Beide Verträge aus einer Hand", icon: PlugZap },
        { to: "/angebot", label: "Familien-Tarif", desc: "Optimiert für 3+ Personen", icon: Users },
        { to: "/angebot", label: "Öko-Komplett", desc: "100 % grün — Strom & Gas", icon: Leaf },
      ],
    },
  },
  {
    to: "/angebot",
    label: "Solar",
    dropdown: {
      intro: { title: "Eigenen Strom erzeugen", text: "Photovoltaik, Speicher und Wallbox — alles aus einer Hand.", cta: { to: "/kontakt", label: "Beratung anfragen" } },
      links: [
        { to: "/kontakt", label: "PV-Anlage", desc: "Planung, Montage, Inbetriebnahme", icon: Sun },
        { to: "/kontakt", label: "Stromspeicher", desc: "Unabhängig auch nachts", icon: Battery },
        { to: "/kontakt", label: "Wallbox", desc: "E-Auto zuhause laden", icon: Car },
      ],
    },
  },
  { to: "/faq", label: "Wissen" },
  {
    to: "/kontakt",
    label: "Service",
    dropdown: {
      links: [
        { to: "/kontakt", label: "Kontakt", desc: "Schreib uns eine Nachricht", icon: Mail },
        { to: "/faq", label: "Hilfe & FAQ", desc: "Antworten auf häufige Fragen", icon: HelpCircle },
        { to: "/kontakt", label: "Wechsel-Service", desc: "Wir übernehmen die Kündigung", icon: Wrench },
        { to: "/kontakt", label: "Dokumente", desc: "Verträge & Bescheinigungen", icon: FileText },
      ],
    },
  },
  {
    to: "/ueber-uns",
    label: "Über uns",
    dropdown: {
      links: [
        { to: "/ueber-uns", label: "Unser Team", desc: "Menschen hinter EnergieClever", icon: Users },
        { to: "/ueber-uns", label: "Auszeichnungen", desc: "TÜV, Trusted Shops & mehr", icon: Award },
        { to: "/ueber-uns", label: "Nachhaltigkeit", desc: "Unser Beitrag zur Energiewende", icon: Leaf },
      ],
    },
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 120);
  };

  const activeItem = mainNav.find((n) => n.label === openKey && n.dropdown);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top utility row */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3 md:py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-extrabold text-primary">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-success text-success-foreground shadow-soft">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight">EnergieClever</span>
          </Link>

          <div />

          {/* Right utilities */}
          <div className="flex items-center gap-1 md:gap-5">
            <a href="tel:08001234567" className="hidden items-center gap-2 text-sm font-semibold text-primary transition hover:text-success md:inline-flex">
              <Phone className="h-4 w-4 text-success" />
              <span>0800 123 4567</span>
            </a>
            <Link to="/kontakt" className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex">
              <UserPlus className="h-4 w-4 text-success" />
              <span>Freunde werben</span>
            </Link>
            <Link to="/angebot" className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex">
              <Smartphone className="h-4 w-4 text-success" />
              <span>App</span>
            </Link>
            <Link to="/kontakt" className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex">
              <User className="h-4 w-4 text-success" />
              <span>Login</span>
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Main nav row */}
        <nav
          className="relative hidden h-14 items-center justify-end gap-8 md:flex"
          onMouseLeave={scheduleClose}
        >
          {mainNav.map((n) => {
            const isOpen = openKey === n.label && !!n.dropdown;
            return (
              <div
                key={n.label}
                onMouseEnter={() => (n.dropdown ? open(n.label) : scheduleClose())}
                onFocus={() => (n.dropdown ? open(n.label) : scheduleClose())}
                className="relative"
              >
                <Link
                  to={n.to}
                  className={cn(
                    "group inline-flex items-center gap-1 text-sm transition",
                    n.highlight ? "font-bold text-primary" : "font-medium text-primary hover:text-success",
                    isOpen && "text-success",
                  )}
                  activeProps={{ className: "font-bold text-primary" }}
                >
                  {n.highlight && <span className="mr-1 h-2 w-2 rounded-full bg-success" aria-hidden />}
                  <span>{n.label}</span>
                  {n.dropdown && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-success",
                      )}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Mega dropdown panel */}
      <AnimatePresence>
        {activeItem?.dropdown && (
          <motion.div
            key={activeItem.label}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => open(activeItem.label)}
            onMouseLeave={scheduleClose}
            className="absolute left-0 right-0 top-full hidden border-b border-border bg-background shadow-lg md:block"
          >
            <div className="mx-auto max-w-6xl px-4 py-8">
              <div className={cn("grid gap-8", activeItem.dropdown.intro ? "md:grid-cols-[1fr_2fr]" : "md:grid-cols-1")}>
                {activeItem.dropdown.intro && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="rounded-2xl bg-muted/60 p-6"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-success">{activeItem.label}</div>
                    <h3 className="mt-2 text-xl font-bold text-primary">{activeItem.dropdown.intro.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{activeItem.dropdown.intro.text}</p>
                    <Link
                      to={activeItem.dropdown.intro.cta.to}
                      onClick={() => setOpenKey(null)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success hover:gap-3 transition-all"
                    >
                      {activeItem.dropdown.intro.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )}

                <div className="grid gap-2 sm:grid-cols-2">
                  {activeItem.dropdown.links.map((link, i) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.04 * i }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setOpenKey(null)}
                          className="group flex items-start gap-3 rounded-xl p-3 transition hover:bg-muted/60"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-success/10 text-success transition group-hover:bg-success group-hover:text-success-foreground">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-primary">{link.label}</span>
                            <span className="block text-xs text-muted-foreground">{link.desc}</span>
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {mainNav.map((n) => (
                <MobileNavItem key={n.label} item={n} onNavigate={() => setMobileOpen(false)} />
              ))}
              <div className="grid grid-cols-2 gap-2 py-4">
                <a href="tel:08001234567" className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-primary">
                  <Phone className="h-4 w-4 text-success" /> Anrufen
                </a>
                <Link to="/angebot" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-3 py-2 text-sm font-semibold text-success-foreground">
                  Jetzt vergleichen
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  if (!item.dropdown) {
    return (
      <Link
        to={item.to}
        onClick={onNavigate}
        className="flex items-center justify-between border-b border-border py-3 text-sm font-medium text-primary"
      >
        <span className="flex items-center gap-2">
          {item.highlight && <span className="h-2 w-2 rounded-full bg-success" />}
          {item.label}
        </span>
      </Link>
    );
  }
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-sm font-medium text-primary"
      >
        <span className="flex items-center gap-2">
          {item.highlight && <span className="h-2 w-2 rounded-full bg-success" />}
          {item.label}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", open && "rotate-180 text-success")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-3 pl-4">
              {item.dropdown.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-lg py-2 text-sm text-muted-foreground hover:text-success"
                >
                  <link.icon className="h-4 w-4 text-success" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
