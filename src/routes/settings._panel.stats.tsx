import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { AdminCard, AdminInput, AdminSelect, PageHeader } from "@/components/settings/ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { adminMeta } from "@/lib/admin/meta";
import {
  actionsPerHour,
  filterLogs,
  getSampleLogs,
  visitorsPerDay,
  type LogAction,
  type RangeFilter,
} from "@/lib/admin/sample-logs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings/_panel/stats")({
  head: () => adminMeta("Statistics", "Sample visitor and download statistics for the admin panel simulation."),
  component: StatsPage,
});

const lineConfig = { visitors: { label: "Visitors", color: "var(--adm-primary)" } } satisfies ChartConfig;
const barConfig = { actions: { label: "Actions", color: "var(--adm-success)" } } satisfies ChartConfig;

const actionTone: Record<LogAction, string> = {
  View: "bg-adm-primary/12 text-adm-primary",
  Download: "bg-adm-success/15 text-adm-success",
  Login: "bg-adm-warning/25 text-adm-text",
};

function formatTime(iso: string) {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;
}

function StatsPage() {
  const [kind, setKind] = useState<RangeFilter["kind"]>("7d");
  const [from, setFrom] = useState("2026-11-01");
  const [to, setTo] = useState("2026-11-21");
  const [query, setQuery] = useState("");

  const range: RangeFilter = kind === "custom" ? { kind, from, to } : { kind };
  const logs = getSampleLogs();
  const rows = useMemo(() => filterLogs(logs, range, query), [logs, kind, from, to, query]); // eslint-disable-line react-hooks/exhaustive-deps
  const perDay = useMemo(() => visitorsPerDay(rows, range), [rows]); // eslint-disable-line react-hooks/exhaustive-deps
  const perHour = useMemo(() => actionsPerHour(rows), [rows]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Statistics" subtitle="Sample activity data — generated for the demo, no real visitors are tracked." />

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
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-[16px] -translate-y-1/2 text-adm-text-faint" />
            <AdminInput
              id="search"
              type="search"
              value={query}
              placeholder="Search by email or IP"
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </AdminCard>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="text-[18px] font-semibold text-adm-text">Visitors per day</h2>
          <ChartContainer config={lineConfig} className="mt-4 aspect-auto h-[240px] w-full">
            <LineChart data={perDay} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={16} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="visitors" stroke="var(--color-visitors)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </AdminCard>
        <AdminCard>
          <h2 className="text-[18px] font-semibold text-adm-text">Actions per hour</h2>
          <ChartContainer config={barConfig} className="mt-4 aspect-auto h-[240px] w-full">
            <BarChart data={perHour} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} interval={2} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="actions" fill="var(--color-actions)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </AdminCard>
      </div>

      <AdminCard className="mt-6 p-0 sm:p-0">
        <div className="flex items-center justify-between px-6 pt-6">
          <h2 className="text-[18px] font-semibold text-adm-text">Activity log</h2>
          <span className="text-[12px] text-adm-text-faint">{rows.length} entries</span>
        </div>
        <div className="mt-4 max-h-[480px] overflow-auto">
          <table className="w-full min-w-[860px] text-left text-[14px]">
            <thead className="sticky top-0 border-y border-adm-border bg-adm-bg text-[12px] tracking-wide text-adm-text-soft uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Timestamp</th>
                <th className="px-3 py-3 font-medium">Action</th>
                <th className="px-3 py-3 font-medium">IP</th>
                <th className="px-6 py-3 font-medium">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-adm-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-adm-bg/60">
                  <td className="px-6 py-3 text-adm-text-faint">{r.id}</td>
                  <td className="px-3 py-3 text-adm-text">{r.email}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-adm-text-soft">{formatTime(r.timestamp)}</td>
                  <td className="px-3 py-3">
                    <span className={cn("rounded-full px-[10px] py-[2px] text-[12px] font-medium", actionTone[r.action])}>
                      {r.action}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-[13px] text-adm-text-soft">{r.ip}</td>
                  <td className="px-6 py-3 text-adm-text-soft">{r.userAgent}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-adm-text-faint">
                    No activity matches these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
