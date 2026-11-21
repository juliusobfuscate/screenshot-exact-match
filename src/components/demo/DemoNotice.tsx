import { cn } from "@/lib/utils";

export function DemoNotice({
  label,
  detail,
  className,
}: {
  label?: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div
      role="note"
      className={cn(
        "w-full bg-notice px-3 py-[3px] text-center font-sans text-[10.5px] leading-[1.45] text-notice-foreground",
        className,
      )}
    >
      <p className="font-bold tracking-wide uppercase">
        {label ?? "UI practice demo — not an official website"}
      </p>
      {detail && <p className="text-[10px] font-medium">{detail}</p>}
    </div>
  );
}
