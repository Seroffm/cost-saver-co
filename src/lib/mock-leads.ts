export type LeadStatus = "neu" | "in_bearbeitung" | "angebot_gesendet" | "vertrag_gesendet" | "abgeschlossen" | "verloren";
export type LeadType = "strom" | "gas" | "strom_gas" | "gewerbe";

export const statusLabel: Record<LeadStatus, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  angebot_gesendet: "Angebot gesendet",
  vertrag_gesendet: "Vertrag gesendet",
  abgeschlossen: "Abgeschlossen",
  verloren: "Verloren",
};

export const statusColor: Record<LeadStatus, string> = {
  neu: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  in_bearbeitung: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  angebot_gesendet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  vertrag_gesendet: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  abgeschlossen: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  verloren: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export const typeLabel: Record<LeadType, string> = {
  strom: "Strom",
  gas: "Gas",
  strom_gas: "Strom + Gas",
  gewerbe: "Gewerbe",
};

export interface LeadNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  plz: string;
  type: LeadType;
  consumption: number; // kWh
  currentProvider: string;
  monthlyPayment: number; // EUR
  status: LeadStatus;
  score: number; // 0-100
  assignee: string;
  createdAt: string;
  expectedSavings: number;
  source: string;
  hasInvoice: boolean;
  notes: LeadNote[];
}

export const leads: Lead[] = [
  {
    id: "L-2026-0412",
    name: "Markus Hoffmann",
    email: "m.hoffmann@example.de",
    phone: "+49 175 1234567",
    city: "Köln",
    plz: "50667",
    type: "strom_gas",
    consumption: 5800,
    currentProvider: "RheinEnergie",
    monthlyPayment: 189,
    status: "neu",
    score: 87,
    assignee: "Sarah Becker",
    createdAt: "2026-06-14T09:21:00",
    expectedSavings: 624,
    source: "Google Ads",
    hasInvoice: true,
    notes: [],
  },
  {
    id: "L-2026-0411",
    name: "Anna Weber",
    email: "anna.weber@example.de",
    phone: "+49 160 9988776",
    city: "Düsseldorf",
    plz: "40213",
    type: "strom",
    consumption: 3400,
    currentProvider: "E.ON",
    monthlyPayment: 98,
    status: "in_bearbeitung",
    score: 72,
    assignee: "Sarah Becker",
    createdAt: "2026-06-14T08:05:00",
    expectedSavings: 312,
    source: "Direkt",
    hasInvoice: false,
    notes: [
      { id: "n1", author: "Sarah Becker", date: "2026-06-14T10:00:00", text: "Erstkontakt erfolgreich, Rückruf für morgen 14:00 vereinbart." },
    ],
  },
  {
    id: "L-2026-0410",
    name: "Bäckerei Krüger GmbH",
    email: "info@baeckerei-krueger.de",
    phone: "+49 221 5544332",
    city: "Köln",
    plz: "50823",
    type: "gewerbe",
    consumption: 42000,
    currentProvider: "Vattenfall",
    monthlyPayment: 1240,
    status: "angebot_gesendet",
    score: 95,
    assignee: "Daniel Kraus",
    createdAt: "2026-06-13T15:42:00",
    expectedSavings: 4820,
    source: "Empfehlung",
    hasInvoice: true,
    notes: [
      { id: "n1", author: "Daniel Kraus", date: "2026-06-13T16:30:00", text: "Hoher Verbrauch, sehr gute Ersparnis möglich. Angebot mit 24-Monate-Preisgarantie verschickt." },
    ],
  },
  {
    id: "L-2026-0409",
    name: "Sophia Lang",
    email: "sophia.l@example.de",
    phone: "+49 152 3344556",
    city: "Bonn",
    plz: "53111",
    type: "gas",
    consumption: 18000,
    currentProvider: "Stadtwerke Bonn",
    monthlyPayment: 175,
    status: "vertrag_gesendet",
    score: 81,
    assignee: "Mira Aydin",
    createdAt: "2026-06-12T11:18:00",
    expectedSavings: 540,
    source: "Meta Ads",
    hasInvoice: true,
    notes: [],
  },
  {
    id: "L-2026-0408",
    name: "Thomas Richter",
    email: "t.richter@example.de",
    phone: "+49 171 2233445",
    city: "Leverkusen",
    plz: "51373",
    type: "strom",
    consumption: 2200,
    currentProvider: "EnBW",
    monthlyPayment: 71,
    status: "abgeschlossen",
    score: 64,
    assignee: "Sarah Becker",
    createdAt: "2026-06-10T14:02:00",
    expectedSavings: 198,
    source: "SEO",
    hasInvoice: false,
    notes: [
      { id: "n1", author: "Sarah Becker", date: "2026-06-11T09:15:00", text: "Vertrag unterschrieben, Wechseltermin 01.08.2026." },
    ],
  },
  {
    id: "L-2026-0407",
    name: "Julia Maier",
    email: "j.maier@example.de",
    phone: "",
    city: "Aachen",
    plz: "52062",
    type: "strom",
    consumption: 1800,
    currentProvider: "Unbekannt",
    monthlyPayment: 0,
    status: "verloren",
    score: 22,
    assignee: "—",
    createdAt: "2026-06-09T17:31:00",
    expectedSavings: 0,
    source: "Google Ads",
    hasInvoice: false,
    notes: [
      { id: "n1", author: "Daniel Kraus", date: "2026-06-10T08:00:00", text: "Keine Telefonnummer, E-Mail bounced." },
    ],
  },
];

export const employees = [
  { name: "Sarah Becker", role: "Senior Beraterin", closed: 18, open: 12 },
  { name: "Daniel Kraus", role: "Gewerbe-Experte", closed: 14, open: 9 },
  { name: "Mira Aydin", role: "Beraterin", closed: 11, open: 7 },
];

export function getLead(id: string) {
  return leads.find((l) => l.id === id);
}
