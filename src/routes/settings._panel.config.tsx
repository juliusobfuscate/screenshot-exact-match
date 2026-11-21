import { createFileRoute } from "@tanstack/react-router";
import { Mail, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
  Field,
  FormMessage,
  PageHeader,
} from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import { TOKEN_MIN_LENGTH, validateNewToken, type RuleResult } from "@/lib/admin/rules";
import { adminActions, getAdminState, useAdmin } from "@/lib/admin/store";
import { isDemoEmail } from "@/lib/demo-auth";

export const Route = createFileRoute("/settings/_panel/config")({
  head: () => adminMeta("Configuration", "General site and security settings for the admin panel simulation."),
  component: ConfigPage,
});

function ConfigPage() {
  const site = useAdmin((s) => s.site);
  const files = useAdmin((s) => s.files);
  const [siteName, setSiteName] = useState(site.siteName);
  const [adminEmail, setAdminEmail] = useState(site.adminEmail);
  const [defaultFileId, setDefaultFileId] = useState(site.defaultFileId);
  const [newToken, setNewToken] = useState("");
  const [confirmToken, setConfirmToken] = useState("");
  const [result, setResult] = useState<RuleResult | null>(null);

  const emailOk = isDemoEmail(adminEmail);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) return setResult({ ok: false, message: "Site name is required." });
    if (!emailOk)
      return setResult({
        ok: false,
        message: "Admin email must be a demo address ending in @example.com or @example.test.",
      });
    if (newToken || confirmToken) {
      const r = validateNewToken(getAdminState().token, newToken, confirmToken);
      if (!r.ok) return setResult(r);
      adminActions.setToken(newToken);
    }
    adminActions.saveSite({ siteName: siteName.trim(), adminEmail: adminEmail.trim(), defaultFileId });
    setNewToken("");
    setConfirmToken("");
    setResult({ ok: true, message: "Configuration saved for this demo session." });
    toast.success("Configuration saved");
  };

  const testEmail = () => {
    if (!emailOk) {
      setResult({ ok: false, message: "Enter a demo admin email (@example.com or @example.test) first." });
      return;
    }
    toast.info(`Demo only — no email was actually sent to ${adminEmail.trim()}.`);
  };

  return (
    <div className="mx-auto max-w-[820px]">
      <PageHeader title="Configuration" subtitle="General site and security settings." />

      <form onSubmit={onSubmit} noValidate autoComplete="off" className="flex flex-col gap-8">
        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Site Settings</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="Site Name" htmlFor="site-name">
              <AdminInput id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </Field>
            <Field label="Admin Email" htmlFor="admin-email" hint="Demo addresses only (@example.com / @example.test).">
              <AdminInput
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                  setResult(null);
                }}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Default File" htmlFor="default-file">
                <AdminSelect id="default-file" value={defaultFileId} onChange={(e) => setDefaultFileId(e.target.value)}>
                  {files.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.size})
                    </option>
                  ))}
                </AdminSelect>
              </Field>
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Security Settings</h2>
          <p className="mt-1 text-[14px] text-adm-text-soft">
            Leave the new token empty to keep the current one. Use a made-up token, never a real password.
          </p>
          <div className="mt-5 grid gap-5">
            <Field label="Current Token" htmlFor="current-token">
              <AdminInput id="current-token" value="********" readOnly />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="New Token" htmlFor="new-token" hint={`At least ${TOKEN_MIN_LENGTH} characters, letters and numbers.`}>
                <AdminInput
                  id="new-token"
                  type="password"
                  value={newToken}
                  onChange={(e) => {
                    setNewToken(e.target.value);
                    setResult(null);
                  }}
                />
              </Field>
              <Field label="Confirm Token" htmlFor="confirm-token">
                <AdminInput
                  id="confirm-token"
                  type="password"
                  value={confirmToken}
                  onChange={(e) => {
                    setConfirmToken(e.target.value);
                    setResult(null);
                  }}
                />
              </Field>
            </div>
          </div>
        </AdminCard>

        <FormMessage result={result} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <AdminButton type="submit">
            <Save className="size-[18px]" /> Save Configuration
          </AdminButton>
          <AdminButton variant="secondary" onClick={testEmail}>
            <Mail className="size-[18px]" /> Test Email
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
