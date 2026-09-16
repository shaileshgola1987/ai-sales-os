"use client";

import { ErrorState, LoadingState, PrimaryButton, initials } from "@/components/ui";
import { useApi } from "@/lib/use-api";
import type { Customer } from "@/lib/types";

export default function CustomersPage() {
  const { data, error, loading, reload } = useApi<Customer[]>("/api/customers");
  if (loading) return <LoadingState label="Loading customers…" />;
  if (error || !data) return <ErrorState message={error ?? "No data"} onRetry={reload} />;

  const healthColor = (n: number) =>
    n >= 80 ? "text-green-400" : n >= 60 ? "text-amber-400" : "text-red-400";
  const bar = (n: number) => (n >= 80 ? "bg-green-500" : n >= 60 ? "bg-amber-500" : "bg-red-500");

  return (
    <div className="h-full flex flex-col">
      <div className="p-5 border-b border-[--border] flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Customer Management</h1>
          <p className="text-xs text-[--muted-foreground]">
            360° customer view · {data.length} accounts
          </p>
        </div>
        <PrimaryButton>+ Add Customer</PrimaryButton>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {data.map((c) => (
          <div
            key={c.name}
            className="bg-[--card] border border-[--border] rounded-xl p-4 hover:border-[--primary]/20 transition-all cursor-pointer"
          >
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[--secondary] flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {initials(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{c.name}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "Active"
                        ? "bg-green-950/50 text-green-400"
                        : "bg-red-950/50 text-red-400"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-[--muted-foreground]">{c.company}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-[--muted-foreground] mb-1">Health Score</p>
                <p className={`font-mono-data text-2xl font-bold ${healthColor(c.health)}`}>
                  {c.health}
                </p>
                <div className="w-16 h-1.5 bg-[--border] rounded-full mt-1 mx-auto overflow-hidden">
                  <div className={`h-full ${bar(c.health)} rounded-full`} style={{ width: `${c.health}%` }} />
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-[--muted-foreground]">Total Orders</p>
                <p className="font-mono-data text-lg font-bold text-white">{c.orders}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-[--muted-foreground]">Lifetime Value</p>
                <p className="font-mono-data text-lg font-bold text-[--primary]">{c.orderValue}</p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs text-[--muted-foreground]">Last Order</p>
                <p className="text-sm font-medium text-white">{c.lastOrder}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-xs bg-green-950/40 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  className="text-xs bg-[--secondary] text-[--muted-foreground] border border-[--border] px-3 py-1.5 rounded-lg hover:text-white"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
