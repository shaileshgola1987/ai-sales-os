"use client";

import { ErrorState, LoadingState, PrimaryButton, StatusChip } from "@/components/ui";
import { useApi } from "@/lib/use-api";
import type { Quotation } from "@/lib/types";

export default function QuotationsPage() {
  const { data, error, loading, reload } = useApi<Quotation[]>("/api/quotations");
  if (loading) return <LoadingState label="Loading quotations…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border] flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Quotation Management</h1>
          <p className="text-xs text-[--muted-foreground]">₹20.6L pending · 5 quotations this week</p>
        </div>
        <PrimaryButton>+ New Quotation</PrimaryButton>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {data.map((q) => (
          <div
            key={q.id}
            className="bg-[--card] border border-[--border] rounded-xl p-4 hover:border-[--primary]/20 transition-all"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-40">
                <div className="flex items-center gap-2">
                  <p className="font-mono-data text-sm font-semibold text-white">{q.id}</p>
                  <span className="text-xs text-[--muted-foreground]">{q.date}</span>
                </div>
                <p className="text-sm text-white mt-1">{q.customer}</p>
                <p className="text-xs text-[--muted-foreground]">{q.company}</p>
              </div>
              <div>
                <p className="font-mono-data text-lg font-bold text-[--primary]">{q.amount}</p>
                <p className="text-xs text-[--muted-foreground]">{q.items} items · valid {q.validity}</p>
              </div>
              <StatusChip status={q.status} />
              <button
                type="button"
                className="text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-3 py-1.5 rounded-lg hover:text-white"
              >
                View PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
