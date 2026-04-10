import { Bundle, ResourceType, BaseResource } from "./fhir";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8100";


function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  const raw = localStorage.getItem("corex-tokens");
  if (!raw) return { access: null, refresh: null };
  try {
    return JSON.parse(raw) as { access: string; refresh: string };
  } catch {
    return { access: null, refresh: null };
  }
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("corex-tokens", JSON.stringify({ access, refresh }));
}

export function clearTokens() {
  localStorage.removeItem("corex-tokens");
}

async function refreshAccessToken(): Promise<string | null> {
  const { refresh } = getTokens();
  if (!refresh) return null;
  try {
    const res = await fetch(`${API_BASE}/dashboard/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    setTokens(data.access, refresh);
    return data.access;
  } catch {
    return null;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { access } = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (access) headers["Authorization"] = `Bearer ${access}`;

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && access) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } else {
      clearTokens();
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──

export interface LoginResponse {
  access: string;
  refresh: string;
  user: DashboardUser;
}

export interface DashboardUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone: string;
  vendor: string | null;
  is_active: boolean;
  last_activity: string | null;
  date_joined: string;
}

export function login(username: string, password: string) {
  return apiFetch<LoginResponse>("/dashboard/auth/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ── Dashboard Stats ──

export interface DashboardStats {
  total_records: number;
  total_households: number;
  records_pulled: number;
  active_vendors: number;
  total_vendors: number;
  api_uptime_pct: number;
  submissions_count: number;
  downloads_count: number;
}

export function fetchStats() {
  return apiFetch<DashboardStats>("/dashboard/stats/");
}

// ── Trends ──

export interface TrendPoint {
  date: string;
  households: number;
  persons: number;
}

export function fetchTrends(start?: string, end?: string) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  const qs = params.toString();
  return apiFetch<{ series: TrendPoint[] }>(`/dashboard/trends/${qs ? `?${qs}` : ""}`);
}

// ── Activities ──

export interface ActivityItem {
  activity_id: string;
  timestamp: string;
  tool: string;
  action: string;
  status: string;
  method: string;
  path: string;
  status_code: number;
}

export interface PaginatedActivities {
  results: ActivityItem[];
  total: number;
  page: number;
  limit: number;
}

export function fetchActivities(page = 1, limit = 20) {
  return apiFetch<PaginatedActivities>(`/dashboard/activities/?page=${page}&limit=${limit}`);
}

// ── Onboarding ──

export interface OnboardingStatus {
  steps: {
    account_created: boolean;
    vendor_assigned: boolean;
    token_generated: boolean;
    first_api_call: boolean;
  };
  completed: number;
  total: number;
  progress_pct: number;
}

export function fetchOnboarding() {
  return apiFetch<OnboardingStatus>("/dashboard/onboarding/");
}

// ── Vendors ──

export interface Vendor {
  id: string;
  name: string;
  contact_email: string;
  token_prefix: string;
  can_write_back: boolean;
  status: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export function fetchVendors() {
  return apiFetch<Vendor[]>("/dashboard/vendors/");
}

export function fetchVendor(id: string) {
  return apiFetch<Vendor>(`/dashboard/vendors/${id}/`);
}

export function createVendor(data: { name: string; contact_email: string; can_write_back?: boolean; status?: string }) {
  return apiFetch<Vendor>("/dashboard/vendors/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateVendor(id: string, data: Partial<Vendor>) {
  return apiFetch<Vendor>(`/dashboard/vendors/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// ── Vendor Stats ──

export interface VendorStats {
  vendor_id: string;
  uploads: number;
  downloads: number;
  total_requests: number;
  error_count: number;
  uptime_pct: number;
}

export function fetchVendorStats(id: string) {
  return apiFetch<VendorStats>(`/dashboard/vendors/${id}/stats/`);
}

// ── Vendor Activities ──

export interface VendorActivity {
  timestamp: string;
  method: string;
  path: string;
  status_code: number;
}

export function fetchVendorActivities(id: string, page = 1, limit = 20) {
  return apiFetch<{ results: VendorActivity[]; total: number; page: number; limit: number }>(
    `/dashboard/vendors/${id}/activities/?page=${page}&limit=${limit}`
  );
}

// ── Generate Token ──

export interface GeneratedToken {
  token: string;
  token_prefix: string;
  warning: string;
}

export function generateVendorToken(id: string) {
  return apiFetch<GeneratedToken>(`/dashboard/vendors/${id}/generate-token/`, {
    method: "POST",
  });
}

// ── Users ──

export function fetchUsers() {
  return apiFetch<DashboardUser[]>("/dashboard/users/");
}

export function fetchUser(id: string) {
  return apiFetch<DashboardUser>(`/dashboard/users/${id}/`);
}

export function createUser(data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  phone?: string;
  password: string;
  vendor?: string;
}) {
  return apiFetch<DashboardUser>("/dashboard/users/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateUser(id: string, data: Partial<DashboardUser>) {
  return apiFetch<DashboardUser>(`/dashboard/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: string) {
  return apiFetch<void>(`/dashboard/users/${id}/`, { method: "DELETE" });
}

// ── FHIR ──

export function fetchFHIR<T = BaseResource>(resourceType: ResourceType, params?: Record<string, string>) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
  return apiFetch<Bundle<T>>(`/fhir/${resourceType}${qs}`);
}

export function fetchFHIRResource<T = BaseResource>(resourceType: ResourceType, id: string) {
  return apiFetch<T>(`/fhir/${resourceType}/${id}`);
}

