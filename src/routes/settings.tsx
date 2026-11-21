import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsRoot,
});

function SettingsRoot() {
  return (
    <>
      <Outlet />
      <Toaster position="bottom-center" richColors />
    </>
  );
}
