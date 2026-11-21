/**
 * Test-only validation for the UI practice demo.
 * Nothing here sends, stores or logs input — values live only in React state.
 */
export const DEMO_CODE = "DEMO1234";
export const DEMO_DOMAINS = ["example.com", "example.test"] as const;

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailFormat(email: string): boolean {
  return EMAIL_FORMAT.test(email.trim());
}

export function isDemoEmail(email: string): boolean {
  const value = email.trim().toLowerCase();
  if (!isEmailFormat(value)) return false;
  const domain = value.slice(value.lastIndexOf("@") + 1);
  return (DEMO_DOMAINS as readonly string[]).includes(domain);
}

export type DemoResult = { ok: true; message: string } | { ok: false; message: string };

/** Main login simulation (English). */
export function validateMainLogin(email: string, password: string): DemoResult {
  if (!email.trim()) return { ok: false, message: "Email is required." };
  if (!isEmailFormat(email)) return { ok: false, message: "Please enter a valid email address." };
  if (!isDemoEmail(email))
    return {
      ok: false,
      message:
        "This form is for demonstration data only. Use an address ending in @example.com or @example.test.",
    };
  if (!password) return { ok: false, message: "Password is required." };
  if (password !== DEMO_CODE)
    return { ok: false, message: `Only the demo password ${DEMO_CODE} is accepted.` };
  return { ok: true, message: "Demo login successful." };
}

/** Google-style demo, step one. */
export function validateGoogleEmail(email: string): DemoResult {
  if (!email.trim()) return { ok: false, message: "Masukkan email uji." };
  if (!isDemoEmail(email))
    return {
      ok: false,
      message: "Gunakan alamat email contoh, misalnya demo.user@example.com.",
    };
  return { ok: true, message: email.trim() };
}

/** Google-style demo, step two. */
export function validateGoogleCode(code: string): DemoResult {
  if (!code) return { ok: false, message: "Masukkan kode demonstrasi." };
  if (code !== DEMO_CODE)
    return { ok: false, message: `Kode salah. Gunakan kode demo ${DEMO_CODE}.` };
  return { ok: true, message: "Simulasi login berhasil." };
}

/** Facebook-style demo. */
export function validateFacebookLogin(email: string, code: string): DemoResult {
  if (!email.trim() || !code)
    return { ok: false, message: "Isi email uji dan kode demonstrasi." };
  if (!isDemoEmail(email))
    return {
      ok: false,
      message: "Hanya email contoh (@example.com atau @example.test) yang diterima.",
    };
  if (code !== DEMO_CODE)
    return { ok: false, message: `Kode salah. Gunakan kode demo ${DEMO_CODE}.` };
  return { ok: true, message: "Simulasi login berhasil." };
}
