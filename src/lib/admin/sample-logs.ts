/**
 * Synthetic activity log for the statistics screen. No visitor is tracked:
 * every row is generated from a fixed formula with example.com emails and
 * documentation-only IP ranges (RFC 5737).
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

/** Fixed "today" so server and browser render the same sample data. */
export const SAMPLE_TODAY = new Date("2026-11-21T23:59:59Z");

const AGENTS = [
  "Chrome 131 · Android 14",
  "Safari 18 · iOS 18",
  "Firefox 133 · Windows 11",
  "Edge 131 · Windows 10",
  "Brave 1.73 · Android 13",
];
const ACTIONS: LogAction[] = ["View", "View", "Download", "View", "Login", "Download"];
const NETS = ["192.0.2", "198.51.100", "203.0.113"];

let cache: LogEntry[] | null = null;

export function getSampleLogs(): LogEntry[] {
  if (cache) return cache;
  const rows: LogEntry[] = [];
  for (let i = 0; i < 72; i++) {
    const daysAgo = (i * 7) % 30;
    const hour = (i * 5 + 8) % 24;
    const minute = (i * 13) % 60;
    const d = new Date(SAMPLE_TODAY);
    d.setUTCDate(d.getUTCDate() - daysAgo);
    d.setUTCHours(hour, minute, 0, 0);
    const user = (i * 3) % 17;
    rows.push({
      id: i + 1,
      email: `demo.user${String(user + 1).padStart(2, "0")}@example.com`,
      timestamp: d.toISOString(),
      action: ACTIONS[i % ACTIONS.length] ?? "View",
      ip: `${NETS[user % NETS.length] ?? NETS[0]}.${10 + user * 7}`,
      userAgent: AGENTS[i % AGENTS.length] ?? "Unknown",
    });
  }
  rows.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  cache = rows;
  return rows;
}

export type RangeFilter =
  | { kind: "7d" }
  | { kind: "30d" }
  | { kind: "custom"; from: string; to: string }; // yyyy-mm-dd

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function shiftDay(days: number) {
  const d = new Date(SAMPLE_TODAY);
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
