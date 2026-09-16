"use client";

import { ErrorState, LoadingState, PrimaryButton, ScoreBadge } from "@/components/ui";
import { useApi } from "@/lib/use-api";
import type { Lead } from "@/lib/types";

const BORDER: Record<string, string> = {
  New: "border-slate-500/30",
  Contacted: "border-blue-500/30",
  Qualified: "border-violet-500/30",
  "Proposal Sent": "border-cyan-500/30",
  Negotiation: "border-orange-500/30",
  Won: "border-green-500/30",
};

const TEXT: Record<string, string> = {
  New: "text-slate-400",
  Contacted: "text-blue-400",
  Qualified: "text-violet-400",
  "Proposal Sent": "text-cyan-400",
  Negotiation: "text-orange-400",
  Won: "text-green-400",
};

export default function PipelinePage() {
  const { data, error, loading, reload } = useApi<{
    stages: Record<string, Lead[]>;
    summary: string;
  }>("/api/pipeline");

  if (loading) return <LoadingState label="Loading pipeline…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  const stages = Object.keys(data.stages);

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border] flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Sales Pipeline</h1>
          <p className="text-xs text-[--muted-foreground]">{data.summary}</p>
        </div>
        <PrimaryButton>+ Add Deal</PrimaryButton>
      </div>
      <div className="flex-1 overflow-x-auto p-5">
        <div className="flex gap-4 min-w-max h-full">
          {stages.map((stage) => {
            const cards = data.stages[stage] ?? [];
            return (
              <div key={stage} className="w-64 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${TEXT[stage]}`}>
                    {stage}
                  </span>
                  <span className="text-xs text-[--muted-foreground] font-mono-data">
                    {cards.length}
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  {cards.length === 0 ? (
                    <div className="border-2 border-dashed border-[--border] rounded-xl h-24 flex items-center justify-center">
                      <span className="text-xs text-[--muted-foreground]">No deals</span>
                    </div>
                  ) : (
                    cards.map((lead) => (
                      <div
                        key={lead.id}
                        className={`bg-[--card] border ${BORDER[stage]} rounded-xl p-3 hover:border-[--primary]/30 transition-all cursor-pointer`}
                      >
                        <p className="text-sm font-semibold text-white">{lead.name}</p>
                        <p className="text-xs text-[--muted-foreground] truncate">{lead.company}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-mono-data text-xs font-semibold text-[--primary]">
                            {lead.value}
                          </span>
                          <ScoreBadge score={lead.score} temp={lead.temp} />
                        </div>
                        <p className="text-xs text-[--muted-foreground] mt-1">{lead.assigned}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
