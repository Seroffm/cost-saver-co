import type { LeadStatus, LeadType, Role } from "./mock-leads";

// ---------------------------------------------------------------------------
// Backend-Typen (Supabase-Schema)
// ---------------------------------------------------------------------------

export type BackendUserRole = "employee" | "manager" | "admin";

export type BackendLeadStatus =
  | "new"
  | "in_review"
  | "question_open"
  | "offer_created"
  | "offer_sent"
  | "interested"
  | "contract_prepared"
  | "contract_sent"
  | "completed"
  | "rejected"
  | "unreachable"
  | "follow_up"
  | "disqualified"
  | "lost";

export type BackendProductType = "electricity" | "gas" | "both";
export type BackendCustomerType =
  | "private"
  | "business"
  | "property_management"
  | "multi_location_company";

export interface BackendLead {
  id: string;
  lead_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: BackendLeadStatus;
  score: number;
  score_label: "cold" | "warm" | "hot";
  product_type: BackendProductType;
  customer_type: BackendCustomerType;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendAddress {
  id: string;
  lead_id: string;
  address_type: "delivery" | "billing" | "contact";
  street: string | null;
  house_number: string | null;
  address_addition: string | null;
  postal_code: string | null;
  city: string | null;
  state: string | null;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface BackendEnergyDemand {
  id: string;
  lead_id: string;
  energy_type: "electricity" | "gas";
  annual_consumption_kwh: number | null;
  consumption_known: boolean | null;
  household_size: number | null;
  living_area_sqm: number | null;
  heating_type: string | null;
  hot_water_with_gas: boolean | null;
  current_provider: string | null;
  current_tariff: string | null;
  monthly_payment: number | null;
  contract_end_date: string | null;
  meter_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendLeadDetail extends BackendLead {
  addresses?: BackendAddress[];
  energy_demands?: BackendEnergyDemand[];
}

export interface BackendNote {
  id: string;
  lead_id: string;
  created_by: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface BackendDocument {
  id: string;
  lead_id: string;
  uploaded_by: string;
  document_type: string;
  file_name: string;
  storage_path: string;
  storage_bucket: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  ocr_status: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendCommunication {
  id: string;
  lead_id: string;
  offer_id: string | null;
  created_by: string;
  communication_type: "email" | "call" | "sms" | "system";
  direction: "inbound" | "outbound" | "internal";
  subject: string | null;
  content_summary: string | null;
  status: "pending" | "success" | "failed";
  external_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendOffer {
  id: string;
  lead_id: string;
  energy_demand_id: string | null;
  created_by: string;
  offer_number: string;
  version: number;
  provider_name: string;
  tariff_name: string;
  energy_type: "electricity" | "gas";
  monthly_price: number | null;
  annual_price: number | null;
  estimated_savings: number | null;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired" | "superseded";
  valid_until: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendStatusHistory {
  id: string;
  lead_id: string;
  old_status: BackendLeadStatus | null;
  new_status: BackendLeadStatus;
  changed_by: string;
  reason: string | null;
  created_at: string;
}

export interface BackendProfile {
  profileId: string;
  authUserId: string;
  role: BackendUserRole;
  full_name: string;
  email: string;
  is_active: boolean;
}

export interface BackendListResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
}

export interface BackendSingleResponse<T> {
  data: T;
}

// ---------------------------------------------------------------------------
// Mapping: Backend → Frontend
// ---------------------------------------------------------------------------

export function mapRole(backendRole: BackendUserRole): Role {
  return backendRole === "employee" ? "mitarbeiter" : backendRole;
}

export function mapLeadStatus(s: BackendLeadStatus): LeadStatus {
  const map: Record<BackendLeadStatus, LeadStatus> = {
    new: "neu",
    in_review: "in_pruefung",
    question_open: "rueckfrage",
    offer_created: "angebot_erstellt",
    offer_sent: "angebot_gesendet",
    interested: "interessiert",
    contract_prepared: "vertrag_vorbereitet",
    contract_sent: "vertrag_gesendet",
    completed: "abgeschlossen",
    rejected: "abgelehnt",
    unreachable: "nicht_erreichbar",
    follow_up: "wiedervorlage",
    disqualified: "abgelehnt",
    lost: "abgelehnt",
  };
  return map[s] ?? "neu";
}

export function mapLeadStatusToBackend(s: LeadStatus): BackendLeadStatus {
  const map: Record<LeadStatus, BackendLeadStatus> = {
    neu: "new",
    in_pruefung: "in_review",
    rueckfrage: "question_open",
    angebot_erstellt: "offer_created",
    angebot_gesendet: "offer_sent",
    interessiert: "interested",
    vertrag_vorbereitet: "contract_prepared",
    vertrag_gesendet: "contract_sent",
    abgeschlossen: "completed",
    abgelehnt: "rejected",
    nicht_erreichbar: "unreachable",
    wiedervorlage: "follow_up",
  };
  return map[s] ?? "new";
}

export function mapLeadType(
  productType: BackendProductType,
  customerType: BackendCustomerType,
): LeadType {
  if (
    customerType === "business" ||
    customerType === "property_management" ||
    customerType === "multi_location_company"
  ) {
    return "gewerbe";
  }
  switch (productType) {
    case "electricity":
      return "strom";
    case "gas":
      return "gas";
    case "both":
      return "strom_gas";
  }
}

export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
