// API client for Cloudflare Workers backend

const API_BASE = "/api";

// Auth token storage - this is just a localStorage key name, not a secret
const AUTH_STORAGE_KEY = "cryptid_admin_auth";

export function getToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Helper for making authenticated requests
async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

// Types matching the backend
export interface Cryptid {
  id: string;
  name: string;
  scientific_name: string;
  location: string;
  region: string;
  last_sighting: string;
  danger_level: "Low" | "Medium" | "High";
  sightings: number;
  description: string;
  image: string;
  tags: string[];
  physical_description: string;
  behavior: string;
  habitat: string;
  diet: string;
  testimonies?: Testimony[];
  timeline?: TimelineEvent[];
}

export interface Testimony {
  id: string;
  cryptid_id: string;
  witness: string;
  date: string;
  location: string;
  account: string;
}

export interface TimelineEvent {
  id: string;
  cryptid_id: string;
  year: string;
  event: string;
  location: string;
}

export interface SightingReport {
  id: string;
  status: "pending" | "approved" | "rejected";
  witness_name: string;
  email: string;
  date: string;
  time: string;
  location: string;
  state: string;
  creature_name: string;
  description: string;
  physical_description: string;
  behavior: string;
  photo_url: string;
  submitted_at: string;
}

export interface CryptidInput {
  id?: string;
  name: string;
  scientific_name?: string;
  location: string;
  region: string;
  last_sighting?: string;
  danger_level: "Low" | "Medium" | "High";
  sightings?: number;
  description?: string;
  image?: string;
  tags?: string[];
  physical_description?: string;
  behavior?: string;
  habitat?: string;
  diet?: string;
}

export interface SightingInput {
  witness_name: string;
  email: string;
  date: string;
  time?: string;
  location: string;
  state: string;
  creature_name?: string;
  description: string;
  physical_description: string;
  behavior?: string;
  photo_url?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || "An error occurred");
  }

  return data as T;
}

// ==================== AUTH ====================

export async function login(apiKey: string): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });

  const data = await handleResponse<{ success: boolean; token: string }>(
    response
  );
  setToken(data.token);
  return { token: data.token };
}

export async function verifyAuth(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetchWithAuth(`${API_BASE}/auth`);
    const data = await response.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export function logout(): void {
  clearToken();
}

// ==================== CRYPTIDS ====================

interface CryptidsListResponse {
  cryptids: Cryptid[];
  count: number;
}

interface CryptidDetailResponse {
  cryptid: Cryptid;
}

export async function getCryptids(params?: {
  region?: string;
  danger_level?: string;
  search?: string;
}): Promise<Cryptid[]> {
  const searchParams = new URLSearchParams();
  if (params?.region) searchParams.set("region", params.region);
  if (params?.danger_level) searchParams.set("danger_level", params.danger_level);
  if (params?.search) searchParams.set("search", params.search);

  const url = `${API_BASE}/cryptids${searchParams.toString() ? `?${searchParams}` : ""}`;
  const response = await fetch(url);
  const data = await handleResponse<CryptidsListResponse>(response);
  return data.cryptids;
}

export async function getCryptid(id: string): Promise<Cryptid> {
  const response = await fetch(`${API_BASE}/cryptids/${id}`);
  const data = await handleResponse<CryptidDetailResponse>(response);
  return data.cryptid;
}

export async function createCryptid(
  cryptid: CryptidInput
): Promise<{ id: string }> {
  const response = await fetchWithAuth(`${API_BASE}/cryptids`, {
    method: "POST",
    body: JSON.stringify(cryptid),
  });
  return handleResponse<{ success: boolean; id: string }>(response);
}

export async function updateCryptid(
  id: string,
  updates: Partial<CryptidInput>
): Promise<{ id: string }> {
  const response = await fetchWithAuth(`${API_BASE}/cryptids/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return handleResponse<{ success: boolean; id: string }>(response);
}

export async function deleteCryptid(id: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/cryptids/${id}`, {
    method: "DELETE",
  });
  await handleResponse<{ success: boolean }>(response);
}

// ==================== SIGHTINGS ====================

interface SightingsListResponse {
  reports: SightingReport[];
  total: number;
  limit: number;
  offset: number;
}

export async function submitSighting(
  sighting: SightingInput
): Promise<{ id: string }> {
  const response = await fetch(`${API_BASE}/sightings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sighting),
  });
  return handleResponse<{ success: boolean; id: string; message: string }>(
    response
  );
}

export async function getSightings(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<SightingsListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());

  const url = `${API_BASE}/sightings${searchParams.toString() ? `?${searchParams}` : ""}`;
  const response = await fetchWithAuth(url);
  return handleResponse<SightingsListResponse>(response);
}

export async function updateSightingStatus(
  id: string,
  status: "pending" | "approved" | "rejected",
  reviewerNotes?: string
): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/sightings/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status, reviewer_notes: reviewerNotes }),
  });
  await handleResponse<{ success: boolean }>(response);
}

export async function deleteSighting(id: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE}/sightings/${id}`, {
    method: "DELETE",
  });
  await handleResponse<{ success: boolean }>(response);
}

// ==================== IMAGE UPLOAD ====================

interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
}

export async function uploadImage(base64Image: string): Promise<string> {
  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });
  const data = await handleResponse<UploadResponse>(response);
  return data.url;
}

export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await handleResponse<UploadResponse>(response);
  return data.url;
}