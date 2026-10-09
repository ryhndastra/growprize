/**
 * Growprize API client.
 *
 * Talks to the friend-provided backend (Express router in gameWebsite.js).
 * Endpoints:
 *   POST /register { growId, email, password } -> { uid, grow_id, email, balance }
 *   POST /login    { growId, email, password } -> { uid, grow_id, email, balance }
 *   GET  /me                                    -> current user (requires session)
 *   POST /logout                                -> { ok: true }
 *
 * Auth uses a server-set session COOKIE (valid ~7 days, HttpOnly). The browser
 * stores and replays it automatically, so every request MUST set
 * credentials:'include'. The token lives only on the backend; we never read or
 * write it from JavaScript, and we never carry the API secret on the client.
 */

/**
 * Base URL of the API.
 *
 * - Development: "/api" (routed through the Vite proxy -> same-origin cookies).
 * - Production:  set VITE_API_BASE_URL to the backend origin, e.g.
 *                https://nexus.gtpscache.site
 *                If unset, we fall back to the known backend origin.
 */
const RAW_BASE = import.meta.env.VITE_API_BASE_URL;
// Gunakan '/api' sebagai default baik di local (via Vite proxy) maupun di Vercel (via vercel.json rewrites)
// agar cookie HttpOnly SameSite=Lax selalu dianggap same-origin oleh browser dan aman saat refresh.
const DEFAULT_ORIGIN = '/api';
const API_BASE_URL = (RAW_BASE && RAW_BASE.length > 0 ? RAW_BASE : DEFAULT_ORIGIN).replace(
  /\/$/,
  ''
);



export interface ApiUser {
  uid: string | number;
  grow_id: string;
  email: string;
  balance: number;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      // Send/receive the 7-day session cookie cross-site.
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
      ...init,
    });
  } catch {
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi Anda.', 0);
  }

  // Try to parse JSON even on error responses for the { error } message.
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ?? `Permintaan gagal (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data as T;
}

/**
 * Log in with GrowID + email + password.
 * The backend requires all three; a mismatch on any of them returns 401.
 */
export async function login(growId: string, email: string, password: string): Promise<ApiUser> {
  return request<ApiUser>('/login', {
    method: 'POST',
    body: JSON.stringify({ growId, email, password }),
  });
}

/** Create a new account, then the backend starts a session (same as login). */
export async function register(growId: string, email: string, password: string): Promise<ApiUser> {
  return request<ApiUser>('/register', {
    method: 'POST',
    body: JSON.stringify({ growId, email, password }),
  });
}

/** Restore an existing 7-day session, if the cookie is still valid. */
export async function fetchMe(): Promise<ApiUser> {
  return request<ApiUser>('/me', { method: 'GET' });
}

/** Destroy the server session and clear the cookie. */
export async function logout(): Promise<void> {
  await request<{ ok: boolean }>('/logout', { method: 'POST' });
}

export interface ApiBackpackItem {
  id: number;
  item_id: number;
  item_name: string;
  count: number;
  worth: number;
  rarity: string;
  color: string;
  updated_at?: string;
}

export interface BackpackResponse {
  items: ApiBackpackItem[];
  totalCount: number;
  totalWorth: number;
}

/** Get user backpack inventory from database. */
export async function fetchBackpack(): Promise<BackpackResponse> {
  return request<BackpackResponse>('/backpack', { method: 'GET' });
}

/** Redeem backpack items directly into the in-game world. */
export async function redeemBackpack(
  items: Array<{ itemId: number; quantity: number }>
): Promise<{ success: boolean; message: string; redeemed: unknown[] }> {
  return request<{ success: boolean; message: string; redeemed: unknown[] }>('/backpack/redeem', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/** Sell backpack items to convert them into user account balance. */
export async function sellBackpack(
  items: Array<{ itemId: number; quantity: number }>
): Promise<{ success: boolean; earned: number; balance: number; message: string; soldItems: unknown[] }> {
  return request<{ success: boolean; earned: number; balance: number; message: string; soldItems: unknown[] }>('/backpack/sell', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });
}

/** Top-up account balance. */
export async function topup(
  amount: number
): Promise<{ success: boolean; message: string; balance: number; addedAmount: number }> {
  return request<{ success: boolean; message: string; balance: number; addedAmount: number }>('/topup', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export interface ApiCaseItem {
  id: string;
  itemId: number;
  name: string;
  count: number;
  worth: number;
  rarity?: string;
  color?: string;
}

export interface ApiCase {
  id: string;
  name?: string;
  price?: number;
  items: ApiCaseItem[];
}

/** Fetch gacha cases configuration from the backend. */
export async function fetchCases(): Promise<{ cases: ApiCase[] }> {
  return request<{ cases: ApiCase[] }>('/cases', { method: 'GET' });
}

export interface RollResult {
  success: boolean;
  item: ApiCaseItem;
  spinCost: number;
  balance: number;
  message: string;
}

/** Perform gacha roll against backend atomic balance transaction. */
export async function rollGacha(caseId: string, itemId: string): Promise<RollResult> {
  return request<RollResult>('/roll', {
    method: 'POST',
    body: JSON.stringify({ caseId, itemId }),
  });
}

/** True when the backend base URL is configured (used for graceful UI hints). */
export const isApiConfigured = API_BASE_URL.length > 0;