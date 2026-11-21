import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AdminButton, AdminCard, AdminInput, Field, FormMessage, PageHeader } from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import { TOKEN_MIN_LENGTH, validateTokenChange, type RuleResult } from "@/lib/admin/rules";
import { adminActions, getAdminState, getAdminToken } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/change-token")({
  head: () => adminMeta("Change Token", "Change the access token for the admin panel."),
  component: ChangeTokenPage,
});

function ChangeTokenPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [result, setResult] = useState<RuleResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const clear = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate with current token
    const r = validateTokenChange(getAdminState().token, current, next, confirm);
    setResult(r);
    if (!r.ok) return;

    setIsLoading(true);
    
    try {
      const token = getAdminToken();
      if (!token) {
        setResult({ ok: false, message: "Not authenticated" });
        setIsLoading(false);
        return;
      }

      // Update token in backend
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          admin_token: next
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setResult({ ok: false, message: data.message || "Failed to update token" });
        setIsLoading(false);
        return;
      }

      adminActions.setToken(next);
      clear();
      toast.success("Token changed successfully");
    } catch (error) {
      setResult({ ok: false, message: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const edit = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-[560px]">
      <PageHeader title="Change Token" subtitle="Replace the token used to access this panel." />
      <AdminCard>
        <form onSubmit={onSubmit} noValidate autoComplete="off" className="flex flex-col gap-5">
          <Field label="Current Token" htmlFor="ct-current">
            <AdminInput id="ct-current" type="password" value={current} onChange={edit(setCurrent)} />
          </Field>
          <Field label="New Token" htmlFor="ct-new" hint={`At least ${TOKEN_MIN_LENGTH} characters with letters and numbers, different from the current token.`}>
            <AdminInput id="ct-new" type="password" value={next} onChange={edit(setNext)} />
          </Field>
          <Field label="Confirm New Token" htmlFor="ct-confirm">
            <AdminInput id="ct-confirm" type="password" value={confirm} onChange={edit(setConfirm)} />
          </Field>
          <p className="text-[12px] text-adm-text-faint">
            Use a strong, unique token. Keep it secret.
          </p>
          <FormMessage result={result} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <AdminButton type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </AdminButton>
            <AdminButton
              variant="secondary"
              onClick={() => {
                clear();
                void navigate({ to: "/settings/panel" });
              }}
            >
              Cancel
            </AdminButton>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
