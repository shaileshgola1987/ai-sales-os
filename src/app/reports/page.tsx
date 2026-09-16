"use client";

import { ErrorState, GhostButton, LoadingState, initials } from "@/components/ui";
import { useApi } from "@/lib/use-api";
import type { AnalyticsPayload } from "@/lib/types";

const SOURCE_COLORS = [
  "bg-violet-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-rose-500",
];

export default function ReportsPage() {
  const { data, error, loading, reload } = useApi<AnalyticsPayload>("/api/analytics");
  if (loading) return <LoadingState label="Loading reports…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  const ranked = [...data.team].sort((a, b) => b.pct - a.pct);

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Analytics & Reports</h1>
          <p className="text-xs text-[--muted-foreground]">{data.updated}</p>
        </div>
        <div className="flex gap-2">
          <GhostButton>Export CSV</GhostButton>
          <GhostButton>Export PDF</GhostButton>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {data.kpis.map((kpi) => (
          <div key={kpi.label} className="bg-[--card] border border-[--border] rounded-xl p-4">
            <p className="text-xs text-[--muted-foreground] uppercase tracking-wider font-medium">
              {kpi.label}
            </p>
            <p className="font-display text-2xl font-bold text-white mt-1">{kpi.value}</p>
            <p className={`text-xs font-semibold mt-1 ${kpi.up ? "text-green-400" : "text-red-400"}`}>
              {kpi.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-[--card] border border-[--border] rounded-xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">Lead Sources</h3>
          <div className="space-y-3">
            {data.sources.map((s, i) => (
              <div key={s.source}>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${SOURCE_COLORS[i]}`} />
                    <span className="text-sm text-white">{s.source}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-data text-xs text-[--muted-foreground]">{s.leads}</span>
                    <span className="font-mono-data text-xs font-semibold text-white w-8 text-right">
                      {s.pct}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-[--border] rounded-full overflow-hidden">
                  <div className={`h-full ${SOURCE_COLORS[i]} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[--card] border border-[--border] rounded-xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">AI Score Distribution</h3>
          <div className="space-y-2">
            {data.scores.map((s) => (
              <div key={s.range}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white">{s.range}</span>
                  <span className="font-mono-data text-xs text-[--muted-foreground]">
                    {s.count} leads
                  </span>
                </div>
                <div className="h-5 bg-[--border] rounded overflow-hidden flex items-center">
                  <div className={`h-full ${s.color} rounded`} style={{ width: `${s.pct}%` }}>
                    <span className="text-xs text-white font-semibold pl-2 leading-5">{s.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[--card] border border-[--border] rounded-xl p-5 overflow-x-auto">
        <h3 className="font-display font-semibold text-white mb-4">Team Leaderboard · September 2026</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[--border]">
              {["Rank", "Salesperson", "Leads", "Closed", "Revenue", "Target", "% Achieved", "Visits", "Calls"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs text-[--muted-foreground] uppercase tracking-wider pb-2 pr-4"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border]">
            {ranked.map((row, i) => (
              <tr key={row.name} className="hover:bg-[--secondary] transition-colors">
                <td className="py-3 pr-4">
                  <span
                    className={`font-mono-data text-sm font-bold ${
                      i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : "text-amber-700"
                    }`}
                  >
                    #{i + 1}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[--border] flex items-center justify-center text-xs font-bold text-white">
                      {initials(row.name)}
                    </div>
                    <span className="text-sm font-medium text-white">{row.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 font-mono-data text-sm">{row.leads}</td>
                <td className="py-3 pr-4 font-mono-data text-sm">{row.closed}</td>
                <td className="py-3 pr-4 font-mono-data text-sm font-semibold text-[--primary]">
                  {row.achieved}
                </td>
                <td className="py-3 pr-4 font-mono-data text-sm text-[--muted-foreground]">{row.target}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`font-mono-data text-sm font-bold ${
                      row.pct >= 90 ? "text-green-400" : row.pct >= 70 ? "text-amber-400" : "text-red-400"
                    }`}
                  >
                    {row.pct}%
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono-data text-sm">{row.visits}</td>
                <td className="py-3 font-mono-data text-sm">{row.calls}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
