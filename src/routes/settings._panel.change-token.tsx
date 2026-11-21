import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AdminButton, AdminCard, AdminInput, Field, FormMessage, PageHeader } from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import { TOKEN_MIN_LENGTH, validateTokenChange, type RuleResult } from "@/lib/admin/rules";
import { adminActions, getAdminState } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/change-token")({
  head: () => adminMeta("Change Token", "Change the access token of the admin panel simulation."),
  component: ChangeTokenPage,
});

function ChangeTokenPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [result, setResult] = useState<RuleResult | null>(null);
  const navigate = useNavigate();

  const clear = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const r = validateTokenChange(getAdminState().token, current, next, confirm);
    setResult(r);
    if (!r.ok) return;
    adminActions.setToken(next);
    clear();
    toast.success("Token changed for this demo session");
  };

  const edit = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-[560px]">
      <PageHeader title="Change Token" subtitle="Replace the token used to open this panel." />
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
            Use a made-up token, never a real password. It resets to the demo token when you reload.
          </p>
          <FormMessage result={result} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <AdminButton type="submit">Save</AdminButton>
            <AdminButton
              variant="secondary"
              onClick={() => {
                clear();
                void navigate({ to: "/settings/dashboard" });
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
