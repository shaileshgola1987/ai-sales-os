"use client";

import { ErrorState, LoadingState } from "@/components/ui";
import { useApi } from "@/lib/use-api";
import type { Visit } from "@/lib/types";

export default function SfaPage() {
  const { data, error, loading, reload } = useApi<Visit[]>("/api/sfa");
  if (loading) return <LoadingState label="Loading field visits…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  const live = data.filter((v) => v.status === "Checked In").length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border] flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Field Sales Automation</h1>
          <p className="text-xs text-[--muted-foreground]">
            GPS tracking · visit logs · activity monitoring
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-950/40 px-3 py-1.5 rounded-full border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {live} field agent live
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {data.map((visit) => (
          <div
            key={`${visit.salesperson}-${visit.checkIn}`}
            className={`bg-[--card] border rounded-xl p-4 ${
              visit.status === "Checked In"
                ? "border-green-500/30 bg-green-950/5"
                : "border-[--border]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                  visit.status === "Checked In" ? "bg-green-500 animate-pulse" : "bg-[--border]"
                }`}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-white">{visit.salesperson}</p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      visit.status === "Checked In"
                        ? "bg-green-950/50 text-green-400"
                        : "bg-[--secondary] text-[--muted-foreground]"
                    }`}
                  >
                    {visit.status}
                  </span>
                </div>
                <p className="text-sm text-[--muted-foreground]">📍 {visit.company}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[--muted-foreground]">
                  <span>Check-in: {visit.checkIn}</span>
                  {visit.checkOut && <span>Check-out: {visit.checkOut}</span>}
                  <span className="font-mono-data text-white font-medium">{visit.duration}</span>
                </div>
                {visit.notes && (
                  <p className="mt-2 text-xs text-[--foreground] bg-[--secondary] rounded-lg px-3 py-2 border border-[--border]">
                    {visit.notes}
                  </p>
                )}
                <p className="mt-1 text-xs text-[--muted-foreground] font-mono-data">{visit.gps}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
