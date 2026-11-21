import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminLayout } from "@/components/settings/AdminLayout";
import { getAdminState } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel")({
  // The demo session lives only in this browser tab's memory, so a direct
  // load or reload always lands back on the access screen.
  beforeLoad: () => {
    if (!getAdminState().isAuthenticated) throw redirect({ to: "/settings" });
  },
  component: PanelLayout,
});

function PanelLayout() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
