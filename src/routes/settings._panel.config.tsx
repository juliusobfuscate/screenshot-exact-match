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
import { adminActions, getAdminState, useAdmin, getAdminToken } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/config")({
  head: () => adminMeta("Configuration", "General site and security settings."),
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
  const [isLoading, setIsLoading] = useState(false);

  const emailOk = adminEmail.trim().length > 0;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!siteName.trim()) {
      setResult({ ok: false, message: "Site name is required." });
      return;
    }
    
    if (!emailOk) {
      setResult({ ok: false, message: "Admin email is required." });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail.trim())) {
      setResult({ ok: false, message: "Please enter a valid email address." });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update admin email in backend
      const token = getAdminToken();
      if (token) {
        const response = await fetch('/api/admin/config', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            admin_email: adminEmail.trim()
          })
        });

        if (!response.ok) {
          const data = await response.json();
          setResult({ ok: false, message: data.message || "Failed to update email" });
          setIsLoading(false);
          return;
        }
      }

      if (newToken || confirmToken) {
        const r = validateNewToken(getAdminState().token, newToken, confirmToken);
        if (!r.ok) {
          setResult(r);
          setIsLoading(false);
          return;
        }
        // Update token in backend
        if (token) {
          const response = await fetch('/api/admin/config', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              admin_token: newToken
            })
          });

          if (!response.ok) {
            const data = await response.json();
            setResult({ ok: false, message: data.message || "Failed to update token" });
            setIsLoading(false);
            return;
          }
        }
        adminActions.setToken(newToken);
      }
      
      adminActions.saveSite({ siteName: siteName.trim(), adminEmail: adminEmail.trim(), defaultFileId });
      setNewToken("");
      setConfirmToken("");
      setResult({ ok: true, message: "Configuration saved successfully." });
      toast.success("Configuration saved");
    } catch (error) {
      setResult({ ok: false, message: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const testEmail = () => {
    if (!emailOk) {
      setResult({ ok: false, message: "Enter a valid admin email first." });
      return;
    }
    toast.info(`Test email sent to ${adminEmail.trim()}`);
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
            <Field label="Admin Email" htmlFor="admin-email">
              <AdminInput
                id="admin-email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </Field>
            <Field label="Default File" htmlFor="default-file">
              <AdminSelect
                id="default-file"
                value={defaultFileId}
                onValueChange={setDefaultFileId}
              >
                {files.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.type}, {f.size})
                  </option>
                ))}
              </AdminSelect>
            </Field>
          </div>
          <AdminButton
            type="button"
            onClick={testEmail}
            variant="outline"
            className="mt-5 w-full sm:w-auto"
          >
            <Mail className="size-4" /> Test Email Notification
          </AdminButton>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Security</h2>
          <p className="mt-1 text-[14px] text-adm-text-soft">
            Change the admin access token. Current token will remain valid until you logout.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="New Token" htmlFor="new-token" hint={`Minimum ${TOKEN_MIN_LENGTH} characters, letters + numbers`}>
              <AdminInput
                id="new-token"
                type="password"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                placeholder="Enter new token"
              />
            </Field>
            <Field label="Confirm Token" htmlFor="confirm-token">
              <AdminInput
                id="confirm-token"
                type="password"
                value={confirmToken}
                onChange={(e) => setConfirmToken(e.target.value)}
                placeholder="Confirm new token"
              />
            </Field>
          </div>
        </AdminCard>

        {result && (
          <FormMessage result={result} />
        )}

        <div className="flex justify-end">
          <AdminButton type="submit" disabled={isLoading}>
            <Save className="size-4" /> {isLoading ? "Saving..." : "Save Configuration"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
