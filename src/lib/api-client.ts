import { supabase } from "./supabase";
import type {
  BackendLead,
  BackendLeadDetail,
  BackendNote,
  BackendDocument,
  BackendCommunication,
  BackendOffer,
  BackendStatusHistory,
  BackendProfile,
  BackendListResponse,
  BackendSingleResponse,
  BackendLeadStatus,
} from "./api-types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const qs = params
    ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : "";
  const res = await fetch(`${API_BASE}${path}${qs}`, {
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? res.statusText, body.code);
  }
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  return res.json();
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// /api/me
// ---------------------------------------------------------------------------

export async function getMe(): Promise<BackendProfile> {
  const res = await get<BackendSingleResponse<BackendProfile>>("/api/me");
  return res.data;
}

// ---------------------------------------------------------------------------
// /api/leads
// ---------------------------------------------------------------------------

export async function getLeads(params?: {
  page?: number;
  pageSize?: number;
}): Promise<BackendListResponse<BackendLead>> {
  return get("/api/leads", {
    ...(params?.page ? { page: params.page } : {}),
    ...(params?.pageSize ? { pageSize: params.pageSize } : {}),
  });
}

export async function getLead(id: string): Promise<BackendLeadDetail> {
  const res = await get<BackendSingleResponse<BackendLeadDetail>>(`/api/leads/${id}`);
  return res.data;
}

export async function patchLeadStatus(
  id: string,
  status: BackendLeadStatus,
  reason?: string,
): Promise<void> {
  await patch(`/api/leads/${id}/status`, { status, reason });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/notes
// ---------------------------------------------------------------------------

export async function getNotes(leadId: string): Promise<BackendListResponse<BackendNote>> {
  return get(`/api/leads/${leadId}/notes`, { pageSize: 100 });
}

export async function postNote(leadId: string, note: string): Promise<BackendNote> {
  const res = await post<BackendSingleResponse<BackendNote>>(`/api/leads/${leadId}/notes`, {
    note,
  });
  return res.data;
}

// ---------------------------------------------------------------------------
// /api/leads/:id/documents
// ---------------------------------------------------------------------------

export async function getDocuments(leadId: string): Promise<BackendListResponse<BackendDocument>> {
  return get(`/api/leads/${leadId}/documents`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/communications
// ---------------------------------------------------------------------------

export async function getCommunications(
  leadId: string,
): Promise<BackendListResponse<BackendCommunication>> {
  return get(`/api/leads/${leadId}/communications`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/offers
// ---------------------------------------------------------------------------

export async function getOffers(leadId: string): Promise<BackendListResponse<BackendOffer>> {
  return get(`/api/leads/${leadId}/offers`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/leads/:id/status-history
// ---------------------------------------------------------------------------

export async function getStatusHistory(
  leadId: string,
): Promise<BackendListResponse<BackendStatusHistory>> {
  return get(`/api/leads/${leadId}/status-history`, { pageSize: 100 });
}

// ---------------------------------------------------------------------------
// /api/public/leads  (kein Auth – Turnstile-Token erforderlich)
// ---------------------------------------------------------------------------

export async function submitPublicLead(payload: Record<string, unknown>): Promise<{
  lead_id: string;
  lead_number: string;
}> {
  const res = await fetch(`${API_BASE}/api/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error ?? res.statusText, err.code);
  }
  const body = await res.json();
  return body.data;
}
