import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Download, File, Plus, Settings, Users } from "lucide-react";

import { StatCard } from "@/components/settings/StatCard";
import { AdminCard, PageHeader, StatusBadge } from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import { getSampleLogs, summarize } from "@/lib/admin/sample-logs";
import { useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/dashboard")({
  head: () => adminMeta("Dashboard", "Overview of the admin settings simulation with sample statistics."),
  component: Dashboard,
});

const actionClass =
  "inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[4px] px-5 text-[14px] font-medium outline-none transition focus-visible:shadow-adm-focus active:scale-[0.98] sm:w-auto";

function Dashboard() {
  const files = useAdmin((s) => s.files);
  const { uniqueVisitors, downloads } = summarize(getSampleLogs());
  const active = files.filter((f) => f.active);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Dashboard" subtitle="Overview of the file display and sample activity." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} title="Total Visitors" value={String(uniqueVisitors)} label="Unique visitors" />
        <StatCard icon={Download} title="File Downloads" value={String(downloads)} label="Total downloads" />
        <StatCard icon={File} title="Active Files" value={String(active.length)} label="Displayed files" />
        <StatCard
          icon={CheckCircle}
          title="System Status"
          value="Online"
          label="All systems operational"
          tone="success"
        />
      </div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Quick Actions</h2>
          <p className="mt-1 text-[14px] text-adm-text-soft">Jump to the most common tasks.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/settings/files" className={`${actionClass} bg-adm-primary text-primary-foreground hover:bg-adm-primary-dark`}>
              <Plus className="size-[18px]" /> Add New File
            </Link>
            <Link
              to="/settings/config"
              className={`${actionClass} border-2 border-adm-primary bg-card text-adm-primary hover:bg-adm-primary/5`}
            >
              <Settings className="size-[18px]" /> Update Settings
            </Link>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Files</h2>
          <ul className="mt-4 divide-y divide-adm-border">
            {files.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                <span className="min-w-0 truncate text-adm-text">{f.name}</span>
                <span className="flex shrink-0 items-center gap-3 text-adm-text-soft">
                  {f.size}
                  <StatusBadge active={f.active} />
                </span>
              </li>
            ))}
            {files.length === 0 && <li className="py-3 text-[14px] text-adm-text-faint">No files yet.</li>}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
