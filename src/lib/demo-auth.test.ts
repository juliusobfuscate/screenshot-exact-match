import { describe, expect, it } from "vitest";

import {
  validateFacebookLogin,
  validateGoogleCode,
  validateGoogleEmail,
  validateMainLogin,
} from "./demo-auth";

describe("main login simulation", () => {
  it("requires an email first", () => {
    expect(validateMainLogin("", "")).toEqual({ ok: false, message: "Email is required." });
  });
  it("rejects a badly formatted email", () => {
    expect(validateMainLogin("not-an-email", "DEMO1234").message).toBe(
      "Please enter a valid email address.",
    );
  });
  it("rejects real personal email domains", () => {
    const r = validateMainLogin("someone@gmail.com", "DEMO1234");
    expect(r.ok).toBe(false);
    expect(r.message).toContain("demonstration data only");
  });
  it("asks for the password once a demo email is given", () => {
    expect(validateMainLogin("demo@example.com", "").message).toBe("Password is required.");
  });
  it("only accepts the fixed demo password", () => {
    expect(validateMainLogin("demo@example.com", "hunter2").ok).toBe(false);
    expect(validateMainLogin("demo@example.test", "DEMO1234")).toEqual({
      ok: true,
      message: "Demo login successful.",
    });
  });
});

describe("google-style demo", () => {
  it("validates the step-one email", () => {
    expect(validateGoogleEmail("").message).toBe("Masukkan email uji.");
    expect(validateGoogleEmail("djjuhg@gmail.com").message).toBe(
      "Gunakan alamat email contoh, misalnya demo.user@example.com.",
    );
    expect(validateGoogleEmail("latihan123@example.com")).toEqual({
      ok: true,
      message: "latihan123@example.com",
    });
  });
  it("only accepts DEMO1234 as the step-two code", () => {
    expect(validateGoogleCode("demo1234").ok).toBe(false);
    expect(validateGoogleCode("DEMO1234").message).toBe("Simulasi login berhasil.");
  });
});

describe("facebook-style demo", () => {
  it("requires both fields and test credentials", () => {
    expect(validateFacebookLogin("demo@example.com", "").ok).toBe(false);
    expect(validateFacebookLogin("me@yahoo.com", "DEMO1234").ok).toBe(false);
    expect(validateFacebookLogin("demo@example.com", "DEMO1234").ok).toBe(true);
  });
});
