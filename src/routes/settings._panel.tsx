import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminLayout } from "@/components/settings/AdminLayout";
import { checkAuth } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel")({
  beforeLoad: () => {
    if (!checkAuth()) throw redirect({ to: "/settings" });
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
