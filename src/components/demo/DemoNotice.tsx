import { cn } from "@/lib/utils";

export function DemoNotice({ label, className }: { label?: string; className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "w-full bg-notice px-3 py-1 text-center font-sans text-[10.5px] font-bold tracking-wide text-notice-foreground uppercase",
        className,
      )}
    >
      {label ?? "UI practice demo — not an official website"}
    </div>
  );
}
