/**
 * Admin settings simulation rules.
 * The panel is a practice UI: tokens live only in in-memory state for the
 * current tab, are never persisted, sent or logged, and reset on reload.
 */
export const ADMIN_DEMO_TOKEN = "ADMIN_ACCESS_TOKEN_123";
export const TOKEN_MIN_LENGTH = 12;

export type RuleResult = { ok: true; message: string } | { ok: false; message: string };

export function checkAdminToken(input: string, currentToken: string): RuleResult {
  if (!input) return { ok: false, message: "Access token is required." };
  if (input !== currentToken) return { ok: false, message: "Invalid token" };
  return { ok: true, message: "Access granted." };
}

/** Requirements: at least 12 characters, letters + numbers, matches confirmation, differs from current. */
export function validateNewToken(currentToken: string, next: string, confirm: string): RuleResult {
  if (!next) return { ok: false, message: "New token is required." };
  if (next.length < TOKEN_MIN_LENGTH)
    return { ok: false, message: `Token must be at least ${TOKEN_MIN_LENGTH} characters.` };
  if (!/[A-Za-z]/.test(next) || !/[0-9]/.test(next))
    return { ok: false, message: "Token must contain both letters and numbers." };
  if (next === currentToken)
    return { ok: false, message: "New token must be different from the current token." };
  if (next !== confirm) return { ok: false, message: "Tokens do not match." };
  return { ok: true, message: "Token updated for this demo session." };
}

/** Change-token page: verifies the current token first, then the new-token rules. */
export function validateTokenChange(
  storedToken: string,
  enteredCurrent: string,
  next: string,
  confirm: string,
): RuleResult {
  if (!enteredCurrent) return { ok: false, message: "Current token is required." };
  if (enteredCurrent !== storedToken) return { ok: false, message: "Current token is incorrect." };
  return validateNewToken(storedToken, next, confirm);
}

export const FILE_TYPES = ["ZIP", "MP4", "PDF", "JPG"] as const;
export const FILE_ICONS = ["archive", "video", "file", "image"] as const;
export type FileType = (typeof FILE_TYPES)[number];
export type FileIcon = (typeof FILE_ICONS)[number];

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: string;
  icon: FileIcon;
  active: boolean;
}

export type FileDraft = Omit<FileItem, "id">;

const SIZE_FORMAT = /^\d+(\.\d{1,2})?\s?(KB|MB|GB)$/i;

export function validateFileDraft(d: FileDraft): RuleResult {
  if (!d.name.trim()) return { ok: false, message: "File name is required." };
  if (d.name.trim().length > 80) return { ok: false, message: "File name must be 80 characters or fewer." };
  if (!SIZE_FORMAT.test(d.size.trim()))
    return { ok: false, message: "File size must look like 167.08MB (KB, MB or GB)." };
  return { ok: true, message: "File saved." };
}
