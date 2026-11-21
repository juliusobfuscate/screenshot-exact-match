import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  title,
  value,
  label,
  tone = "primary",
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  label: string;
  tone?: "primary" | "success";
}) {
  return (
    <div className="flex items-start gap-4 rounded-[8px] bg-card p-6 shadow-adm-card">
      <span
        className={cn(
          "flex size-[44px] shrink-0 items-center justify-center rounded-full",
          tone === "success" ? "bg-adm-success/12 text-adm-success" : "bg-adm-primary/12 text-adm-primary",
        )}
      >
        <Icon className="size-[22px]" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[14px] text-adm-text-soft">{title}</p>
        <p className="mt-[2px] text-[26px] leading-tight font-bold text-adm-text">{value}</p>
        <p className="mt-[2px] text-[12px] text-adm-text-faint">{label}</p>
      </div>
    </div>
  );
}
