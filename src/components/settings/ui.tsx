import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

import type { RuleResult } from "@/lib/admin/rules";
import { cn } from "@/lib/utils";

export function AdminCard({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-[8px] bg-card p-6 shadow-adm-card", className)}>{children}</section>;
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[24px] leading-tight font-bold text-adm-text">{title}</h1>
        {subtitle && <p className="mt-1 text-[14px] text-adm-text-soft">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

type Variant = "primary" | "secondary" | "danger" | "ghost";
const variants: Record<Variant, string> = {
  primary: "bg-adm-primary text-primary-foreground hover:bg-adm-primary-dark",
  secondary: "border-2 border-adm-primary bg-card text-adm-primary hover:bg-adm-primary/5",
  danger: "bg-adm-danger text-primary-foreground hover:bg-adm-danger/90",
  ghost: "text-adm-text-soft hover:bg-adm-bg hover:text-adm-text",
};

export function AdminButton({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[4px] px-5 text-[14px] font-medium transition outline-none focus-visible:shadow-adm-focus active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto",
        variants[variant],
        className,
      )}
    />
  );
}

const fieldBase =
  "block w-full rounded-[4px] border border-adm-border bg-card px-4 py-3 text-[14px] text-adm-text outline-none transition placeholder:text-adm-text-faint focus:border-adm-primary focus:shadow-adm-focus [&[readonly]]:bg-adm-bg [&[readonly]]:text-adm-text-soft";

export function AdminInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input autoComplete="off" spellCheck={false} {...props} className={cn(fieldBase, className)} />;
}

export function AdminSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(fieldBase, "appearance-auto pr-3", className)}>
      {children}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label htmlFor={htmlFor} className="text-[14px] font-medium text-adm-text">
        {label}
      </label>
      {children}
      {hint && <p className="text-[12px] text-adm-text-faint">{hint}</p>}
    </div>
  );
}

export function FormMessage({ result }: { result: RuleResult | null }) {
  if (!result) return null;
  return (
    <p
      role={result.ok ? "status" : "alert"}
      className={cn(
        "rounded-[4px] px-3 py-2 text-[13px]",
        result.ok ? "bg-adm-success/10 text-adm-success" : "bg-adm-danger/10 text-adm-danger",
      )}
    >
      {result.message}
    </p>
  );
}

export function Toggle({
  id,
  checked,
  onChange,
  labels = ["Active", "Inactive"],
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  labels?: [string, string];
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 rounded-[4px] py-2 text-[14px] text-adm-text outline-none focus-visible:shadow-adm-focus"
    >
      <span
        className={cn(
          "relative h-[22px] w-[40px] rounded-full transition-colors",
          checked ? "bg-adm-success" : "bg-adm-border",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] left-[3px] size-[16px] rounded-full bg-card shadow transition-transform",
            checked && "translate-x-[18px]",
          )}
        />
      </span>
      {checked ? labels[0] : labels[1]}
    </button>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-[10px] py-[2px] text-[12px] font-medium",
        active ? "bg-adm-success/15 text-adm-success" : "bg-adm-border text-adm-text-soft",
      )}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
