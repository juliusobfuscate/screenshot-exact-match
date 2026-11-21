import type { MouseEvent, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  onActivate?: () => void;
};

/**
 * Link-looking element that never navigates. Keyboard focusable,
 * activates on click/Enter, and shows hover + focus states via className.
 */
export function DemoLink({ children, className, onActivate }: Props) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onActivate?.();
  };
  return (
    <a
      href="#"
      onClick={handle}
      title="Demo link — does not navigate"
      className={cn(
        "cursor-pointer rounded-[2px] underline-offset-2 outline-none transition-colors hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-current/40",
        className,
      )}
    >
      {children}
    </a>
  );
}
