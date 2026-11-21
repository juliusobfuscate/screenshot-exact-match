import { describe, expect, it } from "vitest";

import {
  DEFAULT_ADMIN_TOKEN,
  checkAdminToken,
  validateFileDraft,
  validateNewToken,
  validateTokenChange,
} from "./rules";
import { filterLogs, getSampleLogs, rangeBounds } from "./sample-logs";

describe("admin access token", () => {
  it("accepts the default admin token", () => {
    expect(checkAdminToken(DEFAULT_ADMIN_TOKEN, DEFAULT_ADMIN_TOKEN).ok).toBe(true);
  });
  it("rejects any other token with 'Invalid token'", () => {
    expect(checkAdminToken("wrong_token", DEFAULT_ADMIN_TOKEN)).toEqual({
      ok: false,
      message: "Invalid token",
    });
  });
});

describe("new token requirements", () => {
  it("requires at least 8 characters", () => {
    expect(validateNewToken(DEFAULT_ADMIN_TOKEN, "abc1234", "abc1234").ok).toBe(false);
    expect(validateNewToken(DEFAULT_ADMIN_TOKEN, "abc12345", "abc12345").ok).toBe(true);
  });
  it("requires both letters and numbers", () => {
    expect(validateNewToken(DEFAULT_ADMIN_TOKEN, "abcdefgh", "abcdefgh").ok).toBe(false);
    expect(validateNewToken(DEFAULT_ADMIN_TOKEN, "12345678", "12345678").ok).toBe(false);
  });
  it("must differ from the current token", () => {
    expect(validateNewToken(DEFAULT_ADMIN_TOKEN, DEFAULT_ADMIN_TOKEN, DEFAULT_ADMIN_TOKEN).ok).toBe(false);
  });
  it("must match the confirmation", () => {
    expect(validateNewToken(DEFAULT_ADMIN_TOKEN, "abc12345", "abc12346").ok).toBe(false);
  });
  it("change-token page verifies the current token first", () => {
    expect(validateTokenChange(DEFAULT_ADMIN_TOKEN, "wrong", "abc12345", "abc12345").ok).toBe(false);
    expect(validateTokenChange(DEFAULT_ADMIN_TOKEN, DEFAULT_ADMIN_TOKEN, "abc12345", "abc12345").ok).toBe(true);
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
