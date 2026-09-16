import Link from "next/link";
import { ErrorState, ScoreBadge, StatusChip, TempDot } from "@/components/ui";
import { loadApi } from "@/lib/load-api";
import type { DashboardPayload } from "@/lib/types";

export default async function DashboardPage() {
  const { data, error } = await loadApi<DashboardPayload>("/api/dashboard");
  if (error || !data) {
    return <ErrorState message={error ?? "No data"} />;
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Sales Command Center</h1>
          <p className="text-xs text-[--muted-foreground] mt-1">{data.greeting}</p>
        </div>
        <Link
          href="/leads"
          className="bg-[--primary] text-black text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all"
        >
          + Add Lead
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-[--card] border ${kpi.border} rounded-xl p-4 hover:border-opacity-60 transition-all`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[--muted-foreground] font-medium uppercase tracking-wider">
                  {kpi.label}
                </p>
                <p className={`font-display text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-[--muted-foreground] mt-1">{kpi.sub}</p>
              </div>
              <span className="text-2xl">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 bg-[--card] border border-[--border] rounded-xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {data.funnel.map((stage) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[--muted-foreground]">{stage.stage}</span>
                  <span className="font-mono-data text-xs text-white font-medium">
                    {stage.count.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-[--border] rounded-full overflow-hidden">
                  <div className={`h-full ${stage.color} rounded-full`} style={{ width: `${stage.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[--border] flex justify-between text-xs">
            <span className="text-[--muted-foreground]">Overall conversion</span>
            <span className="font-mono-data text-green-400 font-semibold">{data.conversion}</span>
          </div>
        </div>

        <div className="xl:col-span-2 bg-[--card] border border-[--border] rounded-xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">Team Performance · Sep</h3>
          <div className="space-y-4">
            {data.team.map((member) => (
              <div key={member.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[--border] flex items-center justify-center text-xs font-bold text-white">
                      {member.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <span className="text-sm font-medium text-white">{member.name}</span>
                  </div>
                  <span
                    className={`font-mono-data text-xs font-semibold ${
                      member.pct >= 90
                        ? "text-green-400"
                        : member.pct >= 70
                          ? "text-amber-400"
                          : "text-red-400"
                    }`}
                  >
                    {member.pct}%
                  </span>
                </div>
                <div className="h-1.5 bg-[--border] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      member.pct >= 90
                        ? "bg-green-500"
                        : member.pct >= 70
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${member.pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-[--muted-foreground]">
                  <span>
                    {member.achieved} / {member.target}
                  </span>
                  <span>
                    {member.leads} leads · {member.visits} visits
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[--card] border border-[--border] rounded-xl p-5">
          <h3 className="font-display font-semibold text-white mb-4">Live Activity</h3>
          <div className="space-y-3">
            {data.activity.map((item) => (
              <div key={item.text} className="flex gap-2.5">
                <span className="text-base leading-none mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs text-[--foreground] leading-snug">{item.text}</p>
                  <p className="text-xs text-[--muted-foreground] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[--card] border border-[--border] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-white">Hot Leads — Action Required</h3>
          <Link href="/leads" className="text-xs text-[--primary]">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {data.hotLeads.map((lead) => (
            <Link
              key={lead.id}
              href="/leads"
              className="bg-[--secondary] rounded-lg p-3 border border-red-500/10 hover:border-red-500/30 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <ScoreBadge score={lead.score} temp={lead.temp} />
                <TempDot temp={lead.temp} />
              </div>
              <p className="text-sm font-semibold text-white">{lead.name}</p>
              <p className="text-xs text-[--muted-foreground] truncate">{lead.company}</p>
              <p className="text-xs text-[--primary] font-semibold mt-1">{lead.value}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[--muted-foreground]">{lead.lastContact}</span>
                <StatusChip status={lead.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
