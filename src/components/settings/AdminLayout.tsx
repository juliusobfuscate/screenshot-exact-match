import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  FolderOpen,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  TrendingUp,
  UserCircle2,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { logout as adminLogout, getAdminEmail } from "@/lib/admin/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/settings/panel", label: "Dashboard", icon: LayoutDashboard },
  { to: "/settings/panel/files", label: "File Display", icon: FolderOpen },
  { to: "/settings/panel/config", label: "Configuration", icon: Settings },
  { to: "/settings/panel/stats", label: "Statistics", icon: TrendingUp },
  { to: "/settings/panel/change-token", label: "Change Token", icon: KeyRound },
] as const;

function useLogout() {
  const navigate = useNavigate();
  return () => {
    adminLogout();
    void navigate({ to: "/settings" });
  };
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const logout = useLogout();
  const item =
    "flex h-[44px] items-center gap-3 rounded-[6px] px-3 text-[14px] outline-none transition-colors focus-visible:shadow-adm-focus";
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = path.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              item,
              active
                ? "bg-adm-primary/10 font-medium text-adm-primary"
                : "text-adm-text-soft hover:bg-adm-bg hover:text-adm-text",
            )}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={2} />
            {label}
          </Link>
        );
      })}
      <div className="my-2 border-t border-adm-border" />
      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          logout();
        }}
        className={cn(item, "text-adm-danger hover:bg-adm-danger/10")}
      >
        <LogOut className="size-[18px] shrink-0" strokeWidth={2} />
        Logout
      </button>
    </nav>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const adminEmail = getAdminEmail();

  return (
    <div className="flex min-h-screen flex-col bg-adm-bg font-sans">

      <header className="sticky top-0 z-30 flex h-[56px] items-center gap-3 bg-adm-night px-3 text-primary-foreground md:px-5">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex size-[40px] items-center justify-center rounded-[4px] outline-none hover:bg-primary-foreground/10 focus-visible:shadow-adm-focus md:hidden"
        >
          <Menu className="size-[22px]" />
        </button>
        <img src="/assets/mediafire-white.svg" alt="MediaFire" className="h-auto w-[120px] md:w-[140px]" />
        <span className="hidden h-[22px] border-l border-primary-foreground/25 sm:block" />
        <span className="hidden text-[15px] font-medium tracking-wide sm:block">Admin Panel</span>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto flex h-[40px] items-center gap-2 rounded-[4px] px-2 text-[14px] outline-none hover:bg-primary-foreground/10 focus-visible:shadow-adm-focus">
            <UserCircle2 className="size-[24px]" />
            <span className="hidden sm:inline">{adminEmail || "Admin"}</span>
            <ChevronDown className="size-[16px] opacity-70" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel className="text-[12px] font-normal text-adm-text-soft">
              {adminEmail || "Administrator"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout} className="text-adm-danger focus:text-adm-danger">
              <LogOut className="size-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex flex-1">
        <aside className="hidden shrink-0 border-r border-adm-border bg-card md:block md:w-[200px] lg:w-[250px]">
          <div className="sticky top-[56px]">
            <SidebarNav />
          </div>
        </aside>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[250px] bg-card p-0 [&>button]:top-[18px] [&>button]:text-primary-foreground [&>button]:ring-offset-adm-night [&>button]:data-[state=open]:bg-transparent [&>button>svg]:size-5">
            <SheetTitle className="flex h-[56px] items-center bg-adm-night px-4">
              <img src="/assets/mediafire-white.svg" alt="MediaFire" className="h-auto w-[120px]" />
            </SheetTitle>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
