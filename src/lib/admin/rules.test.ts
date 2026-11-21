import { describe, expect, it } from "vitest";

import {
  ADMIN_DEMO_TOKEN,
  checkAdminToken,
  validateFileDraft,
  validateNewToken,
  validateTokenChange,
} from "./rules";
import { filterLogs, getSampleLogs, rangeBounds } from "./sample-logs";

describe("admin access token", () => {
  it("accepts the default demo token ADMIN_ACCESS_TOKEN_123", () => {
    expect(checkAdminToken("ADMIN_ACCESS_TOKEN_123", ADMIN_DEMO_TOKEN).ok).toBe(true);
  });
  it("rejects any other token with 'Invalid token'", () => {
    expect(checkAdminToken("admin_access_token_123", ADMIN_DEMO_TOKEN)).toEqual({
      ok: false,
      message: "Invalid token",
    });
  });
});

describe("new token requirements", () => {
  it("requires at least 12 characters", () => {
    expect(validateNewToken(ADMIN_DEMO_TOKEN, "abc12345678", "abc12345678").ok).toBe(false);
    expect(validateNewToken(ADMIN_DEMO_TOKEN, "abc123456789", "abc123456789").ok).toBe(true);
  });
  it("requires both letters and numbers", () => {
    expect(validateNewToken(ADMIN_DEMO_TOKEN, "abcdefghijkl", "abcdefghijkl").ok).toBe(false);
    expect(validateNewToken(ADMIN_DEMO_TOKEN, "123456789012", "123456789012").ok).toBe(false);
  });
  it("must differ from the current token", () => {
    expect(validateNewToken(ADMIN_DEMO_TOKEN, ADMIN_DEMO_TOKEN, ADMIN_DEMO_TOKEN).ok).toBe(false);
  });
  it("must match the confirmation", () => {
    expect(validateNewToken(ADMIN_DEMO_TOKEN, "abc123456789", "abc123456780").ok).toBe(false);
  });
  it("change-token page verifies the current token first", () => {
    expect(validateTokenChange(ADMIN_DEMO_TOKEN, "wrong", "abc123456789", "abc123456789").ok).toBe(false);
    expect(validateTokenChange(ADMIN_DEMO_TOKEN, ADMIN_DEMO_TOKEN, "abc123456789", "abc123456789").ok).toBe(true);
  });
});

describe("file form", () => {
  it("accepts a size like 167.08MB and rejects free text", () => {
    const base = { name: "CINEMA FRL V7", type: "ZIP", icon: "archive", active: true } as const;
    expect(validateFileDraft({ ...base, size: "167.08MB" }).ok).toBe(true);
    expect(validateFileDraft({ ...base, size: "big" }).ok).toBe(false);
  });
});

describe("statistics filters", () => {
  it("last 7 days covers today and the 6 days before", () => {
    expect(rangeBounds({ kind: "7d" })).toEqual({ from: "2026-11-15", to: "2026-11-21" });
  });
  it("search matches by email or IP", () => {
    const logs = getSampleLogs();
    const first = logs[0];
    expect(first).toBeDefined();
    if (!first) return;
    const byIp = filterLogs(logs, { kind: "30d" }, first.ip);
    expect(byIp.length).toBeGreaterThan(0);
    expect(byIp.every((l) => l.ip.includes(first.ip))).toBe(true);
    expect(filterLogs(logs, { kind: "30d" }, "nobody@nowhere")).toHaveLength(0);
  });
});
